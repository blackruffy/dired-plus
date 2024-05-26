import { ItemList } from '@common/item';
import { goToParentDirectory } from '@src/action/helpers';
import { keyCtrlBackspace, keyEscape } from '@src/action/keys';
import { Action, SelectedView, ok } from '@src/store';

export const searchBoxIsItemDefault = ({
  path,
  setItemList,
  setSearchWord,
  setSelectedView,
}: Readonly<{
  path: string;
  setItemList: (itemList: ItemList) => void;
  setSearchWord: (searchWord: string) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): Action => ({
  id: 'search-box-is-item-default',
  title: 'Available actions',
  keys: [
    keyCtrlBackspace(
      goToParentDirectory({
        path: Promise.resolve(path),
        setItemList,
        setSearchWord,
      }),
    ),

    keyEscape({
      desc: 'Command mode',
      run: async () => {
        setSelectedView({
          name: 'list-item',
          index: 0,
          updatedAt: Date.now(),
        });
        return ok();
      },
    }),
  ],
});
