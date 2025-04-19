import { DiredItemList as ItemList } from '@common/dired-item';
import {
  keyCtrlBackspace,
  keyCtrlEnter,
  keyShiftEnter,
  keyTab,
} from '@core/keyboard/keys';
import {
  completion,
  goToParentDirectory,
  updateItemList,
} from '@dired/action/helpers';
import { createDirectory, createFile } from '@dired/events/native';
import { messageId } from '@dired/i18n/ja';
import { Action, SearchBox, statusState } from '@dired/store';

/**
 * @deprecated
 */
export const _searchBoxIsNoneDefault = ({
  path,
  itemList,
  selectedItemIndex,
  separator,
  setItemList,
  setSearchWord,
  setSearchBox,
  setSelectedItemIndex,
}: Readonly<{
  path: string;
  itemList?: ItemList;
  selectedItemIndex?: number;
  separator: string;
  setItemList: (itemList: ItemList) => void;
  setSearchWord: (searchWord: string) => void;
  setSearchBox: (searchBox: SearchBox) => void;
  setSelectedItemIndex: (selectedItemIndex?: number) => void;
}>): Action => ({
  id: 'search-box-is-none-default',
  keys: [
    keyCtrlEnter({
      desc: { id: messageId.createFile },
      run: async () => {
        await createFile(path);
        return statusState({
          id: messageId.createdFile,
          values: { src: path },
        });
      },
    }),

    keyShiftEnter({
      desc: { id: messageId.createDir },
      run: async () => {
        await createDirectory(path);
        await updateItemList({
          searchWord: path,
          setItemList,
          setSearchWord,
          setSelectedItemIndex,
        });
        return statusState({
          id: messageId.createdDir,
          values: { src: path },
        });
      },
    }),

    keyCtrlBackspace(
      goToParentDirectory({
        path: Promise.resolve(path),
        separator,
        setItemList,
        setSearchWord,
        setSelectedItemIndex,
      }),
    ),

    keyTab(
      completion({
        path,
        itemList,
        selectedItemIndex,
        separator,
        setItemList,
        setSearchWord,
        setSearchBox,
        setSelectedItemIndex,
      }),
    ),
  ],
});
