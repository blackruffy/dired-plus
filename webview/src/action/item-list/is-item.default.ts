import {
  bind,
  deleteItems,
  goToParentDirectory,
  goToSearchBox,
  openItem,
  setCopyMode,
  setRenameMode,
  updateItemList,
} from '@src/action/helpers';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyCtrlD,
  keyCtrlF,
  keyCtrlI,
  keyCtrlR,
  keyCtrlSpace,
  keyCtrlU,
  keyEnter,
} from '@src/action/keys';
import { Item, ItemList } from '@src/components/DiredItemList';
import { showFolder } from '@src/events/native';
import { messageId } from '@src/i18n/ja';
import { Action, Mode, SelectedView } from '@src/store';

export const itemListIsItemDefault = ({
  index,
  searchWord,
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
  searchWord: string;
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

    keyCtrlD(
      deleteItems({
        item,
        itemList,
        checked,
        separator,
        setSearchWord,
        setItemList,
        setSelectedView,
      }),
    ),

    ...(item.itemType === 'directory'
      ? [
          keyCtrlF({
            desc: { id: messageId.addFolder },
            run: async () => {
              showFolder(item.path);
              return {};
            },
          }),
        ]
      : []),

    keyCtrlI(goToSearchBox({ setSelectedView })),

    keyCtrlBackspace(
      bind(
        { id: messageId.toParentDir },

        goToParentDirectory({
          path: Promise.resolve(searchWord),
          separator,
          setSearchWord,
          setItemList,
          setSelectedView,
        }),
        goToSearchBox({ setSelectedView }),
      ),
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

    keyCtrlU({
      desc: { id: messageId.reload },
      run: async () => {
        await updateItemList({
          path: itemList?.parent.path,
          setSearchWord,
          setItemList,
          setSelectedView,
        });
        return {};
      },
    }),
  ],
});
