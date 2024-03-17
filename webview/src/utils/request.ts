import {
  ListItemsRequest,
  MessageKey,
  Request,
  Response,
} from '@common/messages';
import { scope } from '@common/scope';

export const request = scope(() => {
  const getId = (key: string) =>
    `${key}-${Date.now()}-${Math.round(Math.random() * 1000)}`;

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
            items: Array.from({ length: 10 }).map((_, i) => {
              const type = i % 2 === 0 ? 'directory' : 'file';
              return {
                name: `${type}${i}`,
                path: `${r.path}/${type}${i}`,
                type: type,
              };
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
      new Promise(resolve => {
        const data = {
          ...req,
          id: getId(req.key),
          type: 'request',
        } as Req;

        const callback = (event: MessageEvent<Res>) => {
          if (event.data.id === data.id) {
            resolve(event.data);
            window.removeEventListener('message', callback);
          }
        };
        window.addEventListener('message', callback);
        vscode.postMessage(data);
      });
  }
});
