import { createRunLazy } from '@common/lazy-run';
import { UpdateItemListArgs } from '@core/components/SearchBox';
import { typeclass } from '@core/utils';
import { Item, ItemList } from '@history/store';
import { readonlyArray } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

const runLazy = createRunLazy();

export const itemInstance: typeclass.Item<Item> = {
  getSearchWord: self => self,
};

export const itemListInstance: typeclass.ItemList<ItemList, Item> = {
  getItems: self => self.items,
};

export const updateItemList = ({
  searchWord,
  history,
  setSearchWord,
  setItemList,
  setSelectedItemIndex,
}: UpdateItemListArgs<ItemList> & Readonly<{ history?: ItemList }>): void =>
  runLazy(async () => {
    pipe(
      setSearchWord(searchWord ?? ''),
      () => ({
        items: history?.items ?? [],
        lsw: searchWord
          ?.toLocaleLowerCase()
          .split(' ')
          .filter(_ => _ !== ''),
      }),
      ({ items, lsw }) =>
        lsw == null
          ? items
          : pipe(
              items,
              readonlyArray.filter(
                x =>
                  x != null &&
                  lsw.every(y => x.toLocaleLowerCase().includes(y)),
              ),
            ),
      items =>
        pipe(setItemList({ items }), () =>
          items.length === 0 ? setSelectedItemIndex(undefined) : void 0,
        ),
    );
  });
