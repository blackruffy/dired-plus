import {
  CreateDirectoryRequest,
  CreateDirectoryResponse,
  CreateFileRequest,
  CreateFileResponse,
  DeleteDirectoryRequest,
  DeleteDirectoryResponse,
  DeleteFileRequest,
  DeleteFileResponse,
  ListItemsRequest,
  ListItemsResponnse,
  MessageKey,
  OpenFileRequest,
  OpenFileResponse,
  Request,
  errorResponse,
  response,
} from '@src/common/messages';
import * as vscode from 'vscode';
import {
  createDirectory,
  createFile,
  deleteDirectory,
  deleteFile,
  getCurrentDirectory,
  getItemType,
  getItems,
  openFile,
} from './helpers';

const showMessage = (msg: string) => {
  console.log(msg);
  vscode.window.showInformationMessage(msg);
};

export const startListen = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
): vscode.Disposable => {
  const currentDirectory = getCurrentDirectory();
  return panel.webview.onDidReceiveMessage(
    async (message: Request<MessageKey>) => {
      try {
        switch (message.key) {
          case 'list-items': {
            const req = message as ListItemsRequest;
            const searchPath = req.path ?? currentDirectory;
            const itemType = await getItemType(searchPath);
            const itemList = await getItems(searchPath);
            panel.webview.postMessage(
              response<ListItemsResponnse>(req, {
                path: searchPath,
                itemType: itemType,
                items: itemList,
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
            showMessage(`File created: ${req.path}`);
            return;
          }
          case 'create-directory': {
            const req = message as CreateDirectoryRequest;
            await createDirectory(req.path);
            panel.webview.postMessage(
              response<CreateDirectoryResponse>(req, {}),
            );
            showMessage(`Directory created: ${req.path}`);
            return;
          }
          case 'delete-file': {
            const req = message as DeleteFileRequest;
            await deleteFile(req.path);
            panel.webview.postMessage(response<DeleteFileResponse>(req, {}));
            showMessage(`Delete file: ${req.path}`);
            return;
          }
          case 'delete-directory': {
            const req = message as DeleteDirectoryRequest;
            await deleteDirectory(req.path);
            panel.webview.postMessage(
              response<DeleteDirectoryResponse>(req, {}),
            );
            showMessage(`Delete Directory: ${req.path}`);
            return;
          }
        }
      } catch (e: unknown) {
        console.error(e);
        vscode.window.showErrorMessage(`${e}`);
        panel.webview.postMessage(
          errorResponse(message as Request<MessageKey>, e),
        );
      }
    },
    undefined,
    context.subscriptions,
  );
};
