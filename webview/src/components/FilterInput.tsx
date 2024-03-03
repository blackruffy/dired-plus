import { TextField } from '@mui/material';
import { updateItemList } from '@src/events/native';
import { useStore } from '@src/store';
import React from 'react';

export const FilterInput = (): React.ReactElement => {
  const { searchWord, selectedView, setSearchWord, setItemList } = useStore();
  return (
    <TextField
      fullWidth
      variant='standard'
      value={searchWord}
      focused={selectedView.name === 'search-box'}
      autoFocus
      onChange={event =>
        updateItemList({ path: event.target.value, setSearchWord, setItemList })
      }
    />
  );
};
