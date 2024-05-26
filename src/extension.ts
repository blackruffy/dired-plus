import { commands } from '@src/commands';
import * as vscode from 'vscode';
import { initializeEditorHistory } from './history';

export function activate(context: vscode.ExtensionContext) {
  commands(context);
  initializeEditorHistory(context).then(err => {
    console.error(err);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
