import { DiredItemList as ItemList } from '@common/dired-item';
import { FileOptions } from '@common/file-options';
import {
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
  JoinPathRequest,
  JoinPathResponse,
  ListItemsRequest,
  ListItemsResponse,
  RenameDirectoryRequest,
  RenameDirectoryResponse,
  RenameFileRequest,
  RenameFileResponse,
  ShowFolderRequest,
  ShowFolderResponse,
} from '@common/messages';
import { request } from '@core/native/request';

export const listItems = async (path?: string): Promise<ItemList> =>
  await request<ListItemsRequest, ListItemsResponse>({
    key: 'list-items',
    path,
  });

export const eachListItems = async ({
  path,
  callback,
}: Readonly<{
  path?: string;
  callback: (items: ItemList, index: number) => void;
}>): Promise<void> => {
  await eachListItemsHelper({
    makeRequest: ({ nextToken }) =>
      request<ListItemsRequest, ListItemsResponse>({
        key: 'list-items',
        path,
        nextToken,
      }),
    callback,
  });
};

const eachListItemsHelper = async ({
  makeRequest,
  callback,
}: Readonly<{
  makeRequest: (
    args: Readonly<{ nextToken?: string }>,
  ) => Promise<ItemList & Readonly<{ nextToken?: string }>>;
  callback: (items: ItemList, index: number) => void;
}>): Promise<void> => {
  await foldRequestSeqHelper<
    [ItemList | null, number],
    ItemList & Readonly<{ nextToken?: string }>
  >({
    makeRequest: ({ nextToken }) => makeRequest({ nextToken }),
    getNextToken: _ => _.nextToken,
    value: [null, 0],
    callback: ([a, i], itemList) => {
      const r =
        a == null
          ? itemList
          : {
              parent: a.parent,
              items: [...a.items, ...itemList.items],
            };
      callback(r, i);
      return [r, i + 1];
    },
  });
};

const foldRequestSeqHelper = async <A, B>({
  //path,
  nextToken,
  makeRequest,
  getNextToken,
  value,
  callback,
}: Readonly<{
  nextToken?: string;
  makeRequest: (args: Readonly<{ nextToken?: string }>) => Promise<B>;
  getNextToken: (b: B) => string | undefined;
  value: A;
  callback: (a: A, b: B) => A;
}>): Promise<A> => {
  const resp1 = await makeRequest({ nextToken });
  const next = callback(value, resp1);
  const nextNextToken = getNextToken(resp1);
  if (nextNextToken != null) {
    return await foldRequestSeqHelper({
      nextToken: nextNextToken,
      makeRequest,
      getNextToken,
      value: next,
      callback,
    });
  } else {
    return next;
  }
};

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

export const joinPath = async (
  ...items: ReadonlyArray<string>
): Promise<string> =>
  (
    await request<JoinPathRequest, JoinPathResponse>({
      key: 'join-path',
      items,
    })
  ).path;

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

export const deleteFile = async (
  path: string,
): Promise<Omit<ItemList, 'items'>> =>
  await request<DeleteFileRequest, DeleteFileResponse>({
    key: 'delete-file',
    path,
  });

export const deleteDirectory = async (
  path: string,
): Promise<Omit<ItemList, 'items'>> =>
  await request<DeleteDirectoryRequest, DeleteDirectoryResponse>({
    key: 'delete-directory',
    path,
  });

export const showFolder = async (path: string): Promise<void> => {
  await request<ShowFolderRequest, ShowFolderResponse>({
    key: 'show-folder',
    path,
  });
};
