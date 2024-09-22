import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import { updateItemList } from '@src/action/helpers';
import { SearchBox } from '@src/components/SearchBox';
import { useStore } from '@src/store';
import React from 'react';

type LazyUpdate = Readonly<{
  searchWord: string;
  issuedAt: number;
}>;

const updateDuration = 10;

export const DiredSearchBox = (): React.ReactElement => {
  const { searchWord, setSearchWord, setItemList, setSelectedView } =
    useStore();

  return (
    <SearchBox
      searchWord={searchWord}
      setSearchWord={setSearchWord}
      setItemList={setItemList}
      setSelectedView={setSelectedView}
      updateItemList={updateItemList}
    />
  );
  // const ref = React.useRef<HTMLInputElement>();
  // const [lazyUpdate, setLazyUpdate] = React.useState<LazyUpdate | null>(null);
  // const [updateTime, setUpdateTime] = React.useState(0);

  // ref.current?.focus();

  // React.useEffect(() => {
  //   if (
  //     lazyUpdate != null &&
  //     Date.now() - lazyUpdate.issuedAt > updateDuration
  //   ) {
  //     updateItemList({
  //       path: lazyUpdate.searchWord,
  //       setSearchWord,
  //       setItemList,
  //       setSelectedView,
  //     });
  //   }
  // }, [lazyUpdate, updateTime, setSearchWord, setItemList, setSelectedView]);

  // return (
  //   <TextField
  //     sx={{ padding: `8px` }}
  //     // label='Filter'
  //     inputRef={ref}
  //     fullWidth
  //     variant='standard'
  //     value={searchWord}
  //     // focused={isFocused}
  //     focused={true}
  //     autoFocus
  //     InputProps={{
  //       startAdornment: (
  //         <InputAdornment position='start'>
  //           <SearchIcon />
  //         </InputAdornment>
  //       ),
  //     }}
  //     onChange={event => {
  //       setLazyUpdate({
  //         searchWord: event.target.value,
  //         issuedAt: Date.now(),
  //       });
  //       setTimeout(() => setUpdateTime(Date.now()), updateDuration);
  //       setSearchWord(event.target.value);
  //     }}
  //   />
  // );
};
