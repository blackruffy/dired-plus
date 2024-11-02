import { readonlyArray } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

export type DiredItemType = 'file' | 'directory' | 'none';
export type DiredItemStat = Readonly<{
  type: DiredItemType;
  size?: number;
  lastUpdated?: number; // Epoch time in milliseconds
}>;
export type DiredItem = Readonly<{
  name: string;
  path: string;
  itemType: DiredItemType;
  size?: number; // in bytes
  lastUpdated?: number; // Epoch time in milliseconds
}>;
export type DiredItemList = Readonly<{
  parent: DiredItem;
  items: ReadonlyArray<DiredItem>;
}>;

export const isSingleFile = (items: ReadonlyArray<DiredItem>): boolean =>
  items.length === 1 && isFile(items[0]);

export const isSingleDirectory = (items: ReadonlyArray<DiredItem>): boolean =>
  items.length === 1 && isDirectory(items[0]);

export const isMultipleItems = (items: ReadonlyArray<DiredItem>): boolean =>
  items.length > 1;

export const isFile = (item: DiredItem): boolean => item.itemType === 'file';

export const isDirectory = (item: DiredItem): boolean =>
  item.itemType === 'directory';

export const isDot = (item: DiredItem): boolean =>
  isDirectory(item) && item.name === '.';

export const joinItemPath =
  (separator: string) =>
  (xs: ReadonlyArray<DiredItem>): string =>
    pipe(
      xs,
      readonlyArray.reduce('', (a, s) =>
        a === '' ? s.path : `${a}${separator}${s.path}`,
      ),
    );
