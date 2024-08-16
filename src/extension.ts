import { commands } from '@src/commands';
import { initializeEditorHistory } from '@src/history';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  initializeEditorHistory(context).then(err => {
    console.error(err);
  });
  commands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
