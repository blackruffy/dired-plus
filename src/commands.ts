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
    vscode.commands.registerCommand('dired-plus.open', () =>
      filer.getFilerPanel(context).reveal(),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:prev', () => {
      openPrevHistoryItem();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:next', () => {
      openNextHistoryItem();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:reset', () => {
      resetHistory();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:debug', () => {
      debugHistory();
    }),
  );
};
