import { ItemList } from '@common/item';
import {
  completion,
  goToParentDirectory,
  updateItemList,
} from '@src/action/helpers';
import {
  keyCtrlBackspace,
  keyEnter,
  keyEscape,
  keyShiftEnter,
  keyTab,
} from '@src/action/keys';
import { closePanel, createDirectory, createFile } from '@src/events/native';
import { Action, SelectedView, ok } from '@src/store';

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
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: 'Create a new file',
      run: async () => {
        await createFile(path);
        return ok(`Created a new file at ${path}`);
      },
    }),

    keyShiftEnter({
      desc: 'Create a new directory',
      run: async () => {
        await createDirectory(path);
        await updateItemList({
          path,
          setItemList,
          setSearchWord,
        });
        return ok(`Created a new directory at ${path}`);
      },
    }),

    keyCtrlBackspace(
      goToParentDirectory({
        path: Promise.resolve(path),
        separator,
        setItemList,
        setSearchWord,
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

    keyEscape({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),
  ],
});
