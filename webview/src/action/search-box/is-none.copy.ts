import { Item, ItemList } from '@common/item';
import {
  cancel,
  completion,
  goToParentDirectory,
  updateItemList,
} from '@src/action/helpers';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyEnter,
  keyEscape,
  keyTab,
} from '@src/action/keys';
import {
  closePanel,
  copyDirectory,
  copyFile,
  getParentDirectory,
} from '@src/events/native';
import { Action, Mode, SelectedView, ok } from '@src/store';
import { pipe } from 'fp-ts/lib/function';

export const searchBoxIsNoneCopy = ({
  item,
  itemList,
  source,
  selectedView,
  separator,
  setMode,
  setSearchWord,
  setItemList,
  setSelectedView,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  source: ReadonlyArray<Item>;
  selectedView: SelectedView;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): Action => ({
  id: 'search-box-is-none-copy',
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: 'Copy',
      run: async () =>
        source.length === 1
          ? pipe(source[0], async s =>
              pipe(
                s.itemType === 'file'
                  ? await copyFile(s.path, item.path)
                  : s.itemType === 'directory'
                    ? await copyDirectory(s.path, item.path)
                    : await Promise.reject(`Invalid item type: ${s.itemType}`),
                () => setMode(),
                async () =>
                  await updateItemList({
                    path: `${await getParentDirectory(item.path)}${separator}`,
                    setSearchWord,
                    setItemList,
                  }),
                () => ok(`Copied ${s.path} to ${item.path}`),
              ),
            )
          : Promise.reject('Multiple items cannot be copied at once'),
    }),

    keyCtrlBackspace(
      goToParentDirectory({
        path: Promise.resolve(item.path),
        separator,
        setItemList,
        setSearchWord,
      }),
    ),

    keyTab(
      completion({
        path: item.path,
        itemList,
        selectedView,
        separator,
        setItemList,
        setSearchWord,
        setSelectedView,
      }),
    ),

    keyCtrlC(
      cancel({
        source: source[0],
        separator,
        setMode,
        setSearchWord,
        setItemList,
      }),
    ),

    keyEscape({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),
  ],
});
