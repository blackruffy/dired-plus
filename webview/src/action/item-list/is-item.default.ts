import { Item, ItemList } from '@common/item';
import { scope } from '@common/scope';
import {
  deleteItems,
  goToParentDirectory,
  goToSearchBox,
  openItem,
  setCopyMode,
  setRenameMode,
  updateItemList,
} from '@src/action/helpers';
import {
  keyC,
  keyD,
  keyEnter,
  keyEscape,
  keyG,
  keyI,
  keyP,
  keyQ,
  keyR,
  keySpace,
} from '@src/action/keys';
import { closePanel, getParentDirectory } from '@src/events/native';
import { Action, Mode, SelectedView, ok } from '@src/store';

export const itemListIsItemDefault = ({
  index,
  item,
  itemList,
  separator,
  setMode,
  setSearchWord,
  setItemList,
  checked,
  setChecked,
  setSelectedView,
}: Readonly<{
  index: number;
  item: Item;
  itemList?: ItemList;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  checked: Readonly<{ [key: number]: boolean }>;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): Action => ({
  id: 'item-list-is-item-default',
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

    keySpace({
      desc: 'Select',
      run: async () => {
        const isDot = item.name === '.' || item.name === '..';
        setChecked({
          ...checked,
          [index]: isDot
            ? false
            : checked[index] === undefined
              ? true
              : !checked[index],
        });
        return ok();
      },
    }),

    keyP(
      goToParentDirectory({
        path: scope(async () => {
          return itemList?.parent.path ?? (await getParentDirectory(item.path));
        }),
        separator,
        setSearchWord,
        setItemList,
      }),
    ),

    keyI(goToSearchBox({ setSelectedView })),

    keyG({
      desc: 'Reload',
      run: async () => {
        await updateItemList({
          path: itemList?.parent.path,
          setSearchWord,
          setItemList,
        });
        return ok();
      },
    }),

    keyQ({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),

    keyEscape({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),

    keyC(
      setCopyMode({
        item,
        itemList,
        checked,
        setMode,
        setChecked,
        setSelectedView,
      }),
    ),

    keyR(
      setRenameMode({
        item,
        itemList,
        checked,
        setMode,
        setChecked,
        setSelectedView,
      }),
    ),

    keyD(
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
  ],
});
