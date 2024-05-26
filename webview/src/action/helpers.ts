import { task } from '@common/index';
import {
  Item,
  ItemList,
  isDirectory,
  isDot,
  isFile,
  isMultipleItems,
  isSingleDirectory,
  isSingleFile,
  joinItemPath,
} from '@common/item';
import {
  copyDirectory,
  copyFile,
  getParentDirectory,
  listItems,
  openFile,
  renameDirectory,
  renameFile,
} from '@src/events/native';
import { Mode, Ok, SelectedView, ok } from '@src/store';
import { readonlyArray } from 'fp-ts';
import { Task } from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { KeyParams, keyN, keyY } from './keys';

export const updateItemList = async ({
  path,
  setSearchWord,
  setItemList,
}: Readonly<{
  path?: string;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>): Promise<void> =>
  pipe(await listItems(path), a =>
    pipe(setSearchWord(a.path), () => setItemList(a)),
  );

export const goToParentDirectory = ({
  path,
  setSearchWord,
  setItemList,
}: Readonly<{
  path: Promise<string>;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>): KeyParams => ({
  desc: 'Go to the parent directory',
  run: async () => {
    await updateItemList({
      path: await getParentDirectory(await path),
      setSearchWord,
      setItemList,
    });
    return ok();
  },
});

export const goToSearchBox = ({
  setSelectedView,
}: Readonly<{
  setSelectedView: (selectedView: SelectedView) => void;
}>): KeyParams => ({
  desc: 'Go to the search box',
  run: async () => {
    setSelectedView({
      name: 'search-box',
      updatedAt: Date.now(),
    });
    return ok();
  },
});

export const getCheckedItems = ({
  checked,
  itemList,
}: Readonly<{
  checked: Readonly<{ [key: number]: boolean }>;
  itemList?: ItemList;
}>): ReadonlyArray<Item> =>
  Object.entries(checked).flatMap(([k, v]) => {
    const a = itemList?.items[Number(k)];
    return v === true && a !== null && a !== undefined ? [a] : [];
  });

export const getCheckedItemsOr = ({
  checked,
  itemList,
  default: item,
}: Readonly<{
  checked: Readonly<{ [key: number]: boolean }>;
  itemList?: ItemList;
  default: Item;
}>): ReadonlyArray<Item> =>
  pipe(getCheckedItems({ checked, itemList }), items =>
    items.length === 0 ? [item] : items,
  );

export const sequenceItems = async <A>({
  items,
  onItem,
  index = 0,
}: Readonly<{
  items: ReadonlyArray<Item>;
  onItem: (item: Item) => Promise<A | null>;
  index?: number;
}>): Promise<A | null> =>
  index >= items.length
    ? null
    : pipe(
        [
          await onItem(items[index]),
          await sequenceItems({ items, index: index + 1, onItem }),
        ],
        ([h, t]) => t ?? h,
      );

type Runner<A> = Readonly<{
  run: () => Task<A>;
}>;

const runner = {
  of: <A>(f: () => Task<A>): Runner<A> => ({
    run: f,
  }),
  fromPromise: <A>(f: () => Promise<A>): Runner<A> => ({
    run: () => task.fromPromise(f),
  }),
  error: <A>(e: Error): Runner<A> => runner.of(() => task.error(e)),
} as const;

const confirmBeforeRun = (
  id: string,
  title: string,
  descYes: string,
  setMode: (mode?: Mode) => void,
  run: Task<Ok>,
): Task<Ok> =>
  pipe(
    task.Do,
    task.map(() =>
      setMode({
        type: 'confirm',
        action: {
          id,
          title,
          keys: [
            keyY({
              desc: descYes,
              run,
            }),
            keyN({
              desc: 'Cancel',
              run: async () => {
                setMode();
                return ok();
              },
            }),
          ],
        },
      }),
    ),
    task.map(() => ok()),
  );

export const openItem = (
  item: Item,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
  setSelectedView: (selectedView: SelectedView) => void,
): Task<Ok> =>
  item.itemType === 'file'
    ? pipe(
        task.fromPromise(() => openFile(item.path)),
        task.map(() => ok()),
      )
    : item.itemType === 'directory'
      ? pipe(
          task.fromPromise(() =>
            updateItemList({
              path: item.path,
              setSearchWord,
              setItemList,
            }),
          ),
          task.chain(() =>
            task.fromPromise(() => goToSearchBox({ setSelectedView }).run()),
          ),
        )
      : task.error<Ok>(Error(`Cannot open a item`));

const afterRun = (
  destination: Item,
  setMode: (mode?: Mode) => void,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
): Task<void> =>
  pipe(
    task.Do,
    task.map(() => setMode()),
    task.chain(
      () => async () =>
        updateItemList({
          path: isDot(destination)
            ? destination.path
            : await getParentDirectory(destination.path),
          setSearchWord,
          setItemList,
        }),
    ),
  );

const confirmRenameBeforeRun = (
  source: ReadonlyArray<Item>,
  destination: Item,
  setMode: (mode?: Mode) => void,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
  run: () => Promise<void>,
): Task<Ok> =>
  confirmBeforeRun(
    'confirm-rename',
    `The ${destination.itemType} already exists. Do you want to overwrite it?`,
    `Overwrite the ${destination.itemType}`,
    setMode,
    pipe(
      task.fromPromise(run),
      task.flatMap(() =>
        afterRun(destination, setMode, setSearchWord, setItemList),
      ),
      task.map(() =>
        ok(`Renamed ${joinItemPath(', ')(source)} to ${destination.path}`),
      ),
    ),
  );

export const renameOverwrite = (
  source: ReadonlyArray<Item>,
  destination: Item,
  setMode: (mode?: Mode) => void,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
): Task<Ok> => {
  const confirm = (run: () => Promise<void>): Task<Ok> =>
    confirmRenameBeforeRun(
      source,
      destination,
      setMode,
      setSearchWord,
      setItemList,
      run,
    );

  const exec = (run: () => Promise<void>): Task<Ok> =>
    pipe(
      task.fromPromise(run),
      task.flatMap(() =>
        afterRun(destination, setMode, setSearchWord, setItemList),
      ),
      task.map(() =>
        ok(`Renamed ${joinItemPath(', ')(source)} to ${destination.path}`),
      ),
    );

  if (isSingleFile(source) && isFile(destination)) {
    return confirm(() => renameFile(source[0].path, destination.path));
  } else if (isSingleFile(source) && isDot(destination)) {
    return exec(() =>
      renameFile(source[0].path, destination.path, { intoDirectory: true }),
    );
  } else if (isSingleFile(source) && isDirectory(destination)) {
    return task.error<Ok>(Error(`Cannot rename a file to a directory`));
  } else if (isSingleDirectory(source) && isFile(destination)) {
    return task.error<Ok>(Error(`Cannot rename a directory to a file`));
  } else if (isSingleDirectory(source) && isDot(destination)) {
    return exec(() =>
      renameDirectory(source[0].path, destination.path, {
        intoDirectory: true,
      }),
    );
  } else if (isSingleDirectory(source) && isDirectory(destination)) {
    return task.error<Ok>(Error(`Cannot rename a directory to a directory`));
  } else if (isMultipleItems(source) && isDot(destination)) {
    return exec(
      pipe(
        source,
        readonlyArray.flatMap(s =>
          isFile(s)
            ? [
                task.fromPromise(() =>
                  renameFile(s.path, destination.path, { intoDirectory: true }),
                ),
              ]
            : isDirectory(s)
              ? [
                  task.fromPromise(() =>
                    renameDirectory(s.path, destination.path, {
                      intoDirectory: true,
                    }),
                  ),
                ]
              : [],
        ),
        task.sequenceArray,
        task.map(() => void 0),
      ),
    );
  } else if (
    isMultipleItems(source) &&
    (isFile(destination) || isDirectory(destination))
  ) {
    return task.error<Ok>(Error(`Cannot rename multiple items to a file`));
  } else {
    return task.error<Ok>(Error(`Cannot copy a directory to a file`));
  }
};

const confirmCopyBeforeRun = (
  source: ReadonlyArray<Item>,
  destination: Item,
  setMode: (mode?: Mode) => void,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
  run: () => Promise<void>,
): Task<Ok> =>
  confirmBeforeRun(
    'confirm-copy',
    `The ${destination.itemType} already exists. Do you want to overwrite it?`,
    `Overwrite the ${destination.itemType}`,
    setMode,
    pipe(
      task.fromPromise(run),
      task.flatMap(() =>
        afterRun(destination, setMode, setSearchWord, setItemList),
      ),
      task.map(() =>
        ok(`Copied ${joinItemPath(', ')(source)} to ${destination.path}`),
      ),
    ),
  );

export const copyOverwrite = (
  source: ReadonlyArray<Item>,
  destination: Item,
  setMode: (mode?: Mode) => void,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
): Task<Ok> => {
  const confirm = (run: () => Promise<void>): Task<Ok> =>
    confirmCopyBeforeRun(
      source,
      destination,
      setMode,
      setSearchWord,
      setItemList,
      run,
    );

  const exec = (run: () => Promise<void>): Task<Ok> =>
    pipe(
      task.fromPromise(run),
      task.flatMap(() =>
        afterRun(destination, setMode, setSearchWord, setItemList),
      ),
      task.map(() =>
        ok(`Copied ${joinItemPath(', ')(source)} to ${destination.path}`),
      ),
    );

  if (isSingleFile(source) && isFile(destination)) {
    return confirm(() => copyFile(source[0].path, destination.path));
  } else if (isSingleFile(source) && isDot(destination)) {
    return exec(() =>
      copyFile(source[0].path, destination.path, { intoDirectory: true }),
    );
  } else if (isSingleFile(source) && isDirectory(destination)) {
    return task.error<Ok>(
      Error(`Cannot copy a file to a directory ${destination.path}`),
    );
  } else if (isSingleDirectory(source) && isFile(destination)) {
    return task.error<Ok>(
      Error(`Cannot copy a directory to a file ${destination.path}`),
    );
  } else if (isSingleDirectory(source) && isDot(destination)) {
    return exec(() =>
      copyDirectory(source[0].path, destination.path, { intoDirectory: true }),
    );
  } else if (isSingleDirectory(source) && isDirectory(destination)) {
    return task.error<Ok>(
      Error(`Cannot copy a directory to a directory ${destination.path}`),
    );
  } else if (isMultipleItems(source) && isDot(destination)) {
    return exec(
      pipe(
        source,
        readonlyArray.flatMap(s =>
          isFile(s)
            ? [
                task.fromPromise(() =>
                  copyFile(s.path, destination.path, { intoDirectory: true }),
                ),
              ]
            : isDirectory(s)
              ? [
                  task.fromPromise(() =>
                    copyDirectory(s.path, destination.path, {
                      intoDirectory: true,
                    }),
                  ),
                ]
              : [],
        ),
        task.sequenceArray,
        task.map(() => void 0),
      ),
    );
  } else if (
    isMultipleItems(source) &&
    (isFile(destination) || isDirectory(destination))
  ) {
    return task.error<Ok>(Error(`Cannot copy multiple items to a file`));
  } else {
    return task.error<Ok>(Error(`Cannot copy a directory to a file`));
  }
};
