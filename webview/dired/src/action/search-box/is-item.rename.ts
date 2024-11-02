import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import {
  keyCtrlBackspace,
  keyCtrlC,
  keyEnter,
  keyTab,
} from '@core/keyboard/keys';
import {
  cancel,
  completion,
  goToParentDirectory,
  renameOverwrite,
} from '@dired/action/helpers';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SelectedView } from '@dired/store';
import { pipe } from 'fp-ts/lib/function';

export const searchBoxIsItemRename = ({
  item,
  itemList,
  source,
  selectedView,
  separator,
  setMode,
  setSearchWord,
  setItemList,
  setSelectedView,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  source: ReadonlyArray<Item>;
  selectedView: SelectedView;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): Action => ({
  id: 'search-box-is-item-rename',
  keys: [
    keyEnter({
      desc: { id: messageId.rename },
      run: pipe(
        renameOverwrite(
          source,
          item,
          separator,
          setSearchWord,
          setItemList,
          setSelectedView,
        ),
      ),
    }),

    keyCtrlBackspace(
      goToParentDirectory({
        path: Promise.resolve(item.path),
        separator,
        setItemList,
        setSearchWord,
        setSelectedView,
      }),
    ),

    keyTab(
      completion({
        path: item.path,
        itemList,
        selectedView,
        separator,
        setItemList,
        setSearchWord,
        setSelectedView,
      }),
    ),

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
