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
  keyCtrlC,
  keyCtrlD,
  keyCtrlG,
  keyCtrlI,
  keyCtrlP,
  keyCtrlR,
  keyCtrlSpace,
  keyEnter,
} from '@src/action/keys';
import { getParentDirectory } from '@src/events/native';
import { messageId } from '@src/i18n/ja';
import { Action, Mode, SelectedView } from '@src/store';

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
  keys: [
    keyEnter({
      desc: { id: messageId.open },
      run: openItem(
        item,
        separator,
        setSearchWord,
        setItemList,
        setSelectedView,
      ),
    }),

    keyCtrlSpace({
      desc: { id: messageId.select },
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
        return {};
      },
    }),

    keyCtrlP(
      goToParentDirectory({
        path: scope(async () => {
          return itemList?.parent.path ?? (await getParentDirectory(item.path));
        }),
        separator,
        setSearchWord,
        setItemList,
      }),
    ),

    keyCtrlI(goToSearchBox({ setSelectedView })),

    keyCtrlG({
      desc: { id: messageId.reload },
      run: async () => {
        await updateItemList({
          path: itemList?.parent.path,
          setSearchWord,
          setItemList,
        });
        return {};
      },
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
        setSearchWord,
        setItemList,
      }),
    ),
  ],
});
