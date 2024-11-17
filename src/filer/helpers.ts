import { DiredItem, DiredItemStat } from '@src/common/dired-item';
import { FileOptions } from '@src/common/file-options';
import * as loop from '@src/common/loop';
import {
  ListItemsRequest,
  ListItemsResponnse,
  response,
} from '@src/common/messages';
import { scope } from '@src/common/scope';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as os from 'os';
import * as nodePath from 'path';
import { v4 as uuidv4 } from 'uuid';
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

export const getSeparator = (): string => nodePath.sep;

export const getItemStat = async (path: string): Promise<DiredItemStat> => {
  try {
    const stat = await fs.promises.stat(path);
    return {
      type: stat.isDirectory() ? 'directory' : 'file',
      size: stat.size,
      lastUpdated: stat.mtime.getTime(),
    };
  } catch (e: unknown) {
    if ((e as { code: string }).code === 'ENOENT') {
      return { type: 'none' };
    } else {
      return Promise.reject(e);
    }
  }
};

export const getItems = async (
  item: string,
): Promise<ReadonlyArray<DiredItem>> => {
  const stat = await getItemStat(item);
  const isSep = item.endsWith(nodePath.sep);
  const isDir = stat.type === 'directory';
  if (!isDir && isSep) {
    return [];
  } else {
    const isDirSep = isDir && isSep;
    const [dir, prefix] = isDirSep
      ? [item, null]
      : [nodePath.dirname(item), nodePath.basename(item)];
    const defaultItems: ReadonlyArray<DiredItem> = isDirSep
      ? [
          {
            name: '.',
            path: nodePath.join(dir, nodePath.sep),
            itemType: 'directory',
          },
          {
            name: '..',
            path: nodePath.join(getParentDirectory(dir), nodePath.sep),
            itemType: 'directory',
          },
        ]
      : [];

    const match = scope(() => {
      if (prefix === null) {
        return (_fname: string) => true;
      } else {
        const lprefix = prefix.toLocaleLowerCase();
        //return (fname: string) => fname.toLocaleLowerCase().startsWith(lprefix);
        const xs = lprefix.split(' ');
        if (xs.length === 1) {
          return (fname: string) =>
            fname.toLocaleLowerCase().startsWith(lprefix);
        } else {
          return (fname: string) =>
            xs.every(x => x === '' || fname.toLocaleLowerCase().includes(x));
        }
      }
    });

    //const rawItems = (await fs.promises.readdir(dir)).slice(0, 1000);
    const rawItems = await fs.promises.readdir(dir);
    return rawItems.reduce(async (fitems, fname) => {
      const items = await fitems;
      if (match(fname)) {
        const fpath = nodePath.join(dir, fname);
        const fstat = await getItemStat(fpath);
        return [
          ...items,
          {
            name: fname,
            path: fpath,
            itemType: fstat.type,
            size: fstat.size,
            lastUpdated: fstat.lastUpdated,
          },
        ];
      } else {
        return items;
      }
    }, Promise.resolve<ReadonlyArray<DiredItem>>(defaultItems));
  }
};

type ItemsIter = Readonly<{
  hasNext: () => boolean;
  next: () => Promise<ReadonlyArray<DiredItem>>;
}>;

