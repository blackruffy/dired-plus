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
  keyEnter,
  keyTab,
} from '@core/keyboard/keys';
import {
  completion,
  deleteItems,
  goToParentDirectory,
  openItem,
  setCopyMode,
  setRenameMode,
} from '@dired/action/helpers';
import { showFolder } from '@dired/events/native';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SelectedView } from '@dired/store';

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

    keyCtrlC(
      setCopyMode({
        item,
        itemList,
        checked,
        setMode,
        setChecked,
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

    keyCtrlR(
      setRenameMode({
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
  ],
});
