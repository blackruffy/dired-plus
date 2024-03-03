import { Item, ItemType } from '@src/common/messages';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

export const getCurrentDirectory = (): string => {
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

export const getItemType = async (dir: string): Promise<ItemType> => {
  try {
    return (await fs.promises.stat(dir)).isDirectory() ? 'directory' : 'file';
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
      : [path.dirname(item), path.basename(item)];
  return (await fs.promises.readdir(dir)).reduce(async (fitems, fname) => {
    const items = await fitems;
    if (prefix === null || fname.startsWith(prefix)) {
      const fpath = path.join(dir, fname);
      const ftype = await getItemType(fpath);
      return [...items, { name: fname, path: fpath, type: ftype }];
    } else {
      return items;
    }
  }, Promise.resolve<ReadonlyArray<Item>>([]));
};
