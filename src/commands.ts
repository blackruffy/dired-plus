import { filer } from '@src/filer';
import * as vscode from 'vscode';

export const commands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.open', () =>
      filer.getFilerPanel(context).reveal(),
    ),
  );
};
