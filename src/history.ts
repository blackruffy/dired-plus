import { pipe } from 'fp-ts/lib/function';
import * as vscode from 'vscode';
import { scope } from './common/scope';
import { openFile } from './filer/helpers';

const maxHistorySize = 10;

type HistoryState = {
  context?: vscode.ExtensionContext;
  index: number;
  /**
   * one of the history that is currently opened.
   */
  openedPath?: string;
  outputChannel?: vscode.OutputChannel;
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

    setOutputChannel: (outputChannel: vscode.OutputChannel): void => {
      self.update(s => ({ ...s, outputChannel }));
    },

    update: (f: (state: HistoryState) => HistoryState): void => {
      const prev = state;
      state = f(prev);
      if (prev.index !== state.index) {
        getPersistentState().update(getHistoryIndexKey(), state.index);
      }
    },
  } as const;

  return self;
});

export const initializeEditorHistory = async (
  context: vscode.ExtensionContext,
) => {
  historyState.setContext(context);
  historyState.setOutputChannel(
    vscode.window.createOutputChannel('incremental-filer.history'),
  );
  historyState.update(s => ({
    ...s,
    index: getPersistentState().get(getHistoryIndexKey()) ?? 0,
  }));

  const activePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  if (activePath != null) {
    updateHistory(activePath);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(async editor => {
      const fsPath = editor?.document.uri.fsPath;
      if (
        vscode.window.activeTextEditor?.viewColumn != null &&
        editor != null &&
        fsPath != null &&
        !isHistoryOpen(fsPath)
      ) {
        // insert the editor path to the top of the history
        updateHistory(fsPath);
      } else if (isHistoryOpen()) {
        historyState.update(s => ({ ...s, openedPath: undefined }));
      }
    }),
  );
};

/**
 * Get a index that is normalized to the range of the history length.
 */
const normalizeIndex = (index: number, len: number): number => {
  const a = index % len;
  return a < 0 ? len + a : a;
};

/**
 * @param xs current history
 * @param item a item that will be inserted
 * @param index current index
 * @param maxSize max history size
 * @returns a tuple of new history and new index
 */
const insertItem = <A>(
  xs: readonly A[],
  item: A,
  index: number,
  maxSize: number,
): [readonly A[], number] => {
  const len = xs.length;
  // 'diff' is the number of items that should be removed
  // const diff = len + 1 - maxSize;
  const idx = normalizeIndex(index, len);
  if (len === 0) {
    // if the history is empty, just insert the item
    return [[item], 0];
  } else if (item === xs[idx]) {
    // if the item is acitve, do nothing
    return [xs, idx];
  } else if (idx > 0 && item === xs[idx - 1]) {
    return [xs, idx - 1];
  } else {
    return [[item, ...xs.slice(idx, maxSize)], 0];
  }
};

const updateHistory = (path: string): void =>
  pipe({ h: getHistory(), index: historyState.get().index }, ({ h, index }) =>
    pipe(insertItem(h, path, index, maxHistorySize), ([h, idx]) =>
      pipe(
        console.log(`history: index: ${idx}, ${JSON.stringify(h, null, 2)}`),
        () => getPersistentState().update(getHistoryKey(), h),
        () => historyState.update(s => ({ ...s, index: idx })),
      ),
    ),
  );

export const getPersistentState = (): vscode.Memento =>
  historyState.get().context!.workspaceState;

/**
 * @return the key for the history in the persistent state
 */
const getHistoryKey = (): string =>
  `incremental-filer.editorHistory.${vscode.window.activeTextEditor?.viewColumn}`;

/**
 * @return the key for the history index in the persistent state
 */
const getHistoryIndexKey = (): string =>
  `incremental-filer.editorHistoryIndex.${vscode.window.activeTextEditor?.viewColumn}`;

/**
 * @return the history in the persistent state
 */
export const getHistory = (): ReadonlyArray<string> =>
  getPersistentState().get(getHistoryKey()) ?? [];

const isHistoryOpen = (fsPath?: string): boolean =>
  historyState.get().openedPath === fsPath;

export const openHistoryItem = async (diff: number): Promise<void> => {
  const h = getHistory();
  const len = h.length;
  if (len === 0) {
    return;
  } else {
    const i = normalizeIndex(historyState.get().index + diff, len);
    const item = h[i];
    // getHistory().forEach((p, i) => console.log(`  ${i}: ${p}`));
    if (item == null) {
      return openHistoryItem(diff < 0 ? diff - 1 : diff + 1);
    } else {
      historyState.update(s => ({ ...s, index: i, openedPath: item }));
      await openFile(item);
    }
  }
};

export const openCurrentHistoryItem = (): Promise<void> => openHistoryItem(0);

export const openPrevHistoryItem = (): Promise<void> => openHistoryItem(1);

export const openNextHistoryItem = (): Promise<void> => openHistoryItem(-1);

export const resetHistory = async (): Promise<void> => {
  await getPersistentState().update(getHistoryKey(), []);
  historyState.update(s => ({ ...s, index: 0 }));
};

export const debugHistory = (): void => {
  const index = historyState.get().index;
  const h = getHistory();
  console.debug(`[File history] length: ${h.length}, index: ${index}`);
  historyState
    .get()
    .outputChannel?.appendLine(
      `***** [File history] length: ${h.length}, index: ${index} *****`,
    );
  h.forEach((p, i) =>
    historyState
      .get()
      .outputChannel?.appendLine(`  ${i === index ? '*' : ' '} ${i}: ${p}`),
  );
  historyState.get().outputChannel?.show();
};
