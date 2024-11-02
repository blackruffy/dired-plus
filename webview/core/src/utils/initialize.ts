import { ColorTheme } from '@common/theme-color';
import { getColorTheme, getLocale, getSeparator } from '@core/native/api';
import { useNativeListener } from '@core/native/listener';
import React from 'react';

export const useInitialize = ({
  setColorTheme,
  setLocale,
  separator,
  setSeparator,
}: Readonly<{
  setColorTheme: (colorTheme: ColorTheme) => void;
  setLocale: (locale: string) => void;
  separator?: string;
  setSeparator: (separator: string) => void;
}>): void => {
  useNativeListener({ setColorTheme });

  React.useEffect(() => {
    getColorTheme().then(setColorTheme);
  }, [setColorTheme]);

  React.useEffect(() => {
    getLocale().then(setLocale);
  }, [setLocale]);

  React.useEffect(() => {
    if (separator == null) {
      getSeparator().then(setSeparator);
    }
  }, [separator, setSeparator]);
};
