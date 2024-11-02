import { readonlyArray } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import * as vscode from 'vscode';

export type State = Readonly<{
  context: vscode.ExtensionContext;
  outputChannel: vscode.OutputChannel;
  shortStorage: ShortStorage;
  longStorage: LongStorage;
}>;

export type ShortStorage = Readonly<{
  getHistoryKey: () => string;
  getIndexKey: () => string;
  getIndex: () => number;
  setIndex: (index: number) => Promise<void>;
  getHistory: () => ReadonlyArray<string>;
  setHistory: (history: ReadonlyArray<string>) => Promise<void>;
}>;

export type LongStorage = Readonly<{
  getHistoryKey: () => string;
  getHistory: () => ReadonlyArray<string>;
  setHistory: (history: ReadonlyArray<string>) => Promise<void>;
}>;

export const newShortStorage = (
  context: vscode.ExtensionContext,
): ShortStorage => {
  const persist = context.workspaceState;

  const self: ShortStorage = {
    getHistoryKey: () =>
      `dired-plus.shortHistory.${vscode.window.activeTextEditor?.viewColumn}`,

    getIndexKey: () =>
      `dired-plus.shortHistoryIndex.${vscode.window.activeTextEditor?.viewColumn}`,

    getIndex: () => persist.get(self.getIndexKey()) ?? 0,
    setIndex: async (index: number) =>
      persist.update(self.getIndexKey(), index),
    getHistory: () =>
      pipe(
        (persist.get(self.getHistoryKey()) ?? []) as ReadonlyArray<string>,
        readonlyArray.filter(x => x != null && x !== '' && x !== 'null'),
      ),
    setHistory: async (history: ReadonlyArray<string>) =>
      pipe(
        history,
        readonlyArray.filter(x => x != null && x !== '' && x !== 'null'),
        h => persist.update(self.getHistoryKey(), h),
      ),
  };
  return self;
};

export const newLongStorage = (
  context: vscode.ExtensionContext,
): LongStorage => {
  const persist = context.workspaceState;

  const self: LongStorage = {
    getHistoryKey: () => `dired-plus.longHistory`,
    getHistory: () =>
      pipe(
        (persist.get(self.getHistoryKey()) ?? []) as ReadonlyArray<string>,
        readonlyArray.filter(x => x != null && x !== '' && x !== 'null'),
      ),
    setHistory: async (history: ReadonlyArray<string>) =>
      pipe(
        history,
        readonlyArray.filter(x => x != null && x !== '' && x !== 'null'),
        h => persist.update(self.getHistoryKey(), h),
      ),
  };
  return self;
};

export const newState = (
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
): State => ({
  context,
  outputChannel,
  shortStorage: newShortStorage(context),
  longStorage: newLongStorage(context),
});
