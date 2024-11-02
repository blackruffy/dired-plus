import { scope } from '@src/common/scope';
import * as vscode from 'vscode';
import { helpers } from '../helpers';
import { startListen } from './listener';

// type State = {
//   webViewManager?: WebViewManager;
// };

// type WebViewManager = Readonly<{
//   panel: vscode.WebviewPanel;
// }>;

// const state: State = {};

// const createPanel = () =>
//   vscode.window.createWebviewPanel(
//     'dired-plus', // Identifies the type of the webview. Used internally
//     'Dired+', // Title of the panel displayed to the user
//     // Editor column to show the new webview panel in.
//     vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One,
//     {
//       enableScripts: true,
//       // localResourceRoots: [
//       //   vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview'),
//       // ],
//     }, // Webview options. More on these later.
//   );

// const createHTML = (
//   context: vscode.ExtensionContext,
//   panel: vscode.WebviewPanel,
// ): string =>
//   helpers.webview.createHTML({
//     context,
//     webViewPanel: panel,
//     scriptPath: ['dist', 'webview', 'dired', 'index.js'],
//     title: 'Dired+',
//   });

// const createWebViewManager = (
//   context: vscode.ExtensionContext,
//   appType: AppType,
// ): WebViewManager => {
//   const panel = createPanel();
//   panel.onDidDispose(() => {
//     state.webViewManager = undefined;
//   });
//   startListen(context, appType, panel);
//   panel.webview.html = createHTML(context, panel);
//   return {
//     panel,
//   };
// };

// export const getFilerPanel = (
//   context: vscode.ExtensionContext,
//   appType: AppType,
// ): vscode.WebviewPanel => {
//   if (state.webViewManager !== undefined) {
//     state.webViewManager.panel.dispose();
//   }
//   state.webViewManager = createWebViewManager(context, appType);
//   initializeTheme(state.webViewManager.panel);
//   return state.webViewManager.panel;
// };

export const getPanel = scope(() => {
  let webViewManager: helpers.webview.WebViewManager | null = null;
  return (context: vscode.ExtensionContext): vscode.WebviewPanel =>
    (webViewManager == null
      ? (webViewManager = helpers.webview.createWebViewManager({
          id: 'dired-plus-filer',
          title: 'Dired+',
          context,
          scriptPath: ['dist', 'webview', 'dired', 'index.js'],
          startListen,
        }))
      : webViewManager
    ).getPanel();
});
