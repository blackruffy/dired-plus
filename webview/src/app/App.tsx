import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAction } from '@src/action';
import { Main } from '@src/components/Main';
import { useKeyboardEvent } from '@src/events/keyboard';
import { useNativeEvent } from '@src/events/native';
import React from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const App = (): React.ReactNode => {
  const action = useAction();
  useNativeEvent();
  useKeyboardEvent(action);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Main action={action} />
    </ThemeProvider>
  );
};
