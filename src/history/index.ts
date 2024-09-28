import * as vscode from 'vscode';
import {
  debugHistory,
  openNextHistoryItem,
  openPrevHistoryItem,
  resetHistory,
  updateHistory,
} from './helpers';
import { newState } from './state';

export const initializeEditorHistory = async (
  context: vscode.ExtensionContext,
) => {
  const state = newState(
    context,
    vscode.window.createOutputChannel('dired-plus.history'),
  );

  const activePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  if (activePath != null) {
    updateHistory(state.storage, activePath);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(async editor => {
      const fsPath = editor?.document.uri.fsPath;
      if (
        vscode.window.activeTextEditor?.viewColumn != null &&
        editor != null &&
        fsPath != null
      ) {
        // insert the editor path to the top of the history
        updateHistory(state.storage, fsPath);
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:prev', () => {
      openPrevHistoryItem(state.storage);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:next', () => {
      openNextHistoryItem(state.storage);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:reset', () => {
      resetHistory(state.storage);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:debug', () => {
      debugHistory(state.storage, state.outputChannel);
    }),
  );
};
