import * as vscode from 'vscode';

export type State = Readonly<{
  context: vscode.ExtensionContext;
  outputChannel: vscode.OutputChannel;
  storage: Storage;
}>;

export type Storage = Readonly<{
  getHistoryKey: () => string;
  getIndexKey: () => string;
  getIndex: () => number;
  setIndex: (index: number) => Promise<void>;
  getHistory: () => ReadonlyArray<string>;
  setHistory: (history: ReadonlyArray<string>) => Promise<void>;
}>;

export const newStorage = (context: vscode.ExtensionContext): Storage => {
  const persist = context.workspaceState;

  const self: Storage = {
    getHistoryKey: () =>
      `dired-plus.shortHistory.${vscode.window.activeTextEditor?.viewColumn}`,

    getIndexKey: () =>
      `dired-plus.shortHistoryIndex.${vscode.window.activeTextEditor?.viewColumn}`,

    getIndex: () => persist.get(self.getIndexKey()) ?? 0,
    setIndex: async (index: number) =>
      persist.update(self.getIndexKey(), index),
    getHistory: () => persist.get(self.getHistoryKey()) ?? [],
    setHistory: async (history: ReadonlyArray<string>) =>
      persist.update(self.getHistoryKey(), history),
  };
  return self;
};

export const newState = (
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
): State => ({
  context,
  outputChannel,
  storage: newStorage(context),
});
