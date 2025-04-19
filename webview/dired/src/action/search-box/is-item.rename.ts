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
  renameOverwrite,
} from '@dired/action/helpers';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SearchBox } from '@dired/store';
import { pipe } from 'fp-ts/lib/function';

/**
 * @deprecated
 */
export const _searchBoxIsItemRename = ({
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
  id: 'search-box-is-item-rename',
  keys: [
    keyEnter({
      desc: { id: messageId.rename },
      run: pipe(
        renameOverwrite(
          source,
          item,
          separator,
          setSearchWord,
          setItemList,
          setSelectedItemIndex,
        ),
      ),
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
