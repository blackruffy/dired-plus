import { check } from '@src/common/check';
import {
  ListItemsRequest,
  ListItemsResponnse,
  MessageKey,
  OpenFileRequest,
  OpenFileResponse,
  Request,
} from '@src/common/messages';
import * as vscode from 'vscode';
import { getCurrentDirectory, getItems } from './helpers';

type State = {
  currentDir?: string;
};

const state: State = {};

export const open = (context: vscode.ExtensionContext) => {
  const currentDir = getCurrentDirectory();

  // Create and show a new webview
  const panel = vscode.window.createWebviewPanel(
    'filer', // Identifies the type of the webview. Used internally
    'Filer', // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in.
    {
      enableScripts: true,
      // localResourceRoots: [
      //   vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview'),
      // ],
    }, // Webview options. More on these later.
  );

  panel.webview.onDidReceiveMessage(
    async (message: Request<MessageKey>) => {
      switch (message.key) {
        case 'list-items': {
          const req = message as ListItemsRequest;
          const searchPath = req.path ?? currentDir;
          const itemList = await getItems(searchPath);
          panel.webview.postMessage(
            check<ListItemsResponnse>({
              key: 'list-items',
              id: message.id,
              type: 'response',
              path: searchPath,
              items: itemList,
            }),
          );
          return;
        }
        case 'open-file': {
          const req = message as OpenFileRequest;
          const fileUri = vscode.Uri.file(req.path);
          const doc = await vscode.workspace.openTextDocument(fileUri);
          await vscode.window.showTextDocument(doc);
          panel.webview.postMessage(
            check<OpenFileResponse>({
              key: 'open-file',
              id: message.id,
              type: 'response',
            }),
          );
          return;
        }
      }
    },
    undefined,
    context.subscriptions,
  );

  const scriptPathOnDisk = vscode.Uri.joinPath(
    context.extensionUri,
    'dist',
    'webview',
    'index.js',
  );

  const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

  panel.webview.html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>IncrementalFiler</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body></body>
        <script type="module" src="${scriptUri}"></script>
      </html>
      `;
  // Display a message box to the user
  vscode.window.showInformationMessage('Hello World from incremental-filer!');
};
