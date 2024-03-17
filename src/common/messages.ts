export type MessageKey =
  | 'list-items'
  | 'open-file'
  | 'create-file'
  | 'create-directory'
  | 'delete-file'
  | 'delete-directory';
export type MessageType = 'request' | 'response';

export type Message<
  Key extends MessageKey,
  Type extends MessageType,
> = Readonly<{
  key: Key;
  id: string;
  type: Type;
}>;

export type Error = Readonly<{
  error?: string;
}>;

export type Request<Key extends MessageKey> = Message<Key, 'request'>;
export type Response<Key extends MessageKey> = Message<Key, 'response'> & Error;

export type ListItemsRequest = Request<'list-items'> &
  Readonly<{
    path?: string;
  }>;

export type ListItemsResponnse = Response<'list-items'> & ItemList;

export type OpenFileRequest = Request<'open-file'> & Readonly<{ path: string }>;
export type OpenFileResponse = Response<'open-file'>;

export type CreateFileRequest = Request<'create-file'> &
  Readonly<{ path: string }>;
export type CreateFileResponse = Response<'create-file'>;

export type CreateDirectoryRequest = Request<'create-directory'> &
  Readonly<{ path: string }>;
export type CreateDirectoryResponse = Response<'create-directory'>;

export type DeleteFileRequest = Request<'delete-file'> &
  Readonly<{ path: string }>;
export type DeleteFileResponse = Response<'delete-file'>;

export type DeleteDirectoryRequest = Request<'delete-directory'> &
  Readonly<{ path: string }>;
export type DeleteDirectoryResponse = Response<'delete-directory'>;

export type ItemType = 'file' | 'directory' | 'none';
export type Item = Readonly<{
  name: string;
  path: string;
  itemType: ItemType;
}>;
export type ItemList = Readonly<{
  path: string;
  itemType: ItemType;
  items: ReadonlyArray<Item>;
}>;

export const response = <Res extends Response<MessageKey>>(
  req: Request<MessageKey>,
  res: Omit<Res, 'key' | 'id' | 'type'>,
): Res =>
  ({
    key: req.key,
    id: req.id,
    type: 'response',
    ...res,
  }) as Res;

export const errorResponse = (
  req: Request<MessageKey>,
  error: unknown,
): Response<MessageKey> => ({
  key: req.key,
  id: req.id,
  type: 'response',
  error: `${error}`,
});
