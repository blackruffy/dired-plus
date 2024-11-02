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
  updateItemList,
} from '@dired/action/helpers';
import {
  copyDirectory,
  copyFile,
  getParentDirectory,
} from '@dired/events/native';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SelectedView } from '@dired/store';
import { pipe } from 'fp-ts/lib/function';

export const searchBoxIsNoneCopy = ({
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
  id: 'search-box-is-none-copy',
  keys: [
    keyEnter({
      desc: { id: messageId.copy },
      run: async () =>
        source.length === 1
          ? pipe(source[0], async s =>
              pipe(
                s.itemType === 'file'
                  ? await copyFile(s.path, item.path)
                  : s.itemType === 'directory'
                    ? await copyDirectory(s.path, item.path)
                    : await Promise.reject(`Invalid item type: ${s.itemType}`),
                () => setMode(),
                async () =>
                  await updateItemList({
                    searchWord: `${await getParentDirectory(item.path)}${separator}`,
                    setSearchWord,
                    setItemList,
                    setSelectedView,
                  }),
                () => ({
                  status: {
                    message: {
                      id: messageId.copied,
                      values: { src: s.path, dst: item.path },
                    },
                    type: 'info',
                  },
                }),
              ),
            )
          : Promise.reject('Multiple items cannot be copied at once'),
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
