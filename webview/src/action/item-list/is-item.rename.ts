import { Item, ItemList } from '@common/item';
import {
  cancel,
  goToParentDirectory,
  goToSearchBox,
  openItem,
  renameOverwrite,
} from '@src/action/helpers';
import {
  keyC,
  keyEnter,
  keyEscape,
  keyF,
  keyP,
  keyQ,
  keyX,
} from '@src/action/keys';
import { closePanel, getParentDirectory } from '@src/events/native';
import { Action, Mode, SelectedView, ok } from '@src/store';

export const itemListIsItemRename = ({
  destination,
  source,
  separator,
  setMode,
  setSelectedView,
  setSearchWord,
  setItemList,
}: Readonly<{
  destination: Item;
  source: ReadonlyArray<Item>;
  separator: string;
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
      run: openItem(
        destination,
        separator,
        setSearchWord,
        setItemList,
        setSelectedView,
      ),
    }),

    keyP(
      goToParentDirectory({
        path: getParentDirectory(destination.path),
        separator,
        setSearchWord,
        setItemList,
      }),
    ),

    keyX({
      desc: `Rename`,
      run: renameOverwrite(
        source,
        destination,
        separator,
        setMode,
        setSearchWord,
        setItemList,
      ),
    }),

    keyF(goToSearchBox({ setSelectedView })),

    keyC(
      cancel({
        source: source[0],
        separator,
        setMode,
        setSearchWord,
        setItemList,
      }),
    ),

    keyQ({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),

    keyEscape({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),
  ],
});
