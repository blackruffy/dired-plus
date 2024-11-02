import { scope } from '@common/scope';
import * as core from '@core/utils/initialize';
import { getLongHistory } from '@history/native/api';
import { useStore } from '@history/store';
import React from 'react';

export const useInitialize = (): void => {
  const {
    separator,
    setSeparator,
    setColorTheme,
    setLocale,
    itemList,
    setHistory,
    setItemList,
  } = useStore();

  core.useInitialize({
    setColorTheme,
    setLocale,
    separator,
    setSeparator,
  });

  React.useEffect(() => {
    scope(async () => {
      if (itemList === undefined) {
        const history = await getLongHistory();
        setHistory(history);
        setItemList(history);
      }
    });
  }, [itemList, setHistory, setItemList]);
};
