import { MessageKey, Request, UpdateItemListRequest } from '@common/messages';
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

  const updateItemList = React.useCallback(async () => {
    const history = await getLongHistory();
    setHistory(history);
    setItemList(history);
  }, [setHistory, setItemList]);

  React.useEffect(() => {
    scope(async () => {
      if (itemList === undefined) {
        await updateItemList();
      }
    });
  }, [itemList, updateItemList]);

  React.useEffect(() => {
    const callback = ({ data }: MessageEvent<Request<MessageKey>>) => {
      switch (data.key) {
        case 'update-item-list': {
          updateItemList();
          break;
        }
        default: {
          // console.error(`Invalid request: ${data.key}`);
          break;
        }
      }
    };
    window.addEventListener('message', callback);
    return () => {
      window.removeEventListener('message', callback);
    };
  }, [updateItemList]);
};
