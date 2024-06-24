import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import { updateItemList } from '@src/action/helpers';
import { useStore } from '@src/store';
import React from 'react';

type LazyUpdate = Readonly<{
  searchWord: string;
  issuedAt: number;
  timeoutId?: NodeJS.Timeout;
}>;

const updateDuration = 10;

export const FilterInput = (): React.ReactElement => {
  const {
    searchWord,
    selectedView,
    setSearchWord,
    setItemList,
    setSelectedView,
  } = useStore();
  const ref = React.useRef<HTMLInputElement>();
  const lazyUpdate = React.useRef<LazyUpdate | null>();
  const isFocused = selectedView.name === 'search-box';

  React.useEffect(() => {
    if (isFocused) {
      ref.current?.focus();
    } else {
      ref.current?.blur();
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (isFocused) {
      if (
        selectedView.selectionStart !== undefined &&
        selectedView.selectionEnd !== undefined
      ) {
        ref.current?.setSelectionRange(
          selectedView.selectionStart,
          selectedView.selectionEnd,
        );
      }
    }
  }, [isFocused, searchWord, selectedView]);

  return (
    <TextField
      sx={{ padding: `8px` }}
      // label='Filter'
      inputRef={ref}
      fullWidth
      variant='standard'
      value={searchWord}
      focused={isFocused}
      autoFocus
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      onChange={event => {
        const timeoutId = setTimeout(() => {
          if (lazyUpdate.current != null) {
            if (Date.now() - lazyUpdate.current.issuedAt > updateDuration) {
              updateItemList({
                path: event.target.value,
                setSearchWord,
                setItemList,
              });
              lazyUpdate.current = null;
            } else {
              clearTimeout(lazyUpdate.current.timeoutId);
            }
          }
        }, updateDuration);

        lazyUpdate.current = {
          searchWord: event.target.value,
          issuedAt: Date.now(),
          timeoutId,
        };
        if (isFocused) {
          setSelectedView({
            ...selectedView,
            selectionStart: ref.current?.selectionStart ?? undefined,
            selectionEnd: ref.current?.selectionEnd ?? undefined,
          });
        }
        setSearchWord(event.target.value);
      }}
    />
  );
};
