import { updateItemList as diredUpdateItemList } from '@src/filer/request';
import { updateItemList as historyUpdateItemList } from '@src/history/request';
import { State as AppState } from '@src/state';
import { initializeTheme } from '@src/theme';
import * as vscode from 'vscode';

export type WebViewManager = Readonly<{
  getPanel: () => vscode.WebviewPanel;
}>;

type State = {
  panels: {
    [idx: number]: vscode.WebviewPanel | null;
  };
};

export const createWebViewManager = (
  args: Readonly<{
    id: string;
    title: string;
    appState: AppState;
    scriptPath: ReadonlyArray<string>;
    startListen: (
      _: Readonly<{
        appState: AppState;
        panel: vscode.WebviewPanel;
      }>,
    ) => void;
  }>,
): WebViewManager => {
  const state: State = {
    panels: {},
  };

  const createHTML = (panel: vscode.WebviewPanel): string => {
    const scriptPathOnDisk = vscode.Uri.joinPath(
      args.appState.context.extensionUri,
      ...args.scriptPath,
    );
    const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

    return `
      <!doctype html>
      <html>
          <head>
          <meta charset="UTF-8" />
          <title>${args.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body></body>
          <script type="module" src="${scriptUri}"></script>
      </html>
      `;
  };

  const createWebViewPanel = (column: number) => {
    const panel = vscode.window.createWebviewPanel(
      `${args.id}-${column}`, // Identifies the type of the webview. Used internally
      args.title, // Title of the panel displayed to the user
      // Editor column to show the new webview panel in.
      column,
      {
        enableScripts: true,
        // localResourceRoots: [
        //   vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview'),
        // ],
        retainContextWhenHidden: true,
      },
    );

    panel.onDidDispose(() => {
      state.panels[column] = null;
    });

    panel.onDidChangeViewState(async e => {
      if (e.webviewPanel.active === true) {
        if (args.id === 'dired-plus-filer') {
          await diredUpdateItemList(args.appState, panel);
        } else if (args.id === 'dired-plus-history') {
          await historyUpdateItemList(args.appState, panel);
        }
      }
    });

    args.startListen({ appState: args.appState, panel });
    panel.webview.html = createHTML(panel);
    return panel;
  };

  const getPanel = (): vscode.WebviewPanel => {
    const column =
      vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;
    const currentPanel = state.panels[column];

    if (currentPanel == null) {
      const newPanel = createWebViewPanel(column);
      state.panels[column] = newPanel;
      initializeTheme(newPanel);
      return newPanel;
    } else {
      return currentPanel;
    }
  };

  return {
    getPanel,
  };
};
