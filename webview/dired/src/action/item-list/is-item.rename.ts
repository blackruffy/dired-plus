import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyCtrlX,
  keyEnter,
  keyTab,
} from '@core/keyboard/keys';
import {
  bind,
  cancel,
  completion,
  goToParentDirectory,
  openItem,
  renameOverwrite,
} from '@dired/action/helpers';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SearchBox } from '@dired/store';

export const itemListIsItemRename = ({
  searchWord,
  itemList,
  selectedItemIndex,
  destination,
  source,
  separator,
  setMode,
  setSelectedItemIndex,
  setSearchWord,
  setSearchBox,
  setItemList,
}: Readonly<{
  searchWord: string;
  itemList?: ItemList;
  selectedItemIndex?: number;
  destination: Item;
  source: ReadonlyArray<Item>;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSelectedItemIndex: (selectedItemIndex?: number) => void;
  setSearchWord: (searchWord: string) => void;
  setSearchBox: (searchBox: SearchBox) => void;
  setItemList: (itemList: ItemList) => void;
}>): Action => ({
  id: 'item-list-is-item-rename',
  keys: [
    keyEnter({
      desc: { id: messageId.open },
      run: openItem(
        destination,
        separator,
        setSearchWord,
        setItemList,
        setSelectedItemIndex,
      ),
    }),

    keyCtrlBackspace(
      bind(
        { id: messageId.toParentDir },
        goToParentDirectory({
          path: Promise.resolve(searchWord),
          separator,
          setSearchWord,
          setItemList,
          setSelectedItemIndex,
        }),
      ),
    ),

    keyTab(
      completion({
        path: searchWord,
        itemList,
        selectedItemIndex,
        separator,
        setItemList,
        setSearchWord,
        setSearchBox,
        setSelectedItemIndex,
      }),
    ),

    keyCtrlX({
      desc: { id: messageId.rename },
      run: renameOverwrite(
        source,
        destination,
        separator,
        setSearchWord,
        setItemList,
        setSelectedItemIndex,
      ),
    }),

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
