import { FileOptions } from '../common/file-options';
import { ColorTheme } from '../common/theme-color';
import { DiredItemList } from './dired-item';

export type MessageKey =
  | 'list-items'
  | 'get-parent-directory'
  | 'get-base-name'
  | 'get-separator'
  | 'join-path'
  | 'open-file'
  | 'create-file'
  | 'create-directory'
  | 'copy-file'
  | 'copy-directory'
  | 'rename-file'
  | 'rename-directory'
  | 'delete-file'
  | 'delete-directory'
  | 'close-panel'
  | 'get-color-theme'
  | 'set-color-theme'
  | 'get-locale'
  | 'show-folder'
  | 'get-long-history';

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
    nextToken?: string;
  }>;

export type ListItemsResponnse = Response<'list-items'> &
  DiredItemList &
  Readonly<{
    nextToken?: string;
  }>;

export type GetParentDirectoryRequest = Request<'get-parent-directory'> &
  Readonly<{ path: string }>;
export type GetParentDirectoryResponse = Response<'get-parent-directory'> &
  Readonly<{ path: string }>;

export type GetBaseNameRequest = Request<'get-base-name'> &
  Readonly<{ path: string }>;
export type GetBaseNameResponse = Response<'get-base-name'> &
  Readonly<{ name: string }>;

export type GetSeparatorRequest = Request<'get-separator'>;
export type GetSeparatorResponse = Response<'get-separator'> &
  Readonly<{ separator: string }>;

export type JoinPathRequest = Request<'join-path'> &
  Readonly<{ items: ReadonlyArray<string> }>;
export type JoinPathResponse = Response<'join-path'> &
  Readonly<{ path: string }>;

export type OpenFileRequest = Request<'open-file'> & Readonly<{ path: string }>;
export type OpenFileResponse = Response<'open-file'>;

export type CreateFileRequest = Request<'create-file'> &
  Readonly<{ path: string }>;
export type CreateFileResponse = Response<'create-file'>;

export type CreateDirectoryRequest = Request<'create-directory'> &
  Readonly<{ path: string }>;
export type CreateDirectoryResponse = Response<'create-directory'>;

export type CopyFileRequest = Request<'copy-file'> &
  Readonly<{ source: string; destination: string; options?: FileOptions }>;
export type CopyFileResponse = Response<'copy-file'>;

export type CopyDirectoryRequest = Request<'copy-directory'> &
  Readonly<{ source: string; destination: string; options?: FileOptions }>;
export type CopyDirectoryResponse = Response<'copy-directory'>;

export type RenameFileRequest = Request<'rename-file'> &
  Readonly<{ source: string; destination: string; options?: FileOptions }>;
export type RenameFileResponse = Response<'rename-file'>;

export type RenameDirectoryRequest = Request<'rename-directory'> &
  Readonly<{ source: string; destination: string; options?: FileOptions }>;
export type RenameDirectoryResponse = Response<'rename-directory'>;

export type DeleteFileRequest = Request<'delete-file'> &
  Readonly<{ path: string; nextToken?: string }>;
export type DeleteFileResponse = Response<'delete-file'> &
  Omit<DiredItemList, 'items'> &
  Readonly<{
    nextToken?: string;
  }>;

export type DeleteDirectoryRequest = Request<'delete-directory'> &
  Readonly<{ path: string; nextToken?: string }>;
export type DeleteDirectoryResponse = Response<'delete-directory'> &
  Omit<DiredItemList, 'items'> &
  Readonly<{
    nextToken?: string;
  }>;

export type ClosePanelRequest = Request<'close-panel'>;
export type ClosePanelResponse = Response<'close-panel'>;

export type GetColorThemeRequest = Request<'get-color-theme'>;
export type GetColorThemeResponse = Response<'get-color-theme'> &
  Readonly<{ colorTheme: ColorTheme }>;

export type SetColorThemeRequest = Request<'set-color-theme'> &
  Readonly<{ colorTheme: ColorTheme }>;
export type SetColorThemeResponse = Response<'set-color-theme'>;

export type GetLocaleRequest = Request<'get-locale'>;
export type GetLocaleResponse = Response<'get-locale'> &
  Readonly<{ locale: string }>;

export type ShowFolderRequest = Request<'show-folder'> &
  Readonly<{ path: string }>;
export type ShowFolderResponse = Response<'show-folder'>;

export type GetLongHistoryRequest = Request<'get-long-history'>;
export type GetLongHistoryResponse = Response<'get-long-history'> &
  Readonly<{
    items: ReadonlyArray<string>;
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
