import { Item, ItemList } from '@common/item';
import { updateItemList } from '@src/action/helpers';
import { keyEnter } from '@src/action/keys';
import {
  copyDirectory,
  copyFile,
  getParentDirectory,
} from '@src/events/native';
import { Action, Mode, ok } from '@src/store';
import { pipe } from 'fp-ts/lib/function';

export const searchBoxIsNoneCopy = ({
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
  id: 'search-box-is-none-copy',
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: 'Copy',
      run: async () =>
        source.length === 1
          ? pipe(source[0], async s =>
              pipe(
                s.itemType === 'file'
                  ? await copyFile(s.path, path)
                  : s.itemType === 'directory'
                    ? await copyDirectory(s.path, path)
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
  ],
});
