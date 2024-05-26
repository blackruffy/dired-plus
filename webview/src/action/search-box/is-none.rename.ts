import { Item, ItemList } from '@common/item';
import { updateItemList } from '@src/action/helpers';
import { keyEnter } from '@src/action/keys';
import {
  getParentDirectory,
  renameDirectory,
  renameFile,
} from '@src/events/native';
import { Action, Mode, ok } from '@src/store';
import { pipe } from 'fp-ts/lib/function';

export const searchBoxIsNoneRename = ({
  path,
  source,
  setMode,
  setSearchWord,
  setItemList,
}: Readonly<{
  path: string;
  source: ReadonlyArray<Item>;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>): Action => ({
  id: 'search-box-is-none-rename',
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: 'Rename',
      run: async () =>
        source.length === 1
          ? pipe(source[0], async s =>
              pipe(
                s.itemType === 'file'
                  ? await renameFile(s.path, path)
                  : s.itemType === 'directory'
                    ? await renameDirectory(s.path, path)
                    : await Promise.reject(`Invalid item type: ${s.itemType}`),
                () => setMode(),
                async () =>
                  await updateItemList({
                    path: await getParentDirectory(path),
                    setSearchWord,
                    setItemList,
                  }),
                () => ok(`Copied ${s.path} to ${path}`),
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
  ],
});
