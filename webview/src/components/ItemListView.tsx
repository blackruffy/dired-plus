import { Box, useTheme } from '@mui/material';
import { SelectedView } from '@src/store';
import React from 'react';

export type ItemBase = Readonly<{
  getSearchWord: () => string;
}>;

export type ItemListBase<Item extends ItemBase> = Readonly<{
  items: ReadonlyArray<Item>;
}>;

export type ItemViewParms<Item extends ItemBase> = Readonly<{
  index: number;
  item: Item;
}>;

export const ItemListView = <
  Item extends ItemBase,
  ItemList extends ItemListBase<Item>,
>({
  itemList,
  selectedView,
  setSearchWord,
  setSelectedView,
  ItemView,
}: Readonly<{
  itemList?: ItemList;
  selectedView: SelectedView;
  setSearchWord: (word: string) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  ItemView: (args: ItemViewParms<Item>) => React.ReactElement;
}>): React.ReactElement => {
  const theme = useTheme();
  const scrollRef = React.useRef<HTMLUListElement>(null);
  const selectedRef = React.useRef<HTMLDivElement>(null);

  const items = itemList?.items ?? [];

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
        const isSelected =
          selectedView.name === 'list-item' && selectedView.index === index;
        return (
          <Box
            ref={isSelected ? selectedRef : undefined}
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
              setSearchWord(item.getSearchWord());
            }}
          >
            <ItemView index={index} item={item} />
          </Box>
        );
      })}
    </Box>
  );
};
