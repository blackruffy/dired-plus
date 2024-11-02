import { typeclass } from '@core/utils/';
import { SelectedView } from '@dired/store';
import { Box, useTheme } from '@mui/material';
import React from 'react';
import { Subject, first } from 'rxjs';

export type ItemViewParms<Item> = Readonly<{
  index: number;
  item: Item;
}>;

export const scrollPageEvent = new Subject<'next' | 'prev'>();

export const ItemListView = <Item, ItemList>({
  itemList,
  selectedView,
  setSearchWord,
  setSelectedView,
  ItemView,
  instances: { itemInstance, itemListInstance },
}: Readonly<{
  itemList?: ItemList;
  selectedView: SelectedView;
  setSearchWord: (word: string) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  ItemView: (args: ItemViewParms<Item>) => React.ReactElement;
  instances: Readonly<{
    itemInstance: typeclass.Item<Item>;
    itemListInstance: typeclass.ItemList<ItemList, Item>;
  }>;
}>): React.ReactElement => {
  const theme = useTheme();
  const scrollRef = React.useRef<HTMLUListElement>(null);
  const selectedRef = React.useRef<HTMLDivElement>(null);
  const firstItemRef = React.useRef<HTMLDivElement>(null);

  const items = itemList == null ? [] : itemListInstance.getItems(itemList);

  const selectedIndex = React.useMemo(
    () => (selectedView.name === 'list-item' ? selectedView.index : undefined),
    [selectedView],
  );

  React.useEffect(() => {
    if (scrollRef.current && selectedRef.current) {
      const containerRect = scrollRef.current.getBoundingClientRect();
      const scrollTop = scrollRef.current.scrollTop;
      const scrollBottom = scrollTop + containerRect.height;
      const itemRect = selectedRef.current.getBoundingClientRect();
      const itemY = scrollTop + itemRect.y - itemRect.height;
      if (itemY < scrollTop) {
        selectedRef.current.scrollIntoView({
          block: 'center',
        });
      } else if (itemY > scrollBottom) {
        selectedRef.current.scrollIntoView({
          block: 'center',
        });
      }
    }
  }, [selectedView]);

  React.useEffect(() => {
    const s = scrollPageEvent.subscribe(event => {
      if (scrollRef.current) {
        const containerRect = scrollRef.current.getBoundingClientRect();
        const diff = containerRect.height;
        const sign = event === 'prev' ? -1 : 1;
        const top = scrollRef.current.scrollTop + sign * diff;
        scrollRef.current.scrollTop = top < 0 ? 0 : top;

        if (selectedView.name === 'list-item' && firstItemRef.current) {
          const itemRect = firstItemRef.current.getBoundingClientRect();
          const index =
            Math.floor(scrollRef.current.scrollTop / itemRect.height) + 1;
          setSelectedView({
            ...selectedView,
            index: index,
            updatedAt: Date.now(),
          });
        }
      }
    });
    return () => {
      s.unsubscribe();
    };
  }, [selectedView, setSelectedView]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        p: 0.5,
        flex: 1,
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {items.map((item, index) => {
        const isSelected = selectedIndex === index;
        return (
          <Box
            ref={
              isSelected
                ? selectedRef
                : index === 0 || index === 1
                  ? firstItemRef
                  : undefined
            }
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
              setSelectedView({
                name: 'list-item',
                index,
                updatedAt: selectedView.updatedAt,
              });
              setSearchWord(itemInstance.getSearchWord(item));
            }}
          >
            <ItemView index={index} item={item} />
          </Box>
        );
      })}
    </Box>
  );
};
