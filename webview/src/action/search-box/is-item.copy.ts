import { Item, ItemList } from '@common/item';
import {
  cancel,
  completion,
  copyOverwrite,
  goToParentDirectory,
} from '@src/action/helpers';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyEnter,
  keyEscape,
  keyTab,
} from '@src/action/keys';
import { closePanel } from '@src/events/native';
import { Action, Mode, SelectedView, ok } from '@src/store';
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
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: `Copy`,
      run: pipe(
        copyOverwrite(
          source,
          item,
          separator,
          setMode,
          setSearchWord,
          setItemList,
        ),
      ),
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
