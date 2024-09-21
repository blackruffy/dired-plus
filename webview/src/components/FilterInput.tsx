import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import { updateItemList } from '@src/action/helpers';
import { useStore } from '@src/store';
import React from 'react';

type LazyUpdate = Readonly<{
  searchWord: string;
  issuedAt: number;
}>;

const updateDuration = 10;

export const FilterInput = (): React.ReactElement => {
  const { searchWord, setSearchWord, setItemList, setSelectedView } =
    useStore();
  const ref = React.useRef<HTMLInputElement>();
  const [lazyUpdate, setLazyUpdate] = React.useState<LazyUpdate | null>(null);
  const [updateTime, setUpdateTime] = React.useState(0);
  //const isFocused = selectedView.name === 'search-box';

  ref.current?.focus();
  // React.useEffect(() => {
  //   if (isFocused) {
  //     ref.current?.focus();
  //   } else {
  //     ref.current?.blur();
  //   }
  // }, [isFocused]);

  // React.useEffect(() => {
  //   if (isFocused) {
  //     if (
  //       selectedView.selectionStart !== undefined &&
  //       selectedView.selectionEnd !== undefined
  //     ) {
  //       ref.current?.setSelectionRange(
  //         selectedView.selectionStart,
  //         selectedView.selectionEnd,
  //       );
  //     }
  //   }
  // }, [isFocused, searchWord, selectedView]);

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
  }, [lazyUpdate, updateTime, setSearchWord, setItemList, setSelectedView]);

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

        // if (isFocused) {
        //   setSelectedView({
        //     ...selectedView,
        //     selectionStart: ref.current?.selectionStart ?? undefined,
        //     selectionEnd: ref.current?.selectionEnd ?? undefined,
        //   });
        // }
        setSearchWord(event.target.value);
      }}
    />
  );
};
