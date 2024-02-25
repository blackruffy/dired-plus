import { scope } from '@common/scope';
import { listItems } from '@src/events/native';
import { useStore } from '@src/store';
import React from 'react';

export const useKeyboardEvent = () => {
  const {
    itemList,
    selectedIndex,
    checked,
    setItemList,
    setSelectedIndex,
    setChecked,
  } = useStore();

  const nitems = itemList === undefined ? 0 : itemList.items.length;

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('############', event.key, event.code);
      switch (event.code) {
        case 'ArrowUp':
          return setSelectedIndex(
            selectedIndex > 0 ? selectedIndex - 1 : nitems - 1,
          );
        case 'ArrowDown':
          return setSelectedIndex(
            selectedIndex < nitems - 1 ? selectedIndex + 1 : 0,
          );
        case 'Space':
          return setChecked({
            ...checked,
            [selectedIndex]:
              checked[selectedIndex] === undefined
                ? true
                : !checked[selectedIndex],
          });
        default:
          return scope(async () =>
            setItemList(
              await listItems(
                itemList?.path === undefined
                  ? event.key
                  : `${itemList.path}${event.key}`,
              ),
            ),
          );
      }
    };

    window.addEventListener('keydown', callback);
    return () => {
      window.removeEventListener('keydown', callback);
    };
  }, [
    nitems,
    selectedIndex,
    checked,
    setSelectedIndex,
    setChecked,
    setItemList,
    itemList?.path,
  ]);
};
