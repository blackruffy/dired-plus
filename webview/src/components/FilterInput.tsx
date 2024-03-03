import { TextField } from '@mui/material';
import { updateItemList } from '@src/events/native';
import { useStore } from '@src/store';
import React from 'react';

export const FilterInput = (): React.ReactElement => {
  const { searchWord, selectedView, setSearchWord, setItemList } = useStore();
  const ref = React.useRef<HTMLInputElement>();
  const isFocused = selectedView.name === 'search-box';

  React.useEffect(() => {
    if (isFocused) {
      ref.current?.focus();
    } else {
      ref.current?.blur();
    }
  }, [isFocused]);

  return (
    <TextField
      inputRef={ref}
      fullWidth
      variant='standard'
      value={searchWord}
      focused={isFocused}
      autoFocus
      onChange={event =>
        updateItemList({ path: event.target.value, setSearchWord, setItemList })
      }
    />
  );
};
