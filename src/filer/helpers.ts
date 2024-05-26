import { FileOptions } from '@src/common/file-options';
import { Item, ItemType } from '@src/common/item';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
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

export const getParentDirectory = (path: string): string =>
  nodePath.dirname(path);

export const getBaseName = (path: string): string => nodePath.basename(path);

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
  return (await fs.promises.readdir(dir)).reduce(
    async (fitems, fname) => {
      const items = await fitems;
      if (prefix === null || fname.startsWith(prefix)) {
        const fpath = nodePath.join(dir, fname);
        const ftype = await getItemType(fpath);
        return [...items, { name: fname, path: fpath, itemType: ftype }];
      } else {
        return items;
      }
    },
    Promise.resolve<ReadonlyArray<Item>>([
      {
        name: '.',
        path: nodePath.join(dir, '.'),
        itemType: 'directory',
      },
      {
        name: '..',
        path: getParentDirectory(dir),
        itemType: 'directory',
      },
    ]),
  );
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

const fileArgs = (
  source: string,
  destination: string,
  options: FileOptions,
): [string, string] => [
  source,
  options.intoDirectory === true
    ? nodePath.join(destination, getBaseName(source))
    : destination,
];

export const copyFile = async (
  source: string,
  destination: string,
  options: FileOptions = {},
): Promise<void> => {
  await fs.promises.copyFile(...fileArgs(source, destination, options));
};

export const copyDirectory = async (
  source: string,
  destination: string,
  options: FileOptions = {},
): Promise<void> => {
  await fsExtra.copy(...fileArgs(source, destination, options));
};

export const renameFile = async (
  source: string,
  destination: string,
  options: FileOptions = {},
): Promise<void> => {
  await fs.promises.rename(...fileArgs(source, destination, options));
};

export const renameDirectory = async (
  source: string,
  destination: string,
  options: FileOptions = {},
): Promise<void> => {
  await fs.promises.rename(...fileArgs(source, destination, options));
};

export const deleteFile = async (
  path: string,
): Promise<Readonly<{ path: string; items: ReadonlyArray<Item> }>> => {
  await fs.promises.rm(path);
  const parent = nodePath.dirname(path);
  return {
    path: parent,
    items: await getItems(parent),
  };
};

export const deleteDirectory = async (
  path: string,
): Promise<Readonly<{ path: string; items: ReadonlyArray<Item> }>> => {
  await fs.promises.rm(path, { recursive: true, force: true });
  const parent = nodePath.dirname(path);
  return {
    path: parent,
    items: await getItems(parent),
  };
};
