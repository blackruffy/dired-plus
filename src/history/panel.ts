import { scope } from '@src/common/scope';
import { State } from '@src/state';
import * as vscode from 'vscode';
import { helpers } from '../helpers';
import { startListen } from './listener';

export const getPanel = scope(() => {
  let webViewManager: helpers.webview.WebViewManager | null = null;
  return (state: State): vscode.WebviewPanel =>
    (webViewManager == null
      ? (webViewManager = helpers.webview.createWebViewManager({
          id: 'dired-plus-history',
          title: 'History',
          context: state.context,
          scriptPath: ['dist', 'webview', 'history', 'index.js'],
          startListen: ({ context, panel }) =>
            startListen(context, panel, state.longStorage),
        }))
      : webViewManager
    ).getPanel();
});
