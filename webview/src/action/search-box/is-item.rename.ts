import { task } from '@common/index';
import { Item, ItemList, ItemType } from '@common/item';
import { renameOverwrite } from '@src/action/helpers';
import { keyEnter, keyN, keyY } from '@src/action/keys';
import { getBaseName } from '@src/events/native';
import { Action, Mode, ok } from '@src/store';
import { pipe } from 'fp-ts/lib/function';

export const searchBoxIsItemRename = ({
  path,
  itemType,
  source,
  setMode,
  setSearchWord,
  setItemList,
}: Readonly<{
  path: string;
  itemType: ItemType;
  source: ReadonlyArray<Item>;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>): Action => ({
  id: 'search-box-is-item-rename',
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: 'Rename',
      run: pipe(
        task.fromPromise(() => getBaseName(path)),
        task.chain(name =>
          renameOverwrite(
            source,
            { name, path, itemType },
            setMode,
            setSearchWord,
            setItemList,
          ),
        ),
      ),
    }),
  ],
});
