import { Item, ItemList } from '@common/item';
import {
  cancel,
  goToParentDirectory,
  goToSearchBox,
  openItem,
  renameOverwrite,
} from '@src/action/helpers';
import {
  keyCtrlC,
  keyCtrlF,
  keyCtrlP,
  keyCtrlX,
  keyEnter,
} from '@src/action/keys';
import { getParentDirectory } from '@src/events/native';
import { messageId } from '@src/i18n/ja';
import { Action, Mode, SelectedView } from '@src/store';

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
  keys: [
    keyEnter({
      desc: { id: messageId.open },
      run: openItem(
        destination,
        separator,
        setSearchWord,
        setItemList,
        setSelectedView,
      ),
    }),

    keyCtrlP(
      goToParentDirectory({
        path: getParentDirectory(destination.path),
        separator,
        setSearchWord,
        setItemList,
      }),
    ),

    keyCtrlX({
      desc: { id: messageId.rename },
      run: renameOverwrite(
        source,
        destination,
        separator,
        setSearchWord,
        setItemList,
      ),
    }),

    keyCtrlF(goToSearchBox({ setSelectedView })),

    keyCtrlC(
      cancel({
        source: source[0],
        separator,
        setMode,
        setSearchWord,
        setItemList,
      }),
    ),
  ],
});
