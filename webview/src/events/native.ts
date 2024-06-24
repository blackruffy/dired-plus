import { FileOptions } from '@common/file-options';
import { ItemList } from '@common/item';
import {
  ClosePanelRequest,
  ClosePanelResponse,
  CopyDirectoryRequest,
  CopyDirectoryResponse,
  CopyFileRequest,
  CopyFileResponse,
  CreateDirectoryRequest,
  CreateDirectoryResponse,
  CreateFileRequest,
  CreateFileResponse,
  DeleteDirectoryRequest,
  DeleteDirectoryResponse,
  DeleteFileRequest,
  DeleteFileResponse,
  GetBaseNameRequest,
  GetBaseNameResponse,
  GetParentDirectoryRequest,
  GetParentDirectoryResponse,
  GetSeparatorRequest,
  GetSeparatorResponse,
  JoinPathRequest,
  JoinPathResponse,
  ListItemsRequest,
  ListItemsResponnse,
  OpenFileRequest,
  OpenFileResponse,
  RenameDirectoryRequest,
  RenameDirectoryResponse,
  RenameFileRequest,
  RenameFileResponse,
} from '@common/messages';
import { updateItemList } from '@src/action/helpers';
import { useStore } from '@src/store';
import { request } from '@src/utils/request';
import React from 'react';

export const listItems = async (path?: string): Promise<ItemList> =>
  request<ListItemsRequest, ListItemsResponnse>({
    key: 'list-items',
    path,
  });

export const getParentDirectory = async (path: string): Promise<string> =>
  (
    await request<GetParentDirectoryRequest, GetParentDirectoryResponse>({
      key: 'get-parent-directory',
      path,
    })
  ).path;

export const getBaseName = async (path: string): Promise<string> =>
  (
    await request<GetBaseNameRequest, GetBaseNameResponse>({
      key: 'get-base-name',
      path,
    })
  ).name;

export const getSeparator = async (): Promise<string> =>
  (
    await request<GetSeparatorRequest, GetSeparatorResponse>({
      key: 'get-separator',
    })
  ).separator;

export const joinPath = async (
  ...items: ReadonlyArray<string>
): Promise<string> =>
  (
    await request<JoinPathRequest, JoinPathResponse>({
      key: 'join-path',
      items,
    })
  ).path;

export const openFile = async (path: string): Promise<void> => {
  await request<OpenFileRequest, OpenFileResponse>({
    key: 'open-file',
    path,
  });
};

export const createFile = async (path: string): Promise<void> => {
  await request<CreateFileRequest, CreateFileResponse>({
    key: 'create-file',
    path,
  });
};

export const createDirectory = async (path: string): Promise<void> => {
  await request<CreateDirectoryRequest, CreateDirectoryResponse>({
    key: 'create-directory',
    path,
  });
};

export const copyFile = async (
  source: string,
  destination: string,
  options: FileOptions = {},
): Promise<void> => {
  await request<CopyFileRequest, CopyFileResponse>({
    key: 'copy-file',
    source,
    destination,
    options,
  });
};

export const copyDirectory = async (
  source: string,
  destination: string,
  options: FileOptions = {},
): Promise<void> => {
  await request<CopyDirectoryRequest, CopyDirectoryResponse>({
    key: 'copy-directory',
    source,
    destination,
    options,
  });
};

export const renameFile = async (
  source: string,
  destination: string,
  options: FileOptions = {},
): Promise<void> => {
  await request<RenameFileRequest, RenameFileResponse>({
    key: 'rename-file',
    source,
    destination,
    options,
  });
};

export const renameDirectory = async (
  source: string,
  destination: string,
  options: FileOptions = {},
): Promise<void> => {
  await request<RenameDirectoryRequest, RenameDirectoryResponse>({
    key: 'rename-directory',
    source,
    destination,
    options,
  });
};

export const deleteFile = async (path: string): Promise<ItemList> =>
  request<DeleteFileRequest, DeleteFileResponse>({
    key: 'delete-file',
    path,
  });

export const deleteDirectory = async (path: string): Promise<ItemList> =>
  request<DeleteDirectoryRequest, DeleteDirectoryResponse>({
    key: 'delete-directory',
    path,
  });

export const closePanel = async (): Promise<void> => {
  await request<ClosePanelRequest, ClosePanelResponse>({
    key: 'close-panel',
  });
};

export const useNativeEvent = () => {
  const { itemList, setItemList, setSearchWord, separator, setSeparator } =
    useStore();

  React.useEffect(() => {
    if (itemList === undefined) {
      updateItemList({ setSearchWord, setItemList });
    }
  }, [itemList, setItemList, setSearchWord]);

  React.useEffect(() => {
    if (separator == null) {
      getSeparator().then(setSeparator);
    }
  }, [separator, setSeparator]);
};
