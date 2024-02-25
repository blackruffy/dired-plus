import { check } from '@src/common/check';
import {
  ItemType,
  ListItemsRequest,
  ListItemsResponnse,
  MessageKey,
  Request,
} from '@src/common/messages';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

type State = {
  currentDir?: string;
};
const state: State = {};

const getCurrentDirectory = (): string => {
  const active = vscode.window.activeTextEditor;
  if (active !== undefined) {
    return path.dirname(active.document.fileName);
  } else {
    const dirs = vscode.workspace.workspaceFolders;
    if (dirs !== undefined && dirs.length > 0) {
      return dirs[0].uri.fsPath;
    } else {
      return os.homedir();
    }
  }
};

const getItemType = (dir: string): ItemType =>
  fs.statSync(dir).isDirectory() ? 'directory' : 'file';

const getItems = (
  item: string,
): ReadonlyArray<Readonly<{ name: string; type: ItemType }>> => {
  const type = getItemType(item);
  const [dir, prefix] =
    type === 'directory'
      ? [item, null]
      : [path.dirname(item), path.basename(item)];
  return fs.readdirSync(dir).flatMap(fname => {
    if (prefix === null || fname.startsWith(prefix)) {
      const fpath = path.join(dir, fname);
      const ftype = getItemType(fpath);
      return [{ name: fname, type: ftype }];
    } else {
      return [];
    }
  });
};

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
    (message: Request<MessageKey>) => {
      switch (message.key) {
        case 'list-items': {
          const req = message as ListItemsRequest;
          const searchPath = req.path ?? currentDir;
          const itemList = getItems(searchPath);
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
