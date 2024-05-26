import { readonlyArray } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

export type ItemType = 'file' | 'directory' | 'none';
export type Item = Readonly<{
  name: string;
  path: string;
  itemType: ItemType;
}>;
export type ItemList = Readonly<{
  path: string;
  itemType: ItemType;
  items: ReadonlyArray<Item>;
}>;

export const isSingleFile = (items: ReadonlyArray<Item>): boolean =>
  items.length === 1 && isFile(items[0]);

export const isSingleDirectory = (items: ReadonlyArray<Item>): boolean =>
  items.length === 1 && isDirectory(items[0]);

export const isMultipleItems = (items: ReadonlyArray<Item>): boolean =>
  items.length > 1;

export const isFile = (item: Item): boolean => item.itemType === 'file';

export const isDirectory = (item: Item): boolean =>
  item.itemType === 'directory';

export const isDot = (item: Item): boolean =>
  isDirectory(item) && item.name === '.';

export const joinItemPath =
  (separator: string) =>
  (xs: ReadonlyArray<Item>): string =>
    pipe(
      xs,
      readonlyArray.reduce('', (a, s) =>
        a === '' ? s.path : `${a}${separator}${s.path}`,
      ),
    );
