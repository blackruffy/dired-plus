import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import { keyCtrlC, keyEnter, keyTab } from '@core/keyboard/keys';
import { cancel, completion, updateItemList } from '@dired/action/helpers';
import {
  getParentDirectory,
  renameDirectory,
  renameFile,
} from '@dired/events/native';
import { messageId } from '@dired/i18n/ja';
import { Action, Mode, SearchBox, statusState } from '@dired/store';
import { pipe } from 'fp-ts/lib/function';

export const searchBoxIsNoneRename = ({
  item,
  itemList,
  source,
  selectedItemIndex,
  separator,
  setMode,
  setSearchWord,
  setSearchBox,
  setItemList,
  setSelectedItemIndex,
}: Readonly<{
  item: Item;
  itemList?: ItemList;
  source: ReadonlyArray<Item>;
  selectedItemIndex?: number;
  separator: string;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setSearchBox: (searchBox: SearchBox) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedItemIndex: (selectedItemIndex?: number) => void;
}>): Action => ({
  id: 'search-box-is-none-rename',
  keys: [
    keyEnter({
      desc: { id: messageId.rename },
      run: async () =>
        source.length === 1
          ? pipe(source[0], async s =>
              pipe(
                s.itemType === 'file'
                  ? await renameFile(s.path, item.path)
                  : s.itemType === 'directory'
                    ? await renameDirectory(s.path, item.path)
                    : await Promise.reject(`Invalid item type: ${s.itemType}`),
                () => setMode(),
                async () =>
                  await updateItemList({
                    searchWord: `${await getParentDirectory(item.path)}${separator}`,
                    setSearchWord,
                    setItemList,
                    setSelectedItemIndex,
                  }),
                () =>
                  statusState({
                    id: messageId.copied,
                    values: { src: s.path, dest: item.path },
                  }),
              ),
            )
          : Promise.reject('Multiple items cannot be copied at once'),
    }),
    // run: async () => {
    //   if (source.itemType === 'file') {
    //     await renameFile(source.path, path);
    //   } else if (source.itemType === 'directory') {
    //     await renameDirectory(source.path, path);
    //   }
    //   setMode();
    //   await updateItemList({
    //     path: await getParentDirectory(path),
    //     setSearchWord,
    //     setItemList,
    //   });
    //   return ok(`Renamed ${source.path} to ${path}`);
    // },
    // }),

    keyTab(
      completion({
        path: item.path,
        itemList,
        selectedItemIndex,
        separator,
        setItemList,
        setSearchWord,
        setSearchBox,
        setSelectedItemIndex,
      }),
    ),

    keyCtrlC(
      cancel({
        source: source[0],
        separator,
        setMode,
        setSearchWord,
        setItemList,
        setSelectedItemIndex,
      }),
    ),
  ],
});
