import { typeclass } from '@core/utils/';
import { Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { ListRange, Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { Subject } from 'rxjs';

export type ItemViewParms<Item> = Readonly<{
  index: number;
  item: Item;
}>;

export const scrollPageEvent = new Subject<'next' | 'prev'>();

const ItemBox = <Item, _Dummy = unknown>({
  index,
  items,
  selectedItemIndex,
  ItemView,
  setSearchWord,
  setSelectedItemIndex,
  instances: { itemInstance },
}: Readonly<{
  index: number;
  items: ReadonlyArray<Item>;
  selectedItemIndex?: number;
  ItemView: (args: ItemViewParms<Item>) => React.ReactElement;
  setSearchWord: (word: string) => void;
  setSelectedItemIndex: (index: number) => void;
  instances: Readonly<{
    itemInstance: typeclass.Item<Item>;
  }>;
}>): React.ReactElement => {
  const theme = useTheme();
  const item = items[index];
  const isSelected = selectedItemIndex === index;
  return (
    <Box
      key={index}
      //selected={isSelected}
      sx={{
        paddingTop: `0px`,
        paddingBottom: `0px`,
        //height: `24px`,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: isSelected
          ? theme.palette.action.selected
          : 'transparent',
      }}
      onClick={e => {
        e.stopPropagation();
        setSelectedItemIndex(index);
        // setSelectedView({
        //   name: 'list-item',
        //   index,
        //   updatedAt: selectedView.updatedAt,
        // });
        setSearchWord(itemInstance.getSearchWord(item));
      }}
    >
      <ItemView index={index} item={item} />
    </Box>
  );
};

export const ItemListView = <Item, ItemList>({
  itemList,
  selectedItemIndex,
  ItemView,
  setSearchWord,
  setSelectedItemIndex,
  instances,
}: Readonly<{
  itemList?: ItemList;
  selectedItemIndex: number | undefined;
  ItemView: (args: ItemViewParms<Item>) => React.ReactElement;
  setSearchWord: (word: string) => void;
  setSelectedItemIndex: (index: number) => void;
  instances: Readonly<{
    itemInstance: typeclass.Item<Item>;
    itemListInstance: typeclass.ItemList<ItemList, Item>;
  }>;
}>): React.ReactElement => {
  const ref = React.useRef<VirtuosoHandle>(null);

  const [range, setRange] = React.useState<ListRange | null>(null);

  const items = useMemo(() => {
    return itemList == null
      ? []
      : instances.itemListInstance.getItems(itemList);
  }, [itemList, instances.itemListInstance]);

  const [prevSelectedIndex, setPrevSelectedIndex] = React.useState<number>();

  React.useEffect(() => {
    setPrevSelectedIndex(selectedItemIndex);
  }, [selectedItemIndex]);

  React.useEffect(() => {
    if (
      selectedItemIndex != null &&
      range != null &&
      range.startIndex !== range.endIndex &&
      ((selectedItemIndex !== 0 && selectedItemIndex <= range.startIndex) ||
        (selectedItemIndex !== items.length - 1 &&
          selectedItemIndex >= range.endIndex))
    ) {
      if (
        prevSelectedIndex != null &&
        Math.abs(selectedItemIndex - prevSelectedIndex) === 1
      ) {
        ref.current?.scrollToIndex({
          index: selectedItemIndex,
          align: 'center',
          // behavior: 'smooth',
        });
      }
      // else if (selectedIndex === prevSelectedIndex) {
      //   if (selectedView.name === 'list-item') {
      //     setSelectedView({
      //       ...selectedView,
      //       index: Math.round((range.endIndex + range.startIndex) / 2),
      //     });
      //   }
      // }
    }
  }, [selectedItemIndex, prevSelectedIndex, range, items]);

  React.useEffect(() => {
    const s = scrollPageEvent.subscribe(event => {
      if (range != null) {
        const nextIndex = event === 'next' ? range.endIndex : range.startIndex;
        ref.current?.scrollToIndex({
          index: nextIndex,
          align: event === 'next' ? 'start' : 'end',
        });

        setSelectedItemIndex(nextIndex);
      }
    });
    return () => {
      s.unsubscribe();
    };
  }, [range, setSelectedItemIndex, selectedItemIndex]);

  return (
    <Virtuoso
      ref={ref}
      totalCount={items.length}
      itemContent={index => (
        <ItemBox
          key={index}
          index={index}
          items={items}
          selectedItemIndex={selectedItemIndex}
          ItemView={ItemView}
          setSearchWord={setSearchWord}
          setSelectedItemIndex={setSelectedItemIndex}
          instances={instances}
        />
      )}
      rangeChanged={setRange}
    />
  );
};
