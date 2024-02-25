import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FilterInput } from '@src/components/FilterInput';
import { ItemList } from '@src/components/ItemList';
import { useKeyboardEvent } from '@src/events/keyboard';
import { useNativeEvent } from '@src/events/native';
import React from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const App = (): React.ReactNode => {
  useNativeEvent();
  useKeyboardEvent();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ width: '100%', height: '100vh' }}>
        <FilterInput />
        <ItemList />
      </Box>
    </ThemeProvider>
  );
};
