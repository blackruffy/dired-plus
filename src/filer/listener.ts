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
  GetSeparatorRequest,
  GetSeparatorResponse,
  JoinPathRequest,
  JoinPathResponse,
  ListItemsRequest,
  ListItemsResponse,
  MessageKey,
  RenameDirectoryRequest,
  RenameDirectoryResponse,
  RenameFileRequest,
  RenameFileResponse,
  Request,
  ShowFolderRequest,
  ShowFolderResponse,
  errorResponse,
  response,
} from '@src/common/messages';
import { defaultHandlers } from '@src/helpers/listener';
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
  getParentDirectory,
  getSeparator,
  listItemsHandler,
  renameDirectory,
  renameFile,
} from './helpers';

export const startListen = ({
  context,
  panel,
}: Readonly<{
  context: vscode.ExtensionContext;
  panel: vscode.WebviewPanel;
}>): vscode.Disposable => {
  const currentDirectory = getCurrentDirectory();
  return panel.webview.onDidReceiveMessage(
    async (message: Request<MessageKey>) => {
      try {
        if (!(await defaultHandlers({ context, panel, message }))) {
          switch (message.key) {
            case 'list-items': {
              const req = message as ListItemsRequest;
              await listItemsHandler({
                panel,
                currentDirectory,
                path: req.path,
                nextToken: req.nextToken,
                onResponse: (itemList, nextToken) =>
                  response<ListItemsResponse>(req, {
                    ...itemList,
                    nextToken,
                  }),
              });
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
              panel.webview.postMessage(
                response<CopyDirectoryResponse>(req, {}),
              );
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
              // await deleteFileHandler({
              //   panel,
              //   req,
              // });
              const { path } = await deleteFile(req.path);
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
                  //items,
                }),
              );
              //showMessage(`Delete file: ${req.path}`);
              return;
            }
            case 'delete-directory': {
              const req = message as DeleteDirectoryRequest;
              // await deleteDirectoryHandler({
              //   panel,
              //   req,
              // });
              const { path } = await deleteDirectory(req.path);
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
                  // items,
                }),
              );
              //showMessage(`Delete Directory: ${req.path}`);
              return;
            }
            case 'show-folder': {
              const req = message as ShowFolderRequest;
              vscode.workspace.updateWorkspaceFolders(
                vscode.workspace.workspaceFolders
                  ? vscode.workspace.workspaceFolders.length
                  : 0,
                null,
                { uri: vscode.Uri.file(req.path) },
              );
              panel.webview.postMessage(response<ShowFolderResponse>(req, {}));
              return;
            }
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