export const getItemsIter = async (item: string): Promise<ItemsIter> => {
  const stat = await getItemStat(item);
  const isSep = item.endsWith(nodePath.sep);
  const isDir = stat.type === 'directory';
  if (!isDir && isSep) {
    return {
      hasNext: () => false,
      next: async () => [],
    };
  } else {
    const maxSize = 1000;
    const state = { index: 0 };
    const isDirSep = isDir && isSep;
    const [dir, prefix] = isDirSep
      ? [item, null]
      : [nodePath.dirname(item), nodePath.basename(item)];
    const getDefaultItems = (): Array<DiredItem> =>
      isDirSep && state.index === 0
        ? [
            {
              name: '.',
              path: nodePath.join(dir, nodePath.sep),
              itemType: 'directory',
            },
            {
              name: '..',
              path: nodePath.join(getParentDirectory(dir), nodePath.sep),
              itemType: 'directory',
            },
          ]
        : [];

    const match = scope(() => {
      if (prefix === null) {
        return (_fname: string) => true;
      } else {
        const lprefix = prefix.toLocaleLowerCase();
        //return (fname: string) => fname.toLocaleLowerCase().startsWith(lprefix);
        const xs = lprefix.split(' ');
        if (xs.length === 1) {
          return (fname: string) =>
            fname.toLocaleLowerCase().startsWith(lprefix);
        } else {
          return (fname: string) =>
            xs.every(x => x === '' || fname.toLocaleLowerCase().includes(x));
        }
      }
    });

    const filter = async (
      rawItems: ReadonlyArray<string>,
      index: number,
      items: Array<DiredItem>,
    ): Promise<[ReadonlyArray<DiredItem>, number]> => {
      return loop.async<[Array<DiredItem>, number]>(
        async ([items, index]) => {
          if (items.length >= maxSize || index >= rawItems.length) {
            return loop.done([items, index]);
          } else {
            const fname = rawItems[index];
            if (match(fname)) {
              const fpath = nodePath.join(dir, fname);
              const fstat = await getItemStat(fpath);
              items.push({
                name: fname,
                path: fpath,
                itemType: fstat.type,
                size: fstat.size,
                lastUpdated: fstat.lastUpdated,
              });
            }
            return loop.next([items, index + 1]);
          }
        },
        Promise.resolve([items, index]),
      );
    };

    const rawItems = await fs.promises.readdir(dir);

    const hasNext = (): boolean => state.index < rawItems.length;

    const next = async (): Promise<ReadonlyArray<DiredItem>> => {
      const [items, index] = await filter(
        rawItems,
        state.index,
        getDefaultItems(),
      );
      state.index = index;
      return items;
    };

    return { hasNext, next };
  }
};

export const listItemsHandler = scope(() => {
  type Sessions = Record<string, Session>;
  type Session = Readonly<{
    itemsIter: ItemsIter;
    parent: DiredItem;
  }>;
  const sessions: Sessions = {};

  return async (
    panel: vscode.WebviewPanel,
    currentDirectory: string,
    req: ListItemsRequest,
  ): Promise<void> => {
    if (req.nextToken != null) {
      const session = sessions[req.nextToken];
      const items = await session.itemsIter.next();
      panel.webview.postMessage(
        response<ListItemsResponnse>(req, {
          parent: session.parent,
          items,
          nextToken: session.itemsIter.hasNext() ? req.nextToken : undefined,
        }),
      );
    } else {
      const searchPath = req.path ?? `${currentDirectory}${nodePath.sep}`;
      const itemStat = await getItemStat(searchPath);
      const itemsIter = await getItemsIter(searchPath);
      const items = await itemsIter.next();
      const parent: DiredItem = {
        name: nodePath.basename(searchPath),
        path: searchPath,
        itemType: itemStat.type,
        size: itemStat.size,
        lastUpdated: itemStat.lastUpdated,
      };
      const sessionId = uuidv4();
      const session: Session = {
        itemsIter,
        parent,
      };
      sessions[sessionId] = session;
      panel.webview.postMessage(
        response<ListItemsResponnse>(req, {
          parent,
          items,
          nextToken: itemsIter.hasNext() ? sessionId : undefined,
        }),
      );
    }
  };
});

export const fileExists = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (e: unknown) {
    if ((e as { code: string }).code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
};

export const openFile = async (path: string): Promise<void> => {
  const fileUri = vscode.Uri.file(path);
  const doc = await vscode.workspace.openTextDocument(fileUri);
  await vscode.window.showTextDocument(doc);
};

export const createFile = async (path: string): Promise<void> => {
  if (await fileExists(path)) {
    return Promise.reject(new Error(`File already exists: ${path}`));
  } else {
    await fs.promises.writeFile(path, '');
    await openFile(path);
  }
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
): Promise<Readonly<{ path: string; items: ReadonlyArray<DiredItem> }>> => {
  await fs.promises.rm(path);
  const parent = nodePath.dirname(path);
  return {
    path: parent,
    items: await getItems(parent),
  };
};

export const deleteDirectory = async (
  path: string,
): Promise<Readonly<{ path: string; items: ReadonlyArray<DiredItem> }>> => {
  await fs.promises.rm(path, { recursive: true, force: true });
  const parent = nodePath.dirname(path);
  return {
    path: parent,
    items: await getItems(parent),
  };
};
