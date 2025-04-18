import { MessageKey, Request, UpdateItemListRequest } from '@common/messages';
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
    setSelectedItemIndex,
  } = useStore();

  core.useInitialize({
    setColorTheme,
    setLocale,
    separator,
    setSeparator,
  });

  React.useEffect(() => {
    if (itemList === undefined) {
      updateItemList({ setSearchWord, setItemList, setSelectedItemIndex });
    }
  }, [itemList, setItemList, setSearchWord, setSelectedItemIndex]);

  React.useEffect(() => {
    const callback = ({ data }: MessageEvent<Request<MessageKey>>) => {
      switch (data.key) {
        case 'update-item-list': {
          const req = data as UpdateItemListRequest;
          updateItemList({
            searchWord: req.path,
            setSearchWord,
            setItemList,
            setSelectedItemIndex,
          });
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
  }, [setSearchWord, setItemList, setSelectedItemIndex]);
};
