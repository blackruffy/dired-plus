import { DiredItem } from '@common/dired-item';
import {
  ListItemsRequest,
  MessageKey,
  Request,
  Response,
} from '@common/messages';
import { scope } from '@common/scope';
import { identity } from 'fp-ts/lib/function';
import { v4 as uuidv4 } from 'uuid';

export const request = scope(() => {
  const getId = (key: string) => `${key}-${uuidv4()}`;

  if (import.meta.env.MODE === 'mock') {
    return async <
      Req extends Request<MessageKey>,
      Res extends Response<MessageKey>,
    >(
      req: Omit<Req, 'id' | 'type'>,
    ): Promise<Res> => {
      const id = getId(req.key);
      const r = req as unknown as ListItemsRequest;
      switch (req.key) {
        case 'list-items':
          return {
            key: req.key,
            id,
            type: 'response',
            path: r.path,
            items: Array.from({ length: 100 }).map((_, i) => {
              const type = i % 2 === 0 ? 'directory' : 'file';
              const path = `${r.path}/${type}${i}`;
              return identity<DiredItem>({
                name: `${type}${i}`,
                path,
                itemType: type,
              });
            }),
          } as unknown as Res;
        case 'open-file':
          return { key: req.key, id, type: 'response' } as Res;
        default:
          return { key: req.key, id, type: 'response' } as unknown as Res;
      }
    };
  } else {
    const vscode = acquireVsCodeApi();

    return <Req extends Request<MessageKey>, Res extends Response<MessageKey>>(
      req: Omit<Req, 'id' | 'type'>,
    ): Promise<Res> =>
      new Promise((resolve, reject) => {
        const data = {
          ...req,
          id: getId(req.key),
          type: 'request',
        } as Req;

        const callback = (event: MessageEvent<Res>) => {
          if (event.data.id === data.id) {
            if (event.data.error === undefined) {
              resolve(event.data);
            } else {
              reject(Error(event.data.error));
            }

            window.removeEventListener('message', callback);
          }
        };
        window.addEventListener('message', callback);
        vscode.postMessage(data);
      });
  }
});
