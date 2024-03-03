export type MessageKey = 'list-items' | 'open-file';
export type MessageType = 'request' | 'response';

export type Message<
  Key extends MessageKey,
  Type extends MessageType,
> = Readonly<{
  key: Key;
  id: string;
  type: Type;
}>;

export type Request<Key extends MessageKey> = Message<Key, 'request'>;
export type Response<Key extends MessageKey> = Message<Key, 'response'>;

export type ListItemsRequest = Request<'list-items'> &
  Readonly<{
    path?: string;
  }>;

export type ListItemsResponnse = Response<'list-items'> & ItemList;

export type OpenFileRequest = Request<'open-file'> & Readonly<{ path: string }>;
export type OpenFileResponse = Response<'open-file'>;

export type ItemType = 'file' | 'directory' | 'none';
export type Item = Readonly<{
  name: string;
  path: string;
  type: ItemType;
}>;
export type ItemList = Readonly<{
  path: string;
  items: ReadonlyArray<Item>;
}>;
