import { useAction } from '@history/action/use-action';
import { useMessages } from '@history/i18n';
import { useKeyboardEvent } from '@history/keyboard/use-keyboard';
import { History } from '@history/pages/History';
import { useStore } from '@history/store';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { useInitialize } from './initialize';

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
  useInitialize();
  const action = useAction();
  useKeyboardEvent({ action });

  const messages = useMessages(locale);

  return (
    <ThemeProvider theme={colorTheme === 'Light' ? lightTheme : darkTheme}>
      <IntlProvider messages={messages} locale={locale} defaultLocale='en'>
        <CssBaseline />
        <History action={action} />
      </IntlProvider>
    </ThemeProvider>
  );
};
