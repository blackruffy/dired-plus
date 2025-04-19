import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyEnter,
  keyTab,
} from '@core/keyboard/keys';
import {
  cancel,
  completion,
  goToParentDirectory,
  updateItemList,
} from '@dired/action/helpers';
import {
  copyDirectory,
  copyFile,
  getParentDirectory,
} from '@dired/events/native';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SearchBox } from '@dired/store';
import { pipe } from 'fp-ts/lib/function';

/**
 * @deprecated
 */
export const _searchBoxIsNoneCopy = ({
  item,
  itemList,
  source,
  selectedItemIndex,
  separator,
  setMode,
  setSearchWord,
  setSearchBox,
  setItemList,
  setSelectedItemIndex,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  source: ReadonlyArray<Item>;
  selectedItemIndex?: number;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setSearchBox: (searchBox: SearchBox) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedItemIndex: (selectedItemIndex?: number) => void;
}>): Action => ({
  id: 'search-box-is-none-copy',
  keys: [
    keyEnter({
      desc: { id: messageId.copy },
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
                    searchWord: `${await getParentDirectory(item.path)}${separator}`,
                    setSearchWord,
                    setItemList,
                    setSelectedItemIndex,
                  }),
                () => ({
                  status: {
                    message: {
                      id: messageId.copied,
                      values: { src: s.path, dst: item.path },
                    },
                    type: 'info',
                  },
                }),
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
        setSelectedItemIndex,
      }),
    ),

    keyTab(
      completion({
        path: item.path,
        itemList,
        selectedItemIndex,
        separator,
        setItemList,
        setSearchWord,
        setSearchBox,
        setSelectedItemIndex,
      }),
    ),

    keyCtrlC(
      cancel({
        source: source[0],
        separator,
        setMode,
        setSearchWord,
        setItemList,
        setSelectedItemIndex,
      }),
    ),
  ],
});
