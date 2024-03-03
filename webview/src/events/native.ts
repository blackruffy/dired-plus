import {
  ItemList,
  ListItemsRequest,
  ListItemsResponnse,
  OpenFileRequest,
  OpenFileResponse,
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

export const updateItemList = async ({
  path,
  setSearchWord,
  setItemList,
}: Readonly<{
  path?: string;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
}>) => {
  const a = await listItems(path);
  setSearchWord(a.path);
  setItemList(a);
};

export const openFile = async (path: string): Promise<void> => {
  await request<OpenFileRequest, OpenFileResponse>({
    key: 'open-file',
    path,
  });
};

export const useNativeEvent = () => {
  const { itemList, setItemList, setSearchWord } = useStore();

  React.useEffect(() => {
    if (itemList === undefined) {
      scope(() => updateItemList({ setSearchWord, setItemList }));
    }
  }, [itemList, setItemList, setSearchWord]);
};
