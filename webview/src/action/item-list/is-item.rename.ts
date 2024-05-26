import { Item, ItemList } from '@common/item';
import {
  goToParentDirectory,
  goToSearchBox,
  openItem,
  renameOverwrite,
} from '@src/action/helpers';
import { keyEnter, keyF, keyN, keyP, keyQ, keyX, keyY } from '@src/action/keys';
import { closePanel, getParentDirectory } from '@src/events/native';
import { Action, Mode, SelectedView, ok } from '@src/store';

export const itemListIsItemRename = ({
  destination,
  source,
  setMode,
  setSelectedView,
  setSearchWord,
  setItemList,
}: Readonly<{
  destination: Item;
  source: ReadonlyArray<Item>;
  setMode: (mode?: Mode) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>): Action => ({
  id: 'item-list-is-item-rename',
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: 'Open',
      run: openItem(destination, setSearchWord, setItemList, setSelectedView),
    }),

    keyP(
      goToParentDirectory({
        path: getParentDirectory(destination.path),
        setSearchWord,
        setItemList,
      }),
    ),

    keyX({
      desc: `Rename`,
      run: renameOverwrite(
        source,
        destination,
        setMode,
        setSearchWord,
        setItemList,
      ),
    }),

    keyF(goToSearchBox({ setSelectedView })),

    keyQ({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),
  ],
});
