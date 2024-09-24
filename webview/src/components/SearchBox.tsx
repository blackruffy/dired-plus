import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import { SelectedView } from '@src/store';
import React from 'react';
import { ItemBase, ItemListBase } from './ItemListView';

export type UpdateItemListArgs<
  Item extends ItemBase,
  ItemList extends ItemListBase<Item>,
> = Readonly<{
  path?: string;
  setSearchWord: (word: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>;

type LazyUpdate = Readonly<{
  searchWord: string;
  issuedAt: number;
}>;

const updateDuration = 10;

export const SearchBox = <
  Item extends ItemBase,
  ItemList extends ItemListBase<Item>,
>({
  searchWord,
  setSearchWord,
  setItemList,
  setSelectedView,
  updateItemList,
}: Readonly<{
  searchWord: string;
  setSearchWord: (word: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  updateItemList: (args: UpdateItemListArgs<Item, ItemList>) => Promise<void>;
}>): React.ReactElement => {
  const ref = React.useRef<HTMLInputElement>();
  const [lazyUpdate, setLazyUpdate] = React.useState<LazyUpdate | null>(null);
  const [updateTime, setUpdateTime] = React.useState(0);

  ref.current?.focus();

  React.useEffect(() => {
    if (
      lazyUpdate != null &&
      Date.now() - lazyUpdate.issuedAt > updateDuration
    ) {
      updateItemList({
        path: lazyUpdate.searchWord,
        setSearchWord,
        setItemList,
        setSelectedView,
      });
    }
  }, [
    lazyUpdate,
    updateTime,
    setSearchWord,
    setItemList,
    setSelectedView,
    updateItemList,
  ]);

  return (
    <TextField
      sx={{ padding: `8px` }}
      // label='Filter'
      inputRef={ref}
      fullWidth
      variant='standard'
      value={searchWord}
      // focused={isFocused}
      focused={true}
      autoFocus
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      onChange={event => {
        setLazyUpdate({
          searchWord: event.target.value,
          issuedAt: Date.now(),
        });
        setTimeout(() => setUpdateTime(Date.now()), updateDuration);
        setSearchWord(event.target.value);
      }}
    />
  );
};
