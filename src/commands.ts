import { filer } from '@src/filer';
import { history } from '@src/history';
import {
  debugHistory,
  openNextHistoryItem,
  openPrevHistoryItem,
  resetHistory,
} from '@src/history/helpers';
import * as vscode from 'vscode';
import { State } from './state';

export const commands = (state: State) => {
  state.context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.open', () =>
      filer.getPanel(state).reveal(),
    ),
  );

  state.context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.history:open', () =>
      history.getPanel(state).reveal(),
    ),
  );

  state.context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.editor:prev', () => {
      openPrevHistoryItem(state.shortStorage);
    }),
  );

  state.context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.editor:next', () => {
      openNextHistoryItem(state.shortStorage);
    }),
  );

  state.context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.editor:reset-history', () => {
      resetHistory(state.shortStorage);
    }),
  );

  state.context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.editor:debug-history', () => {
      debugHistory(state.shortStorage, state.outputChannel);
    }),
  );
};
