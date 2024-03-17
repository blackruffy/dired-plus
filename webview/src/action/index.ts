import { Action, useStore } from '@src/store';
import { searchBoxHasItemsCopy } from './search-box/has-items.copy';

export const useAction = (): Action | undefined => {
  const { selectedView, itemList, mode, setMode } = useStore();
  if (mode?.type === 'confirm') {
    return mode.action;
  } else if (selectedView.name === 'search-box') {
    if (itemList?.itemType !== 'none' && mode === undefined) {
      return undefined;
    } else if (itemList?.itemType !== 'none' && mode?.type === 'copy') {
      return searchBoxHasItemsCopy(setMode);
    } else if (itemList?.itemType !== 'none' && mode?.type === 'rename') {
      return undefined;
    } else if (itemList?.itemType === 'none' && mode === undefined) {
      return undefined;
    } else if (itemList?.itemType === 'none' && mode?.type === 'copy') {
      return undefined;
    } else if (itemList?.itemType === 'none' && mode?.type === 'rename') {
      return undefined;
    } else {
      return undefined;
    }
  } else if (selectedView.name === 'list-item') {
    const item = itemList?.items[selectedView.index];
    const itemType = item?.itemType;
    if (itemType !== 'none' && mode?.type === undefined) {
      return {
        title: 'Available actions',
        keys: [
          {
            name: 'c',
            desc: 'Copy',
            keyEvent: {
              code: 'KeyC',
              run: () =>
                setMode({
                  type: 'copy',
                  source: item?.path,
                }),
            },
          },
        ],
      };
    } else if (itemType === 'file' && mode?.type === 'copy') {
      return undefined;
    } else if (itemType === 'file' && mode?.type === 'rename') {
      return undefined;
    } else if (itemType === 'directory' && mode?.type === 'copy') {
      return undefined;
    } else if (itemType === 'directory' && mode?.type === 'rename') {
      return undefined;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};
