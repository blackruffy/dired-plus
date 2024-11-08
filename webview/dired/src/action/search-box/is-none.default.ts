import { DiredItemList as ItemList } from '@common/dired-item';
import {
  keyCtrlBackspace,
  keyEnter,
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
import { Action, SelectedView, statusState } from '@dired/store';

export const searchBoxIsNoneDefault = ({
  path,
  itemList,
  selectedView,
  separator,
  setItemList,
  setSearchWord,
  setSelectedView,
}: Readonly<{
  path: string;
  itemList?: ItemList;
  selectedView: SelectedView;
  separator: string;
  setItemList: (itemList: ItemList) => void;
  setSearchWord: (searchWord: string) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): Action => ({
  id: 'search-box-is-none-default',
  keys: [
    keyEnter({
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
          setSelectedView,
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
        setSelectedView,
      }),
    ),

    keyTab(
      completion({
        path,
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
