import { Item, ItemList } from '@common/item';
import {
  copyOverwrite,
  goToParentDirectory,
  goToSearchBox,
  openItem,
} from '@src/action/helpers';
import { keyEnter, keyF, keyP, keyQ, keyX } from '@src/action/keys';
import { closePanel, getParentDirectory } from '@src/events/native';
import { Action, Mode, SelectedView, ok } from '@src/store';

export const itemListIsItemCopy = ({
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
  id: 'item-list-is-item-copy',
  title: `Copy to:`,
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
      desc: `Copy`,
      run: copyOverwrite(
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
