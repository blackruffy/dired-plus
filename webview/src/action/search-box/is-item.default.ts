import { Item, ItemList } from '@common/item';
import {
  completion,
  deleteItems,
  goToParentDirectory,
  openItem,
  setCopyMode,
  setRenameMode,
} from '@src/action/helpers';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyCtrlD,
  keyCtrlR,
  keyEnter,
  keyEscape,
  keyTab,
} from '@src/action/keys';
import { closePanel } from '@src/events/native';
import { Action, Mode, SelectedView, ok } from '@src/store';

export const searchBoxIsItemDefault = ({
  item,
  itemList,
  selectedView,
  checked,
  separator,
  setMode,
  setItemList,
  setSearchWord,
  setSelectedView,
  setChecked,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  selectedView: SelectedView;
  checked: Readonly<{ [key: number]: boolean }>;
  separator: string;
  setMode: (mode?: Mode) => void;
  setItemList: (itemList: ItemList) => void;
  setSearchWord: (searchWord: string) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
}>): Action => ({
  id: 'search-box-is-item-default',
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: 'Open',
      run: openItem(
        item,
        separator,
        setSearchWord,
        setItemList,
        setSelectedView,
      ),
    }),

    keyCtrlC(
      setCopyMode({
        item,
        itemList,
        checked,
        setMode,
        setChecked,
        setSelectedView,
      }),
    ),

    keyCtrlR(
      setRenameMode({
        item,
        itemList,
        checked,
        setMode,
        setChecked,
        setSelectedView,
      }),
    ),

    keyCtrlD(
      deleteItems({
        item,
        itemList,
        checked,
        separator,
        setMode,
        setSearchWord,
        setItemList,
        setChecked,
      }),
    ),

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

    keyEscape({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),
  ],
});
