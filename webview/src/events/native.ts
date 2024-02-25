import {
  ItemList,
  ListItemsRequest,
  ListItemsResponnse,
} from '@common/messages';
import { scope } from '@common/scope';
import { useStore } from '@src/store';
import { request } from '@src/utils/request';
import React from 'react';

export const listItems = async (path?: string): Promise<ItemList> =>
  request<ListItemsRequest, ListItemsResponnse>({
    key: 'list-items',
    path,
  });

export const useNativeEvent = () => {
  const { itemList, setItemList } = useStore();

  React.useEffect(() => {
    if (itemList === undefined) {
      scope(async () => setItemList(await listItems()));
    }
  }, [itemList, setItemList]);
};
