import { openFile } from '@src/filer/helpers';
import { LongStorage, ShortStorage } from '@src/state';
import * as vscode from 'vscode';

const maxShortHistorySize = 50;
const maxLongHistorySize = 1000;

/**
 * Get a index that is normalized to the range of the history length.
 */
export const normalizeIndex = (index: number, len: number): number => {
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
export const insertItem = <A>(
  xs: readonly A[],
  item: A,
  index: number,
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
    return [[item, ...xs.slice(idx, maxShortHistorySize)], 0];
  }
};

export const updateShortHistory = (
  storage: ShortStorage,
  path: string,
): void => {
  const h = storage.getHistory();
  const index = storage.getIndex();

  const [newHistory, newIndex] = insertItem(h, path, index);

  storage.setHistory(newHistory);
  storage.setIndex(newIndex);
};

export const updateLongHistory = (storage: LongStorage, path: string): void => {
  const f = (
    path: string,
    h: ReadonlyArray<string>,
    i: number,
    r: Array<string>,
  ): ReadonlyArray<string> => {
    if (i >= h.length || r.length === maxLongHistorySize) {
      return r;
    } else if (h[i] !== path) {
      r.push(h[i]);
      return f(path, h, i + 1, r);
    } else {
      return f(path, h, i + 1, r);
    }
  };

  storage.setHistory(f(path, storage.getHistory(), 0, [path]));
};

export const openHistoryItem = async (
  storage: ShortStorage,
  diff: number,
): Promise<void> => {
  const h = storage.getHistory();
  const len = h.length;
  if (len === 0) {
    return;
  } else {
    const i = normalizeIndex(storage.getIndex() + diff, len);
    const item = h[i];
    if (item == null) {
      return openHistoryItem(storage, diff < 0 ? diff - 1 : diff + 1);
    } else {
      storage.setIndex(i);
      await openFile(item);
    }
  }
};

export const openCurrentHistoryItem = (storage: ShortStorage): Promise<void> =>
  openHistoryItem(storage, 0);

export const openPrevHistoryItem = (storage: ShortStorage): Promise<void> =>
  openHistoryItem(storage, 1);

export const openNextHistoryItem = (storage: ShortStorage): Promise<void> =>
  openHistoryItem(storage, -1);

export const resetHistory = async (storage: ShortStorage): Promise<void> => {
  await storage.setHistory([]);
};

export const debugHistory = (
  storage: ShortStorage,
  outputChannel: vscode.OutputChannel,
): void => {
  const index = storage.getIndex();
  const h = storage.getHistory();
  console.debug(`[File history] length: ${h.length}, index: ${index}`);
  outputChannel.appendLine(
    `***** [File history] key: ${storage.getHistoryKey()}, length: ${h.length}, index: ${index} *****`,
  );
  h.forEach((p, i) =>
    outputChannel.appendLine(`  ${i === index ? '*' : ' '} ${i}: ${p}`),
  );
  outputChannel.show();
};
