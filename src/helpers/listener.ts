import {
  GetColorThemeRequest,
  GetColorThemeResponse,
  GetLocaleRequest,
  GetLocaleResponse,
  MessageKey,
  OpenFileRequest,
  OpenFileResponse,
  Request,
  response,
} from '@src/common/messages';
import { openFile } from '@src/filer/helpers';
import { getColorTheme } from '@src/theme';
import * as vscode from 'vscode';

export const defaultHandlers = async ({
  panel,
  message,
}: Readonly<{
  context: vscode.ExtensionContext;
  panel: vscode.WebviewPanel;
  message: Request<MessageKey>;
}>): Promise<boolean> => {
  const active = vscode.window.activeTextEditor;
  switch (message.key) {
    case 'open-file': {
      const req = message as OpenFileRequest;
      await openFile(req.path);
      panel.webview.postMessage(response<OpenFileResponse>(req, {}));
      return true;
    }
    case 'close-panel': {
      panel.dispose();
      if (active) {
        vscode.window.showTextDocument(active.document, active.viewColumn);
      }
      return true;
    }
    case 'get-color-theme': {
      const req = message as GetColorThemeRequest;
      panel.webview.postMessage(
        response<GetColorThemeResponse>(req, {
          colorTheme: getColorTheme(),
        }),
      );
      return true;
    }
    case 'get-locale': {
      const req = message as GetLocaleRequest;
      panel.webview.postMessage(
        response<GetLocaleResponse>(req, {
          locale: vscode.env.language,
        }),
      );
      return true;
    }

    default: {
      return false;
    }
  }
};
