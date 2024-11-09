import * as core from '@core/utils/initialize';
import { updateItemList } from '@dired/action/helpers';
import { useStore } from '@dired/store';
import React from 'react';

export const useInitialize = (): void => {
  const {
    itemList,
    setItemList,
    setSearchWord,
    separator,
    setSeparator,
    setColorTheme,
    setLocale,
    setSelectedView,
  } = useStore();

  core.useInitialize({
    setColorTheme,
    setLocale,
    separator,
    setSeparator,
  });

  React.useEffect(() => {
    if (itemList === undefined) {
      updateItemList({ setSearchWord, setItemList, setSelectedView });
    }
  }, [itemList, setItemList, setSearchWord, setSelectedView]);
};