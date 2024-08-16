import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAction } from '@src/action/use-action';
import { Main } from '@src/components/Main';
import { useKeyboardEvent } from '@src/events/keyboard';
import { useNativeListener } from '@src/events/listener';
import { useNativeEvent } from '@src/events/native';
import { useMessages } from '@src/i18n';
import { useStore } from '@src/store';
import React from 'react';
import { IntlProvider } from 'react-intl';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export const App = (): React.ReactNode => {
  const { colorTheme, locale } = useStore();
  useNativeListener();
  const action = useAction();
  useNativeEvent();
  useKeyboardEvent({ action });

  const messages = useMessages(locale);

  return (
    <ThemeProvider theme={colorTheme === 'Light' ? lightTheme : darkTheme}>
      <IntlProvider messages={messages} locale={locale} defaultLocale='en'>
        <CssBaseline />
        <Main action={action} />
      </IntlProvider>
    </ThemeProvider>
  );
};
