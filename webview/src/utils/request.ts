import { MessageKey, Request, Response } from '@common/messages';

const vscode = acquireVsCodeApi();

const getId = (key: string) =>
  `${key}-${Date.now()}-${Math.round(Math.random() * 1000)}`;

export const request = <
  Req extends Request<MessageKey>,
  Res extends Response<MessageKey>,
>(
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
