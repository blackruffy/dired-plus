import { Item, ItemList } from '@common/item';
import {
  getCheckedItemsOr,
  goToParentDirectory,
  goToSearchBox,
  openItem,
  sequenceItems,
  updateItemList,
} from '@src/action/helpers';
import {
  keyC,
  keyD,
  keyEnter,
  keyG,
  keyI,
  keyN,
  keyP,
  keyQ,
  keyR,
  keySpace,
  keyY,
} from '@src/action/keys';
import {
  closePanel,
  deleteDirectory,
  deleteFile,
  getParentDirectory,
} from '@src/events/native';
import { Action, Mode, SelectedView, ok } from '@src/store';
import { pipe } from 'fp-ts/lib/function';

export const itemListIsItemDefault = ({
  index,
  item,
  itemList,
  setMode,
  setSearchWord,
  setItemList,
  checked,
  setChecked,
  setSelectedView,
}: Readonly<{
  index: number;
  item: Item;
  itemList?: ItemList;
  setMode: (mode?: Mode) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  checked: Readonly<{ [key: number]: boolean }>;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  setSelectedView: (selectedView: SelectedView) => void;
}>): Action => ({
  id: 'item-list-is-item-default',
  title: 'Available actions',
  keys: [
    keyEnter({
      desc: 'Open',
      run: openItem(item, setSearchWord, setItemList, setSelectedView),
    }),

    keySpace({
      desc: 'Select',
      run: async () => {
        const isDot = item.name === '.' || item.name === '..';
        setChecked({
          ...checked,
          [index]: isDot
            ? false
            : checked[index] === undefined
              ? true
              : !checked[index],
        });
        return ok();
      },
    }),

    keyP(
      goToParentDirectory({
        path: getParentDirectory(item.path),
        setSearchWord,
        setItemList,
      }),
    ),

    keyI(goToSearchBox({ setSelectedView })),

    keyG({
      desc: 'Reload',
      run: async () => {
        await updateItemList({
          path: itemList?.path,
          setSearchWord,
          setItemList,
        });
        return ok();
      },
    }),

    keyQ({
      desc: 'Quit',
      run: async () => {
        await closePanel();
        return ok();
      },
    }),

    keyC({
      desc: 'Copy',
      run: async () =>
        pipe(
          setMode({
            type: 'copy',
            source: getCheckedItemsOr({ checked, itemList, default: item }),
          }),
          () => setChecked({}),
          async () => await goToSearchBox({ setSelectedView }).run(),
          () => ok(),
        ),
    }),

    keyR({
      desc: 'Rename',
      run: async () =>
        pipe(
          setMode({
            type: 'rename',
            source: getCheckedItemsOr({ checked, itemList, default: item }),
          }),
          () => setChecked({}),
          async () => await goToSearchBox({ setSelectedView }).run(),
          () => ok(),
        ),
    }),

    keyD({
      desc: 'Delete',
      run: async () =>
        pipe(
          setMode({
            type: 'confirm',
            action: {
              id: 'confirm-delete',
              title: 'Are you sure you want to delete the file?',
              keys: [
                keyY({
                  desc: 'Delete the file',
                  run: async () =>
                    pipe(
                      await sequenceItems({
                        items: getCheckedItemsOr({
                          checked,
                          itemList,
                          default: item,
                        }),
                        onItem: async item =>
                          item.itemType === 'file'
                            ? await deleteFile(item.path)
                            : item.itemType === 'directory'
                              ? await deleteDirectory(item.path)
                              : null,
                      }),
                      a =>
                        a !== null
                          ? pipe(setSearchWord(a.path), () => setItemList(a))
                          : void 0,
                      () => setChecked({}),
                      () => setMode(),
                      () => ok(`Deleted ${item.path}`),
                    ),
                }),
                keyN({
                  desc: 'Cancel',
                  run: async () => pipe(setMode(), () => ok()),
                }),
              ],
            },
          }),
          () => ok(),
        ),
    }),
  ],
});
