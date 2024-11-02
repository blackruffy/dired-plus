import { scope } from '@src/common/scope';
import * as vscode from 'vscode';
import { helpers } from '../helpers';
import { startListen } from './listener';

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
