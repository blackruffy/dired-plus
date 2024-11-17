import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyCtrlD,
  keyCtrlEnter,
  keyCtrlF,
  keyCtrlR,
  keyCtrlSpace,
  keyCtrlU,
  keyEnter,
  keyShiftEnter,
  keyTab,
} from '@core/keyboard/keys';
import {
  bind,
  completion,
  deleteItems,
  goToParentDirectory,
  openItem,
  setCopyMode,
  setRenameMode,
  updateItemList,
} from '@dired/action/helpers';
import { showFolder } from '@dired/events/native';
import { createDirectory, createFile } from '@dired/events/native';
import { messageId } from '@dired/i18n/ja';
import {
  ActionWithNullableKeys,
  Mode,
  SearchBox,
  statusState,
} from '@dired/store';

export const itemListIsItemDefault = ({
  index,
  searchWord,
  item,
  itemList,
  selectedItemIndex,
  separator,
  setMode,
  setSearchWord,
  setSearchBox,
  setItemList,
  checked,
  setChecked,
  setSelectedItemIndex,
}: Readonly<{
  index?: number;
  searchWord: string;
  item?: Item;
  itemList?: ItemList;
  selectedItemIndex?: number;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setSearchBox: (searchBox: SearchBox) => void;
  setItemList: (itemList: ItemList) => void;
  checked: Readonly<{ [key: number]: boolean }>;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  setSelectedItemIndex: (selectedItemIndex?: number) => void;
}>): ActionWithNullableKeys => ({
  id: 'item-list-is-item-default',
  keys: [
    item == null
      ? null
      : keyEnter({
          desc: { id: messageId.open },
          run: openItem(
            item,
            separator,
            setSearchWord,
            setItemList,
            setSelectedItemIndex,
          ),
        }),

    index == null || item == null
      ? null
      : keyCtrlSpace({
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

    item == null
      ? null
      : keyCtrlC(
          setCopyMode({
            item,
            itemList,
            checked,
            setMode,
            setChecked,
          }),
        ),

    item == null
      ? null
      : keyCtrlD(
          deleteItems({
            item,
            itemList,
            checked,
            separator,
            setSearchWord,
            setItemList,
            setSelectedItemIndex,
          }),
        ),

    item?.itemType === 'directory'
      ? keyCtrlF({
          desc: { id: messageId.addFolder },
          run: async () => {
            showFolder(item.path);
            return {};
          },
        })
      : null,

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

    item == null
      ? null
      : keyCtrlR(
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
          setSelectedItemIndex,
        });
        return {};
      },
    }),

    keyCtrlEnter({
      desc: { id: messageId.createFile },
      run: async () => {
        await createFile(searchWord);
        return statusState({
          id: messageId.createdFile,
          values: { src: searchWord },
        });
      },
    }),

    keyCtrlEnter({
      desc: { id: messageId.createFile },
      run: async () => {
        await createFile(searchWord);
        return statusState({
          id: messageId.createdFile,
          values: { src: searchWord },
        });
      },
    }),

    keyShiftEnter({
      desc: { id: messageId.createDir },
      run: async () => {
        await createDirectory(searchWord);
        await updateItemList({
          searchWord,
          setItemList,
          setSearchWord,
          setSelectedItemIndex,
        });
        return statusState({
          id: messageId.createdDir,
          values: { src: searchWord },
        });
      },
    }),
  ],
});
