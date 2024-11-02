import { filer } from '@src/filer';
import { history } from '@src/history';
import * as vscode from 'vscode';
import { State } from './state';

export const commands = (state: State) => {
  state.context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.open', () =>
      filer.getPanel(state.context).reveal(),
    ),
  );

  state.context.subscriptions.push(
    vscode.commands.registerCommand('dired-plus.open-history', () =>
      history.getPanel(state).reveal(),
    ),
  );
};
