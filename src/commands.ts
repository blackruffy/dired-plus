import { filer } from '@src/filer';
import * as vscode from 'vscode';

export const commands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('incremental-filer.helloWorld', () =>
      filer.open(context),
    ),
  );
};
