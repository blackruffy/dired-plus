import { initializeTheme } from '@src/theme';
import * as vscode from 'vscode';

export type WebViewManager = Readonly<{
  getPanel: () => vscode.WebviewPanel;
}>;

export const createWebViewManager = (
  args: Readonly<{
    id: string;
    title: string;
    context: vscode.ExtensionContext;
    scriptPath: ReadonlyArray<string>;
    startListen: (
      _: Readonly<{
        context: vscode.ExtensionContext;
        panel: vscode.WebviewPanel;
      }>,
    ) => void;
  }>,
): WebViewManager => {
  type State = {
    panels: {
      [idx: number]: vscode.WebviewPanel | null;
    };
  };
  const state: State = {
    panels: {},
  };

  const createHTML = (panel: vscode.WebviewPanel): string => {
    const scriptPathOnDisk = vscode.Uri.joinPath(
      args.context.extensionUri,
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
      },
    );

    panel.onDidDispose(() => {
      state.panels[column] = null;
    });

    args.startListen({ context: args.context, panel });
    panel.webview.html = createHTML(panel);
    return panel;
  };

  const getPanel = (): vscode.WebviewPanel => {
    const column =
      vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

    if (state.panels[column] != null) {
      state.panels[column]?.dispose();
    }
    const newPanel = createWebViewPanel(column);
    state.panels[column] = newPanel;
    initializeTheme(newPanel);
    return newPanel;
  };

  return {
    getPanel,
  };
};
