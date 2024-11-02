import { commands } from '@src/commands';
import { history } from '@src/history';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  try {
    commands(history.initializeEditorHistory(context));
  } catch (e) {
    console.error(e);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
