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
  GetColorThemeRequest,
  GetColorThemeResponse,
  GetLocaleRequest,
  GetLocaleResponse,
  GetParentDirectoryRequest,
  GetParentDirectoryResponse,
  GetSeparatorRequest,
  GetSeparatorResponse,
  JoinPathRequest,
  JoinPathResponse,
  ListItemsRequest,
  ListItemsResponnse,
  MessageKey,
  OpenFileRequest,
  OpenFileResponse,
  RenameDirectoryRequest,
  RenameDirectoryResponse,
  RenameFileRequest,
  RenameFileResponse,
  Request,
  errorResponse,
  response,
} from '@src/common/messages';
import { getColorTheme } from '@src/theme';
import * as nodePath from 'path';
import * as vscode from 'vscode';
import {
  copyDirectory,
  copyFile,
  createDirectory,
  createFile,
  deleteDirectory,
  deleteFile,
  getBaseName,
  getCurrentDirectory,
  getItemStat,
  getItems,
  getParentDirectory,
  getSeparator,
  openFile,
  renameDirectory,
  renameFile,
} from './helpers';

// const showMessage = (msg: string) => {
//   console.log(msg);
//   vscode.window.showInformationMessage(msg);
// };

export const startListen = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
): vscode.Disposable => {
  const active = vscode.window.activeTextEditor;
  const currentDirectory = getCurrentDirectory();
  return panel.webview.onDidReceiveMessage(
    async (message: Request<MessageKey>) => {
      try {
        switch (message.key) {
          case 'list-items': {
            const req = message as ListItemsRequest;
            const searchPath = req.path ?? `${currentDirectory}${nodePath.sep}`;
            const itemStat = await getItemStat(searchPath);
            const itemList = await getItems(searchPath);
            panel.webview.postMessage(
              response<ListItemsResponnse>(req, {
                parent: {
                  name: nodePath.basename(searchPath),
                  path: searchPath,
                  itemType: itemStat.type,
                  size: itemStat.size,
                  lastUpdated: itemStat.lastUpdated,
                },
                items: itemList,
              }),
            );
            return;
          }
          case 'get-parent-directory': {
            const req = message as GetParentDirectoryRequest;
            panel.webview.postMessage(
              response<GetParentDirectoryResponse>(req, {
                path: getParentDirectory(req.path),
              }),
            );
            return;
          }
          case 'get-base-name': {
            const req = message as GetBaseNameRequest;
            panel.webview.postMessage(
              response<GetBaseNameResponse>(req, {
                name: getBaseName(req.path),
              }),
            );
            return;
          }
          case 'get-separator': {
            const req = message as GetSeparatorRequest;
            panel.webview.postMessage(
              response<GetSeparatorResponse>(req, {
                separator: getSeparator(),
              }),
            );
            return;
          }
          case 'join-path': {
            const req = message as JoinPathRequest;
            const path = nodePath.join(...req.items);
            panel.webview.postMessage(
              response<JoinPathResponse>(req, {
                path,
              }),
            );
            return;
          }
          case 'open-file': {
            const req = message as OpenFileRequest;
            await openFile(req.path);
            panel.webview.postMessage(response<OpenFileResponse>(req, {}));
            return;
          }
          case 'create-file': {
            const req = message as CreateFileRequest;
            await createFile(req.path);
            panel.webview.postMessage(response<CreateFileResponse>(req, {}));
            //showMessage(`File created: ${req.path}`);
            return;
          }
          case 'create-directory': {
            const req = message as CreateDirectoryRequest;
            await createDirectory(req.path);
            panel.webview.postMessage(
              response<CreateDirectoryResponse>(req, {}),
            );
            //showMessage(`Directory created: ${req.path}`);
            return;
          }
          case 'copy-file': {
            const req = message as CopyFileRequest;
            await copyFile(req.source, req.destination, req.options);
            panel.webview.postMessage(response<CopyFileResponse>(req, {}));
            //showMessage(`Copy file: ${req.source} -> ${req.destination}`);
            return;
          }
          case 'copy-directory': {
            const req = message as CopyDirectoryRequest;
            await copyDirectory(req.source, req.destination, req.options);
            panel.webview.postMessage(response<CopyDirectoryResponse>(req, {}));
            //showMessage(`Copy directory: ${req.source} -> ${req.destination}`);
            return;
          }
          case 'rename-file': {
            const req = message as RenameFileRequest;
            await renameFile(req.source, req.destination, req.options);
            panel.webview.postMessage(response<RenameFileResponse>(req, {}));
            //showMessage(`Rename file: ${req.source} -> ${req.destination}`);
            return;
          }
          case 'rename-directory': {
            const req = message as RenameDirectoryRequest;
            await renameDirectory(req.source, req.destination, req.options);
            panel.webview.postMessage(
              response<RenameDirectoryResponse>(req, {}),
            );
            // showMessage(
            //   `Rename directory: ${req.source} -> ${req.destination}`,
            // );
            return;
          }
          case 'delete-file': {
            const req = message as DeleteFileRequest;
            const { path, items } = await deleteFile(req.path);
            const stat = await getItemStat(path);
            panel.webview.postMessage(
              response<DeleteFileResponse>(req, {
                parent: {
                  name: nodePath.basename(path),
                  path,
                  itemType: stat.type,
                  size: stat.size,
                  lastUpdated: stat.lastUpdated,
                },
                items,
              }),
            );
            //showMessage(`Delete file: ${req.path}`);
            return;
          }
          case 'delete-directory': {
            const req = message as DeleteDirectoryRequest;
            const { path, items } = await deleteDirectory(req.path);
            const stat = await getItemStat(path);
            panel.webview.postMessage(
              response<DeleteDirectoryResponse>(req, {
                parent: {
                  name: nodePath.basename(path),
                  path,
                  itemType: stat.type,
                  size: stat.size,
                  lastUpdated: stat.lastUpdated,
                },
                items,
              }),
            );
            //showMessage(`Delete Directory: ${req.path}`);
            return;
          }
          case 'close-panel': {
            panel.dispose();
            if (active) {
              vscode.window.showTextDocument(
                active.document,
                active.viewColumn,
              );
            }
            return;
          }
          case 'get-color-theme': {
            const req = message as GetColorThemeRequest;
            panel.webview.postMessage(
              response<GetColorThemeResponse>(req, {
                colorTheme: getColorTheme(),
              }),
            );
            return;
          }
          case 'get-locale': {
            const req = message as GetLocaleRequest;
            panel.webview.postMessage(
              response<GetLocaleResponse>(req, {
                locale: vscode.env.language,
              }),
            );
            return;
          }
        }
      } catch (e: unknown) {
        console.error(e);
        //vscode.window.showErrorMessage(`${e}`);
        panel.webview.postMessage(
          errorResponse(message as Request<MessageKey>, e),
        );
      }
    },
    undefined,
    context.subscriptions,
  );
};
