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
    panel: vscode.WebviewPanel | null;
  };
  const state: State = {
    panel: null,
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

  const createWebViewPanel = () => {
    const panel = vscode.window.createWebviewPanel(
      args.id, // Identifies the type of the webview. Used internally
      args.title, // Title of the panel displayed to the user
      // Editor column to show the new webview panel in.
      vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One,
      {
        enableScripts: true,
        // localResourceRoots: [
        //   vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview'),
        // ],
      },
    );
    panel.onDidDispose(() => {
      state.panel = null;
    });

    args.startListen({ context: args.context, panel });
    panel.webview.html = createHTML(panel);
    return panel;
  };

  const getPanel = (): vscode.WebviewPanel => {
    if (state.panel !== null) {
      state.panel.dispose();
    }
    state.panel = createWebViewPanel();
    initializeTheme(state.panel);
    return state.panel;
  };

  return {
    getPanel,
  };
};
