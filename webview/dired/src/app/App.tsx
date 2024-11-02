import { useAction } from '@dired/action/use-action';
import { useKeyboardEvent } from '@dired/events/keyboard';
import { useMessages } from '@dired/i18n';
import { Dired } from '@dired/pages/Dired';
import { useStore } from '@dired/store';
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
        <Dired action={action} />
      </IntlProvider>
    </ThemeProvider>
  );
};
