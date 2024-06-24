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
  deleteDirectory,
  deleteFile,
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
    pipe(setSearchWord(a.parent.path), () => setItemList(a)),
  );

export const goToParentDirectory = ({
  path,
  separator,
  setSearchWord,
  setItemList,
}: Readonly<{
  path: Promise<string>;
  separator: string;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>): KeyParams => ({
  desc: 'Go to the parent directory',
  run: async () => {
    await updateItemList({
      path: `${await getParentDirectory(await path)}${separator}`,
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
  separator: string,
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
              path: `${item.path}${separator}`,
              setSearchWord,
              setItemList,
            }),
          ),
          task.flatMap(() =>
            task.fromPromise(() => goToSearchBox({ setSelectedView }).run()),
          ),
        )
      : task.error<Ok>(Error(`Cannot open a item`));

const afterRun = (
  destination: Item,
  separator: string,
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
            ? `${destination.path}${separator}`
            : `${await getParentDirectory(destination.path)}${separator}`,
          setSearchWord,
          setItemList,
        }),
    ),
  );

const confirmRenameBeforeRun = (
  source: ReadonlyArray<Item>,
  destination: Item,
  separator: string,
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
        afterRun(destination, separator, setMode, setSearchWord, setItemList),
      ),
      task.map(() =>
        ok(`Renamed ${joinItemPath(', ')(source)} to ${destination.path}`),
      ),
    ),
  );

export const renameOverwrite = (
  source: ReadonlyArray<Item>,
  destination: Item,
  separator: string,
  setMode: (mode?: Mode) => void,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
): Task<Ok> => {
  const confirm = (run: () => Promise<void>): Task<Ok> =>
    confirmRenameBeforeRun(
      source,
      destination,
      separator,
      setMode,
      setSearchWord,
      setItemList,
      run,
    );

  const exec = (run: () => Promise<void>): Task<Ok> =>
    pipe(
      task.fromPromise(run),
      task.flatMap(() =>
        afterRun(destination, separator, setMode, setSearchWord, setItemList),
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
  separator: string,
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
        afterRun(destination, separator, setMode, setSearchWord, setItemList),
      ),
      task.map(() =>
        ok(`Copied ${joinItemPath(', ')(source)} to ${destination.path}`),
      ),
    ),
  );

export const copyOverwrite = (
  source: ReadonlyArray<Item>,
  destination: Item,
  separator: string,
  setMode: (mode?: Mode) => void,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
): Task<Ok> => {
  const confirm = (run: () => Promise<void>): Task<Ok> =>
    confirmCopyBeforeRun(
      source,
      destination,
      separator,
      setMode,
      setSearchWord,
      setItemList,
      run,
    );

  const exec = (run: () => Promise<void>): Task<Ok> =>
    pipe(
      task.fromPromise(run),
      task.flatMap(() =>
        afterRun(destination, separator, setMode, setSearchWord, setItemList),
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

export const setCopyMode = ({
  item,
  itemList,
  checked,
  setMode,
  setChecked,
  setSelectedView,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  checked: Readonly<{ [key: number]: boolean }>;
  setMode: (mode?: Mode) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): KeyParams => ({
  desc: 'Copy',
  run: async () =>
    pipe(
      setMode({
        type: 'copy',
        source: getCheckedItemsOr({ checked, itemList, default: item }),
      }),
      () => setChecked({}),
      async () => await goToSearchBox({ setSelectedView }).run(),
      () => ok(),
    ),
});

export const setRenameMode = ({
  item,
  itemList,
  checked,
  setMode,
  setChecked,
  setSelectedView,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  checked: Readonly<{ [key: number]: boolean }>;
  setMode: (mode?: Mode) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): KeyParams => ({
  desc: 'Rename',
  run: async () =>
    pipe(
      setMode({
        type: 'rename',
        source: getCheckedItemsOr({ checked, itemList, default: item }),
      }),
      () => setChecked({}),
      async () => await goToSearchBox({ setSelectedView }).run(),
      () => ok(),
    ),
});

export const deleteItems = ({
  item,
  itemList,
  checked,
  separator,
  setMode,
  setSearchWord,
  setItemList,
  setChecked,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  checked: Readonly<{ [key: number]: boolean }>;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
}>): KeyParams => ({
  desc: 'Delete',
  run: async () =>
    pipe(
      setMode({
        type: 'confirm',
        action: {
          id: 'confirm-delete',
          title: 'Are you sure you want to delete the file?',
          keys: [
            keyY({
              desc: 'Delete the file',
              run: async () =>
                pipe(
                  await sequenceItems({
                    items: getCheckedItemsOr({
                      checked,
                      itemList,
                      default: item,
                    }),
                    onItem: async item =>
                      item.itemType === 'file'
                        ? await deleteFile(item.path)
                        : item.itemType === 'directory'
                          ? await deleteDirectory(item.path)
                          : null,
                  }),
                  async a =>
                    a !== null
                      ? await updateItemList({
                          path: `${a.parent.path}${separator}`,
                          setSearchWord,
                          setItemList,
                        })
                      : //pipe(setSearchWord(a.path), () => setItemList(a))
                        void 0,
                  () => setChecked({}),
                  () => setMode(),
                  () => ok(`Deleted ${item.path}`),
                ),
            }),
            keyN({
              desc: 'Cancel',
              run: async () => pipe(setMode(), () => ok()),
            }),
          ],
        },
      }),
      () => ok(),
    ),
});

export const cancel = ({
  source,
  separator,
  setMode,
  setSearchWord,
  setItemList,
}: Readonly<{
  source: Item;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>): KeyParams => ({
  desc: 'Cancel',
  run: async () => {
    setMode(undefined);
    await updateItemList({
      path: `${await getParentDirectory(source.path)}${separator}`,
      setSearchWord,
      setItemList,
    });
    return ok();
  },
});

const getCommonPrefix = (items: ReadonlyArray<Item>, i: number): string => {
  const [item, ...rest] = items;
  const a = item.name[i];
  if (rest.every(item => item.name[i] === a)) {
    return a + getCommonPrefix(items, i + 1);
  } else {
    return '';
  }
};

export const completion = ({
  path,
  itemList,
  selectedView,
  separator,
  setItemList,
  setSearchWord,
  setSelectedView,
}: Readonly<{
  path: string;
  itemList?: ItemList;
  selectedView: SelectedView;
  separator: string;
  setItemList: (itemList: ItemList) => void;
  setSearchWord: (searchWord: string) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): KeyParams => ({
  desc: 'Completion',
  run: async () => {
    const matched =
      itemList?.items.filter(item => {
        return item.path.startsWith(path);
      }) ?? [];

    if (matched.length === 0) {
      return ok();
    } else if (matched.length === 1) {
      const newPath = matched[0].path;
      if (selectedView.name === 'search-box') {
        setSelectedView({
          ...selectedView,
          selectionStart: newPath.length,
          selectionEnd: newPath.length,
        });
      }
      await updateItemList({
        path: newPath,
        setSearchWord,
        setItemList,
      });
      return ok();
    } else {
      const prefix = getCommonPrefix(matched, 0);
      const newPath =
        itemList?.parent.path.endsWith(separator) === true
          ? `${itemList?.parent.path}${prefix}`
          : `${await getParentDirectory(path)}${separator}${prefix}`;
      if (selectedView.name === 'search-box') {
        setSelectedView({
          ...selectedView,
          selectionStart: newPath.length,
          selectionEnd: newPath.length,
        });
      }
      await updateItemList({
        path: newPath,
        setSearchWord,
        setItemList,
      });
      return ok();
    }
  },
});
