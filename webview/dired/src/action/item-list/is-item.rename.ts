import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyCtrlF,
  keyCtrlX,
  keyEnter,
  keyTab,
} from '@core/keyboard/keys';
import {
  bind,
  cancel,
  completion,
  goToParentDirectory,
  goToSearchBox,
  openItem,
  renameOverwrite,
} from '@dired/action/helpers';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SelectedView } from '@dired/store';

export const itemListIsItemRename = ({
  searchWord,
  itemList,
  selectedView,
  destination,
  source,
  separator,
  setMode,
  setSelectedView,
  setSearchWord,
  setItemList,
}: Readonly<{
  searchWord: string;
  itemList?: ItemList;
  selectedView: SelectedView;
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
          setSelectedView,
        }),
        goToSearchBox({ setSelectedView }),
      ),
    ),

    keyTab(
      completion({
        path: searchWord,
        itemList,
        selectedView,
        separator,
        setItemList,
        setSearchWord,
        setSelectedView,
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
        setSelectedView,
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
        setSelectedView,
      }),
    ),
  ],
});
