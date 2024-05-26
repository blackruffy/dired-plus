import { pipe } from 'fp-ts/lib/function';
import * as vscode from 'vscode';
import { scope } from './common/scope';
import { openFile } from './filer/helpers';

const historyKey = 'incremental-filer.editorHistory';
const maxHistorySize = 100;

type HistoryState = {
  context?: vscode.ExtensionContext;
  index: number;
  openedPath?: string;
};

export const historyState = scope(() => {
  let state: HistoryState = {
    index: 0,
  };

  const self = {
    get: (): HistoryState => state,

    setContext: (context: vscode.ExtensionContext): void => {
      self.update(s => ({ ...s, context }));
    },

    update: (f: (state: HistoryState) => HistoryState): void => {
      state = f(state);
    },
  } as const;

  return self;
});

export const initializeEditorHistory = async (
  context: vscode.ExtensionContext,
) => {
  historyState.setContext(context);
  const history = getHistory();
  const activePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  await getPersistentState().update(
    historyKey,
    activePath == null ? [activePath, ...history] : history,
  );
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(async editor => {
      const fsPath = editor?.document.uri.fsPath;
      if (editor && !isHistoryOpen(fsPath)) {
        await pipe(
          getHistory(),
          h =>
            h.length >= maxHistorySize
              ? h.slice(historyState.get().index, -1)
              : h.slice(historyState.get().index),
          h => (fsPath == null || fsPath === h[0] ? h : [fsPath, ...h]),
          h => getPersistentState().update(historyKey, h),
        );
      } else if (isHistoryOpen()) {
        historyState.update(s => ({ ...s, openedPath: undefined }));
      }
    }),
  );
};

export const getPersistentState = (): vscode.Memento =>
  historyState.get().context!.workspaceState;

export const getHistory = (): ReadonlyArray<string> =>
  getPersistentState().get(historyKey) ?? [];

export const getHistoryItem = (index: number): string | undefined =>
  getHistory()[index];

const isHistoryOpen = (fsPath?: string): boolean =>
  historyState.get().openedPath === fsPath;

export const openHistoryItem = async (index: number): Promise<void> => {
  const item = getHistoryItem(index);
  if (item !== undefined) {
    historyState.update(s => ({ ...s, index, openedPath: item }));
    await openFile(item);
  }
};

export const openCurrentHistoryItem = (): Promise<void> =>
  openHistoryItem(historyState.get().index);

export const openPrevHistoryItem = (): Promise<void> =>
  openHistoryItem(historyState.get().index + 1);

export const openNextHistoryItem = (): Promise<void> =>
  openHistoryItem(historyState.get().index - 1);

export const resetHistory = async (): Promise<void> => {
  await getPersistentState().update(historyKey, []);
  historyState.update(s => ({ ...s, index: 0 }));
};
