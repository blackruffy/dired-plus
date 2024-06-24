import {
  Action,
  ModifierKeys,
  SelectedView,
  State,
  useStore,
} from '@src/store';
import React from 'react';

const keyInterval = 30;

const onArrowUp = (
  event: KeyboardEvent,
  nitems: number,
  selectedView: SelectedView,
  setSelectedView: (selectedView: SelectedView) => void,
): void => {
  event.preventDefault();
  event.stopPropagation();
  if (Date.now() - selectedView.updatedAt > keyInterval) {
    setSelectedView(
      selectedView.name === 'list-item' && selectedView.index > 0
        ? {
            name: 'list-item',
            index: selectedView.index - 1,
            updatedAt: Date.now(),
          }
        : selectedView.name === 'list-item'
          ? {
              name: 'search-box',
              updatedAt: Date.now(),
            }
          : { name: 'list-item', index: nitems - 1, updatedAt: Date.now() },
    );
  }
};

const onArrowDown = (
  event: KeyboardEvent,
  nitems: number,
  selectedView: SelectedView,
  setSelectedView: (selectedView: SelectedView) => void,
): void => {
  event.preventDefault();
  event.stopPropagation();

  if (Date.now() - selectedView.updatedAt > keyInterval) {
    setSelectedView(
      selectedView.name === 'list-item' && selectedView.index < nitems - 1
        ? {
            name: 'list-item',
            index: selectedView.index + 1,
            updatedAt: Date.now(),
          }
        : selectedView.name === 'list-item'
          ? {
              name: 'search-box',
              updatedAt: Date.now(),
            }
          : {
              name: 'list-item',
              index: 0,
              updatedAt: Date.now(),
            },
    );
  }
};

const moveItems = (
  event: KeyboardEvent,
  { selectedView, itemList, setSelectedView }: State,
): void => {
  const nitems = itemList === undefined ? 0 : itemList.items.length;
  switch (event.code) {
    case 'ArrowUp':
      return onArrowUp(event, nitems, selectedView, setSelectedView);
    case 'ArrowDown':
      return onArrowDown(event, nitems, selectedView, setSelectedView);
    default:
      return;
  }
};

const updateModifierDown = (code: string, { setModifierKeys }: State) => {
  switch (code) {
    case 'ShiftLeft':
    case 'ShiftRight':
      return setModifierKeys({ shiftKey: true });
    case 'ControlLeft':
    case 'ControlRight':
      return setModifierKeys({ controlKey: true });
    case 'AltLeft':
    case 'AltRight':
      return setModifierKeys({ altKey: true });
    case 'MetaLeft':
    case 'MetaRight':
      return setModifierKeys({ metaKey: true });
    default:
      return;
  }
};

const updateModifierUp = (code: string, { setModifierKeys }: State) => {
  switch (code) {
    case 'ShiftLeft':
    case 'ShiftRight':
      return setModifierKeys({ shiftKey: false });
    case 'ControlLeft':
    case 'ControlRight':
      return setModifierKeys({ controlKey: false });
    case 'AltLeft':
    case 'AltRight':
      return setModifierKeys({ altKey: false });
    case 'MetaLeft':
    case 'MetaRight':
      return setModifierKeys({ metaKey: false });
  }
};

export const useKeyDownEvent = (action?: Action) => {
  const state = useStore();
  const { modifierKeys, setModifierKeys } = state;

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      const actionKey = action?.keys?.find(
        _ =>
          Object.entries(_.modifierKeys).every(
            ([k, v]) => modifierKeys[k as keyof ModifierKeys] === v,
          ) && _.code === event.code,
      );

      console.log(
        `Key down: ${event.code}, ${JSON.stringify(modifierKeys)}, actionKey: ${actionKey?.desc}`,
      );

      if (modifierKeys.metaKey && event.code === 'KeyX') {
        updateModifierUp('MetaLeft', state);
        updateModifierUp('MetaRight', state);
      } else if (actionKey !== undefined) {
        event.preventDefault();
        event.stopPropagation();
        actionKey.run().catch(err => {
          state.setMode({
            message: String(err),
            type: 'error',
          });
        });
      }

      moveItems(event, state);
      updateModifierDown(event.code, state);
    };

    window.addEventListener('keydown', callback);
    return () => {
      window.removeEventListener('keydown', callback);
    };
  }, [modifierKeys, setModifierKeys, action, state]);
};

export const useKeyUpEvent = () => {
  const state = useStore();

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      updateModifierUp(event.code, state);
    };

    window.addEventListener('keyup', callback);
    return () => {
      window.removeEventListener('keyup', callback);
    };
  }, [state]);
};

export const useKeyboardEvent = (action?: Action) => {
  useKeyDownEvent(action);
  useKeyUpEvent();
};
