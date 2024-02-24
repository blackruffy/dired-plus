import { check } from '@src/common/check';
import { ListItemsResponnse, MessageKey, Request } from '@src/common/messages';
import * as vscode from 'vscode';

export const open = (context: vscode.ExtensionContext) => {
  // The code you place here will be executed every time your command is executed

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
        case 'list-items':
          panel.webview.postMessage(
            check<ListItemsResponnse>({
              key: 'list-items',
              id: message.id,
              type: 'response',
              path: '/',
              items: [
                { name: 'file1', type: 'file' },
                { name: 'file2', type: 'file' },
                { name: 'file3', type: 'file' },
                { name: 'directory1', type: 'directory' },
                { name: 'directory2', type: 'directory' },
                { name: 'directory3', type: 'directory' },
              ],
            }),
          );
          return;
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
