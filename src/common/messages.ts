export type MessageKey = 'list-items';
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

export type ItemType = 'file' | 'directory';
export type Item = Readonly<{
  name: string;
  type: ItemType;
}>;
export type ItemList = Readonly<{
  path: string;
  items: ReadonlyArray<Item>;
}>;
