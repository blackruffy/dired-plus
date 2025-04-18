import { State, newState } from '@src/state';
import * as vscode from 'vscode';
import { updateLongHistory, updateShortHistory } from './helpers';

export const initializeEditorHistory = (
  context: vscode.ExtensionContext,
): State => {
  const state = newState(
    context,
    vscode.window.createOutputChannel('dired-plus.history'),
  );

  const activePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  state.setLastActivePath(activePath);
  if (activePath != null) {
    updateShortHistory(state.shortStorage, activePath);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(async editor => {
      const fsPath = editor?.document.uri.fsPath;
      if (
        vscode.window.activeTextEditor?.viewColumn != null &&
        editor != null &&
        fsPath != null
      ) {
        state.setLastActivePath(fsPath);
        // insert the editor path to the top of the history
        updateShortHistory(state.shortStorage, fsPath);
        updateLongHistory(state.longStorage, fsPath);
      }
    }),
  );

  return state;
};
