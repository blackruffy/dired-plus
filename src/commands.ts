import { filer } from '@src/filer';
import { openNextHistoryItem, openPrevHistoryItem } from '@src/history';
import * as vscode from 'vscode';

export const commands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('incremental-filer.open', () =>
      filer.getFilerPanel(context).reveal(),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('incremental-filer.history:prev', () => {
      openPrevHistoryItem();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('incremental-filer.history:next', () => {
      openNextHistoryItem();
    }),
  );
};
