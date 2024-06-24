import { filer } from '@src/filer';
import {
  debugHistory,
  openNextHistoryItem,
  openPrevHistoryItem,
  resetHistory,
} from '@src/history';
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

  context.subscriptions.push(
    vscode.commands.registerCommand('incremental-filer.history:reset', () => {
      resetHistory();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('incremental-filer.history:debug', () => {
      debugHistory();
    }),
  );
};
