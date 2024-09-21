import { Item, ItemList } from '@common/item';
import {
  bind,
  cancel,
  goToParentDirectory,
  goToSearchBox,
  openItem,
  renameOverwrite,
} from '@src/action/helpers';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyCtrlF,
  keyCtrlX,
  keyEnter,
} from '@src/action/keys';
import { messageId } from '@src/i18n/ja';
import { Action, Mode, SelectedView } from '@src/store';

export const itemListIsItemRename = ({
  searchWord,
  destination,
  source,
  separator,
  setMode,
  setSelectedView,
  setSearchWord,
  setItemList,
}: Readonly<{
  searchWord: string;
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

    keyCtrlBackspace(
      bind(
        { id: messageId.toParentDir },
        goToParentDirectory({
          path: Promise.resolve(searchWord),
          separator,
          setSearchWord,
          setItemList,
        }),
        goToSearchBox({ setSelectedView }),
      ),
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
