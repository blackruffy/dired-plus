import {
  cancel,
  completion,
  copyOverwrite,
  goToParentDirectory,
} from '@src/action/helpers';
import { keyCtrlBackspace, keyCtrlC, keyEnter, keyTab } from '@src/action/keys';
import { Item, ItemList } from '@src/components/DiredItemList';
import { messageId } from '@src/i18n/ja';
import { Action, Mode, SelectedView } from '@src/store';
import { pipe } from 'fp-ts/lib/function';

export const searchBoxIsItemCopy = ({
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
  id: 'search-box-is-item-copy',
  keys: [
    keyEnter({
      desc: { id: messageId.copy },
      run: pipe(
        copyOverwrite(
          source,
          item,
          separator,
          setSearchWord,
          setItemList,
          setSelectedView,
        ),
      ),
    }),

    keyCtrlBackspace(
      goToParentDirectory({
        path: Promise.resolve(item.path),
        separator,
        setItemList,
        setSearchWord,
        setSelectedView,
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
        setSelectedView,
      }),
    ),
  ],
});
