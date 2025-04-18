import {
  GetLongHistoryRequest,
  GetLongHistoryResponse,
  MessageKey,
  Request,
  errorResponse,
  response,
} from '@src/common/messages';
import { defaultHandlers } from '@src/helpers/listener';
import { LongStorage, State } from '@src/state';
import * as vscode from 'vscode';

export const startListen = (
  appState: State,
  panel: vscode.WebviewPanel,
  longStorage: LongStorage,
): vscode.Disposable => {
  return panel.webview.onDidReceiveMessage(
    async (message: Request<MessageKey>) => {
      try {
        if (!(await defaultHandlers({ appState, panel, message }))) {
          switch (message.key) {
            case 'get-long-history': {
              const req = message as GetLongHistoryRequest;
              panel.webview.postMessage(
                response<GetLongHistoryResponse>(req, {
                  items: longStorage.getHistory(),
                }),
              );
              return;
            }
          }
        }
      } catch (e: unknown) {
        console.error(e);
        panel.webview.postMessage(
          errorResponse(message as Request<MessageKey>, e),
        );
      }
    },
    undefined,
    appState.context.subscriptions,
  );
};
