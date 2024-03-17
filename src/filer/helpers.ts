import { Item, ItemType } from '@src/common/messages';
import * as fs from 'fs';
import * as os from 'os';
import * as nodePath from 'path';
import * as vscode from 'vscode';

export const getCurrentDirectory = (): string => {
  const active = vscode.window.activeTextEditor;
  if (active !== undefined) {
    return nodePath.dirname(active.document.fileName);
  } else {
    const dirs = vscode.workspace.workspaceFolders;
    if (dirs !== undefined && dirs.length > 0) {
      return dirs[0].uri.fsPath;
    } else {
      return os.homedir();
    }
  }
};

export const getItemType = async (path: string): Promise<ItemType> => {
  try {
    return (await fs.promises.stat(path)).isDirectory() ? 'directory' : 'file';
  } catch (e: unknown) {
    if ((e as { code: string }).code === 'ENOENT') {
      return 'none';
    } else {
      return Promise.reject(e);
    }
  }
};

export const getItems = async (item: string): Promise<ReadonlyArray<Item>> => {
  const type = await getItemType(item);
  const [dir, prefix] =
    type === 'directory'
      ? [item, null]
      : [nodePath.dirname(item), nodePath.basename(item)];
  return (await fs.promises.readdir(dir)).reduce(async (fitems, fname) => {
    const items = await fitems;
    if (prefix === null || fname.startsWith(prefix)) {
      const fpath = nodePath.join(dir, fname);
      const ftype = await getItemType(fpath);
      return [...items, { name: fname, path: fpath, itemType: ftype }];
    } else {
      return items;
    }
  }, Promise.resolve<ReadonlyArray<Item>>([]));
};

export const openFile = async (path: string): Promise<void> => {
  const fileUri = vscode.Uri.file(path);
  const doc = await vscode.workspace.openTextDocument(fileUri);
  await vscode.window.showTextDocument(doc);
};

export const createFile = async (path: string): Promise<void> => {
  await fs.promises.writeFile(path, '');
  await openFile(path);
};

export const createDirectory = async (path: string): Promise<void> => {
  await fs.promises.mkdir(path);
};

export const deleteFile = async (path: string): Promise<void> => {
  await fs.promises.rm(path);
};

export const deleteDirectory = async (path: string): Promise<void> => {
  await fs.promises.rm(path, { recursive: true, force: true });
};
