import { scope } from '@src/common/scope';
import * as vscode from 'vscode';
import { startListen } from './listener';

type State = {
  webViewManager?: WebViewManager;
};

type WebViewManager = Readonly<{
  panel: vscode.WebviewPanel;
}>;

const state: State = {};

const createPanel = () =>
  vscode.window.createWebviewPanel(
    'filer', // Identifies the type of the webview. Used internally
    'Filer', // Title of the panel displayed to the user
    // Editor column to show the new webview panel in.
    vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One,
    {
      enableScripts: true,
      // localResourceRoots: [
      //   vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview'),
      // ],
    }, // Webview options. More on these later.
  );

const createHTML = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
): string => {
  const scriptPathOnDisk = vscode.Uri.joinPath(
    context.extensionUri,
    'dist',
    'webview',
    'index.js',
  );

  const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>IncrementalFiler</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body></body>
    <script type="module" src="${scriptUri}"></script>
  </html>
  `;
};

const createWebViewManager = (
  context: vscode.ExtensionContext,
): WebViewManager => {
  const panel = createPanel();
  panel.onDidDispose(() => {
    state.webViewManager = undefined;
  });
  startListen(context, panel);
  panel.webview.html = createHTML(context, panel);
  return {
    panel,
  };
};

export const getFilerPanel = (
  context: vscode.ExtensionContext,
): vscode.WebviewPanel => {
  if (state.webViewManager !== undefined) {
    state.webViewManager.panel.dispose();
  }
  state.webViewManager = createWebViewManager(context);
  return state.webViewManager.panel;
};
