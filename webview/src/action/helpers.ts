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
import { IntlMessage } from '@src/i18n';
import { messageId } from '@src/i18n/ja';
import { Mode, SelectedView, State } from '@src/store';
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
  desc: { id: messageId.toParentDir },
  run: async () => {
    await updateItemList({
      path: `${await getParentDirectory(await path)}${separator}`,
      setSearchWord,
      setItemList,
    });
    return {};
  },
});

export const goToSearchBox = ({
  setSelectedView,
}: Readonly<{
  setSelectedView: (selectedView: SelectedView) => void;
}>): KeyParams => ({
  desc: { id: messageId.toSearchBox },
  run: async () => {
    setSelectedView({
      name: 'search-box',
      updatedAt: Date.now(),
    });
    return {};
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
  title: IntlMessage,
  descYes: IntlMessage,
  run: Task<Partial<State>>,
): Task<Partial<State>> =>
  pipe(
    task.Do,
    task.map(() => ({
      dialog: {
        type: 'confirm',
        title,
        keys: [
          keyY({
            desc: descYes,
            run,
          }),
          keyN({
            desc: { id: messageId.cancel },
            run: async () => ({
              mode: undefined,
              dialog: undefined,
              status: {
                type: 'info',
                message: { id: messageId.canceled },
              },
            }),
          }),
        ],
      },
    })),
  );

export const openItem = (
  item: Item,
  separator: string,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
  setSelectedView: (selectedView: SelectedView) => void,
): Task<Partial<State>> =>
  item.itemType === 'file'
    ? pipe(
        task.fromPromise(() => openFile(item.path)),
        task.map(() => ({})),
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
      : task.error<Partial<State>>(Error(`Cannot open a item`));

const afterRun = (
  destination: Item,
  separator: string,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
): Task<Partial<State>> =>
  pipe(
    task.Do,
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
    task.map(() => ({
      mode: undefined,
    })),
  );

const confirmRenameBeforeRun = (
  source: ReadonlyArray<Item>,
  destination: Item,
  separator: string,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
  run: () => Promise<Partial<State>>,
): Task<Partial<State>> =>
  confirmBeforeRun(
    'confirm-rename',
    { id: messageId.confirmOverwrite, values: { dst: destination.itemType } },
    { id: messageId.overwrite },
    pipe(
      task.Do,
      task.bind('s1', () => task.fromPromise(run)),
      task.bind('s2', () =>
        afterRun(destination, separator, setSearchWord, setItemList),
      ),
      task.map(({ s1, s2 }) => ({
        ...s1,
        ...s2,
        status: {
          message: {
            id: messageId.renamed,
            values: {
              src: joinItemPath(', ')(source),
              dst: destination.path,
            },
          },
          type: 'info',
        },
      })),
    ),
  );

export const renameOverwrite = (
  source: ReadonlyArray<Item>,
  destination: Item,
  separator: string,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
): Task<Partial<State>> => {
  const confirm = (run: () => Promise<Partial<State>>): Task<Partial<State>> =>
    confirmRenameBeforeRun(
      source,
      destination,
      separator,
      setSearchWord,
      setItemList,
      run,
    );

  const exec = (run: () => Promise<Partial<State>>): Task<Partial<State>> =>
    pipe(
      task.Do,
      task.bind('s1', () => task.fromPromise(run)),
      task.bind('s2', () =>
        afterRun(destination, separator, setSearchWord, setItemList),
      ),
      task.map(({ s1, s2 }) => ({
        ...s1,
        ...s2,
        status: {
          message: {
            id: messageId.renamed,
            values: {
              src: joinItemPath(', ')(source),
              dst: destination.path,
            },
          },
          type: 'info',
        },
      })),
    );

  if (isSingleFile(source) && isFile(destination)) {
    return confirm(() =>
      renameFile(source[0].path, destination.path).then(() => ({})),
    );
  } else if (isSingleFile(source) && isDot(destination)) {
    return exec(() =>
      renameFile(source[0].path, destination.path, {
        intoDirectory: true,
      }).then(() => ({})),
    );
  } else if (isSingleFile(source) && isDirectory(destination)) {
    return task.error<Partial<State>>(
      Error(`Cannot rename a file to a directory`),
    );
  } else if (isSingleDirectory(source) && isFile(destination)) {
    return task.error<Partial<State>>(
      Error(`Cannot rename a directory to a file`),
    );
  } else if (isSingleDirectory(source) && isDot(destination)) {
    return exec(() =>
      renameDirectory(source[0].path, destination.path, {
        intoDirectory: true,
      }).then(() => ({})),
    );
  } else if (isSingleDirectory(source) && isDirectory(destination)) {
    return task.error<Partial<State>>(
      Error(`Cannot rename a directory to a directory`),
    );
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
        task.map(() => ({})),
      ),
    );
  } else if (
    isMultipleItems(source) &&
    (isFile(destination) || isDirectory(destination))
  ) {
    return task.error<Partial<State>>(
      Error(`Cannot rename multiple items to a file`),
    );
  } else {
    return task.error<Partial<State>>(
      Error(`Cannot copy a directory to a file`),
    );
  }
};

const confirmCopyBeforeRun = (
  source: ReadonlyArray<Item>,
  destination: Item,
  separator: string,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
  run: () => Promise<Partial<State>>,
): Task<Partial<State>> =>
  confirmBeforeRun(
    'confirm-copy',
    { id: messageId.confirmOverwrite, values: { dst: destination.itemType } },
    { id: messageId.overwrite },
    pipe(
      task.Do,
      task.bind('s1', () => task.fromPromise(run)),
      task.bind('s2', () =>
        afterRun(destination, separator, setSearchWord, setItemList),
      ),
      task.map(({ s1, s2 }) => ({
        ...s1,
        ...s2,
        status: {
          message: {
            id: messageId.copied,
            values: { src: joinItemPath(', ')(source), dst: destination.path },
          },
          type: 'info',
        },
      })),
    ),
  );

export const copyOverwrite = (
  source: ReadonlyArray<Item>,
  destination: Item,
  separator: string,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
): Task<Partial<State>> => {
  const confirm = (run: () => Promise<Partial<State>>): Task<Partial<State>> =>
    confirmCopyBeforeRun(
      source,
      destination,
      separator,
      setSearchWord,
      setItemList,
      run,
    );

  const exec = (run: () => Promise<Partial<State>>): Task<Partial<State>> =>
    pipe(
      task.Do,
      task.bind('s1', () => task.fromPromise(run)),
      task.bind('s2', () =>
        afterRun(destination, separator, setSearchWord, setItemList),
      ),
      task.map(({ s1, s2 }) => ({
        ...s1,
        ...s2,
        status: {
          message: {
            id: messageId.copied,
            values: { src: joinItemPath(', ')(source), dst: destination.path },
          },
          type: 'info',
        },
      })),
    );

  if (isSingleFile(source) && isFile(destination)) {
    return confirm(() =>
      copyFile(source[0].path, destination.path).then(() => ({})),
    );
  } else if (isSingleFile(source) && isDot(destination)) {
    return exec(() =>
      copyFile(source[0].path, destination.path, { intoDirectory: true }).then(
        () => ({}),
      ),
    );
  } else if (isSingleFile(source) && isDirectory(destination)) {
    return task.error<Partial<State>>(
      Error(`Cannot copy a file to a directory ${destination.path}`),
    );
  } else if (isSingleDirectory(source) && isFile(destination)) {
    return task.error<Partial<State>>(
      Error(`Cannot copy a directory to a file ${destination.path}`),
    );
  } else if (isSingleDirectory(source) && isDot(destination)) {
    return exec(() =>
      copyDirectory(source[0].path, destination.path, {
        intoDirectory: true,
      }).then(() => ({})),
    );
  } else if (isSingleDirectory(source) && isDirectory(destination)) {
    return task.error<Partial<State>>(
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
        task.map(() => ({})),
      ),
    );
  } else if (
    isMultipleItems(source) &&
    (isFile(destination) || isDirectory(destination))
  ) {
    return task.error<Partial<State>>(
      Error(`Cannot copy multiple items to a file`),
    );
  } else {
    return task.error<Partial<State>>(
      Error(`Cannot copy a directory to a file`),
    );
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
  desc: { id: messageId.copy },
  run: async () =>
    pipe(
      setMode({
        type: 'copy',
        source: getCheckedItemsOr({ checked, itemList, default: item }),
      }),
      () => setChecked({}),
      async () => await goToSearchBox({ setSelectedView }).run(),
      () => ({}),
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
  desc: { id: messageId.rename },
  run: async () =>
    pipe(
      setMode({
        type: 'rename',
        source: getCheckedItemsOr({ checked, itemList, default: item }),
      }),
      () => setChecked({}),
      async () => await goToSearchBox({ setSelectedView }).run(),
      () => ({}),
    ),
});

export const deleteItems = ({
  item,
  itemList,
  checked,
  separator,
  setSearchWord,
  setItemList,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  checked: Readonly<{ [key: number]: boolean }>;
  separator: string;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>): KeyParams => ({
  desc: { id: messageId.delete },
  run: async () => ({
    dialog: {
      type: 'confirm',
      title: { id: messageId.confirmDelete },
      lines: getCheckedItemsOr({
        checked,
        itemList,
        default: item,
      }).map(item => item.path),
      keys: [
        keyY({
          desc: { id: messageId.delete },
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
              () => ({
                checked: {},
                mode: undefined,
                dialog: undefined,
                status: {
                  message: {
                    id: messageId.deleted,
                    values: { src: item.path },
                  },
                  type: 'info',
                },
              }),
            ),
        }),
        keyN({
          desc: { id: messageId.cancel },
          run: async () => ({
            mode: undefined,
            dialog: undefined,
            status: {
              message: { id: messageId.canceled },
              type: `info`,
            },
          }),
        }),
      ],
    },
  }),
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
  desc: { id: messageId.cancel },
  run: async () => {
    setMode(undefined);
    await updateItemList({
      path: `${await getParentDirectory(source.path)}${separator}`,
      setSearchWord,
      setItemList,
    });
    return {};
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
  desc: { id: messageId.completion },
  run: async () => {
    const lpath = path.toLocaleLowerCase();
    const matched =
      itemList?.items.filter(item => {
        return item.path.toLocaleLowerCase().startsWith(lpath);
      }) ?? [];

    if (matched.length === 0) {
      return {};
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
      return {};
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
      return {};
    }
  },
});
