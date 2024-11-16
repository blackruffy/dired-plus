import { getItemsIter } from '@src/filer/helpers';
import * as fs from 'fs';

export const getItemsSpec = async () => {
  const dir = `/Users/tkubo/Private/TypeScript/tests/cases/compiler/`;
  const rawItems = await fs.promises.readdir(dir);
  const iter = await getItemsIter(dir);

  let count = 0;
  for (let i = 0; i < 10; i++) {
    const items = await iter.next();
    console.log(items.length);
    count += items.length;
  }

  console.log(rawItems.length, count);
};
