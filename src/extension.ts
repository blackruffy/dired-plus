import { commands } from '@src/commands';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  commands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
