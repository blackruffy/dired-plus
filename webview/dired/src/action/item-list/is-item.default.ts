import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyCtrlD,
  keyCtrlF,
  keyCtrlR,
  keyCtrlSpace,
  keyCtrlU,
  keyEnter,
  keyTab,
} from '@core/keyboard/keys';
import {
  bind,
  completion,
  deleteItems,
  goToParentDirectory,
  goToSearchBox,
  openItem,
  setCopyMode,
  setRenameMode,
  updateItemList,
} from '@dired/action/helpers';
import { showFolder } from '@dired/events/native';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SelectedView } from '@dired/store';

export const itemListIsItemDefault = ({
  index,
  searchWord,
  item,
  itemList,
  selectedView,
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
  selectedView: SelectedView;
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

    keyTab(
      completion({
        path: searchWord,
        itemList,
        selectedView,
        separator,
        setItemList,
        setSearchWord,
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
      }),
    ),

    keyCtrlU({
      desc: { id: messageId.reload },
      run: async () => {
        await updateItemList({
          searchWord: itemList?.parent.path,
          setSearchWord,
          setItemList,
          setSelectedView,
        });
        return {};
      },
    }),
  ],
});
