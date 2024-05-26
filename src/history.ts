import { pipe } from 'fp-ts/lib/function';
import * as vscode from 'vscode';
import { scope } from './common/scope';
import { openFile } from './filer/helpers';

const historyKey = 'editorHistory';
const maxHistorySize = 5000;

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
  const activePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  await context.globalState.update(
    historyKey,
    activePath === undefined ? [activePath] : [],
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
          h => [fsPath, ...h],
          h => context.globalState.update(historyKey, h),
        );
      } else if (isHistoryOpen()) {
        historyState.update(s => ({ ...s, openedPath: undefined }));
      }
    }),
  );
};

export const getHistory = (): ReadonlyArray<string> =>
  historyState.get().context!.globalState.get(historyKey) ?? [];

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

export const openPrevHistoryItem = (): Promise<void> =>
  openHistoryItem(historyState.get().index + 1);

export const openNextHistoryItem = (): Promise<void> =>
  openHistoryItem(historyState.get().index - 1);
