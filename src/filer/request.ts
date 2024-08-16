import {
  MessageKey,
  Request,
  Response,
  SetColorThemeRequest,
  SetColorThemeResponse,
} from '@src/common/messages';
import { ColorTheme } from '@src/common/theme-color';
import * as vscode from 'vscode';

const getId = (key: string) =>
  `${key}-${Date.now()}-${Math.round(Math.random() * 1000)}`;

export const request = <
  Req extends Request<MessageKey>,
  Res extends Response<MessageKey>,
>(
  panel: vscode.WebviewPanel,
  req: Omit<Req, 'id' | 'type'>,
): Promise<Res> =>
  new Promise((resolve, reject) => {
    const data = {
      ...req,
      id: getId(req.key),
      type: 'request',
    } as Req;

    const disposable = panel.webview.onDidReceiveMessage((res: Res) => {
      if (res.id === data.id) {
        if (res.error === undefined) {
          resolve(res);
        } else {
          reject(Error(res.error));
        }

        disposable.dispose();
      }
    });

    panel.webview.postMessage(data);
  });

export const setColorTheme = async (
  panel: vscode.WebviewPanel,
  colorTheme: ColorTheme,
): Promise<void> => {
  await request<SetColorThemeRequest, SetColorThemeResponse>(panel, {
    key: 'set-color-theme',
    colorTheme,
  });
};