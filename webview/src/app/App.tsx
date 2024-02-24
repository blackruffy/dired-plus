import { ListItemsRequest, ListItemsResponnse } from '@common/messages';
import { scope } from '@common/scope';
import { Box, TextField } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ItemList } from '@src/components/ItemList';
import { useStore } from '@src/store';
import { request } from '@src/utils/request';
import React from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const App = (): React.ReactNode => {
  const {
    itemList,
    selectedIndex,
    checked,
    setItemList,
    setSelectedIndex,
    setChecked,
  } = useStore();

  const nitems = itemList === undefined ? 0 : itemList.items.length;

  React.useEffect(() => {
    if (itemList === undefined) {
      scope(async () => {
        const res = await request<ListItemsRequest, ListItemsResponnse>({
          key: 'list-items',
        });
        setItemList(res);
      });
    }
  }, [itemList, setItemList]);

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('############', event.key, event.code);
      switch (event.code) {
        case 'ArrowUp':
          return setSelectedIndex(
            selectedIndex > 0 ? selectedIndex - 1 : nitems - 1,
          );
        case 'ArrowDown':
          return setSelectedIndex(
            selectedIndex < nitems - 1 ? selectedIndex + 1 : 0,
          );
        case 'Space':
          return setChecked({
            ...checked,
            [selectedIndex]:
              checked[selectedIndex] === undefined
                ? true
                : !checked[selectedIndex],
          });
        default:
      }
    };

    window.addEventListener('keydown', callback);
    return () => {
      window.removeEventListener('keydown', callback);
    };
  }, [nitems, selectedIndex, checked, setSelectedIndex, setChecked]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ width: '100%', height: '100vh' }}>
        <TextField fullWidth variant='standard' label={itemList?.path} />
        <ItemList />
      </Box>
    </ThemeProvider>
  );
};
