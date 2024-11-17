import { AnyVal } from '@common/anyval';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';

export type UpdateItemListArgs<ItemList> = Readonly<{
  searchWord?: string;
  itemList?: ItemList;
  setSearchWord: (word: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedItemIndex: (index?: number) => void;
}>;

export const SearchBox = <ItemList, _Dummy = AnyVal>({
  searchWord,
  itemList,
  setSearchWord,
  setItemList,
  setSelectedItemIndex,
  updateItemList,
}: Readonly<{
  searchWord: string;
  itemList?: ItemList;
  setSearchWord: (word: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedItemIndex: (index?: number) => void;
  updateItemList: (args: UpdateItemListArgs<ItemList>) => void;
}>): React.ReactElement => {
  const ref = React.useRef<HTMLInputElement>();
  ref.current?.focus();

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
        updateItemList({
          searchWord: event.target.value,
          itemList,
          setSearchWord,
          setItemList,
          setSelectedItemIndex,
        });
        setSearchWord(event.target.value);
      }}
    />
  );
};
