import { ItemList } from '@common/item';
import { defaultKeys, keyY } from '@src/action/keys';
import { IntlError } from '@src/i18n/error';
import { messageId } from '@src/i18n/ja';
import {
  Action,
  ActionKey,
  ModifierKeys,
  SelectedView,
  State,
  useStore,
} from '@src/store';
import { identity } from 'fp-ts/lib/function';
import React from 'react';

const keyInterval = 30;

const onArrowUp = (
  event: KeyboardEvent,
  itemList: ItemList | undefined,
  selectedView: SelectedView,
  setSelectedView: (selectedView: SelectedView) => void,
  setSearchWord: (searchWord: string) => void,
): void => {
  event.preventDefault();
  event.stopPropagation();
  const nitems = itemList === undefined ? 0 : itemList.items.length;

  if (Date.now() - selectedView.updatedAt > keyInterval) {
    const nextSelectedView =
      selectedView.name === 'list-item' && selectedView.index > 0
        ? identity<SelectedView>({
            name: 'list-item',
            index: selectedView.index - 1,
            updatedAt: Date.now(),
          })
        : selectedView.name === 'list-item'
          ? identity<SelectedView>({
              name: 'search-box',
              updatedAt: Date.now(),
            })
          : identity<SelectedView>({
              name: 'list-item',
              index: nitems - 1,
              updatedAt: Date.now(),
            });

    setSelectedView(nextSelectedView);

    if (nextSelectedView.name === 'list-item') {
      const nextSearchWord = itemList?.items[nextSelectedView.index].path;
      if (nextSearchWord != null) {
        setSearchWord(nextSearchWord);
      }
    }
  }
};

const onArrowDown = (
  event: KeyboardEvent,
  itemList: ItemList | undefined,
  selectedView: SelectedView,
  setSelectedView: (selectedView: SelectedView) => void,
  setSearchWord: (searchWord: string) => void,
): void => {
  event.preventDefault();
  event.stopPropagation();
  const nitems = itemList === undefined ? 0 : itemList.items.length;

  if (Date.now() - selectedView.updatedAt > keyInterval) {
    const nextSelectedView =
      selectedView.name === 'list-item' && selectedView.index < nitems - 1
        ? identity<SelectedView>({
            name: 'list-item',
            index: selectedView.index + 1,
            updatedAt: Date.now(),
          })
        : selectedView.name === 'list-item'
          ? identity<SelectedView>({
              name: 'search-box',
              updatedAt: Date.now(),
            })
          : identity<SelectedView>({
              name: 'list-item',
              index: 0,
              updatedAt: Date.now(),
            });
    setSelectedView(nextSelectedView);

    if (nextSelectedView.name === 'list-item') {
      const nextSearchWord = itemList?.items[nextSelectedView.index].path;
      if (nextSearchWord != null) {
        setSearchWord(nextSearchWord);
      }
    }
  }
};

const moveItems = (
  event: KeyboardEvent,
  { selectedView, itemList, setSelectedView, setSearchWord }: State,
): void => {
  switch (event.code) {
    case 'ArrowUp':
      return onArrowUp(
        event,
        itemList,
        selectedView,
        setSelectedView,
        setSearchWord,
      );
    case 'ArrowDown':
      return onArrowDown(
        event,
        itemList,
        selectedView,
        setSelectedView,
        setSearchWord,
      );
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

const getMatchedActionKey = ({
  actionKeys,
  modifierKeys,
  keyCode,
}: Readonly<{
  actionKeys?: ReadonlyArray<ActionKey>;
  modifierKeys: ModifierKeys;
  keyCode: string;
}>): ActionKey | undefined =>
  actionKeys?.find(
    _ =>
      Object.entries(_.modifierKeys).every(
        ([k, v]) => modifierKeys[k as keyof ModifierKeys] === v,
      ) && _.code === keyCode,
  );

const runAction = ({
  event,
  actionKeys,
  modifierKeys,
  state,
}: Readonly<{
  event: KeyboardEvent;
  actionKeys?: ReadonlyArray<ActionKey>;
  modifierKeys: ModifierKeys;
  state: State;
}>): void => {
  const actionKey = getMatchedActionKey({
    actionKeys,
    modifierKeys,
    keyCode: event.code,
  });

  console.log(
    `Key down: ${event.code}, ${JSON.stringify(modifierKeys)}, actionKey: ${actionKey?.desc}`,
  );

  if (actionKey === undefined) {
    return;
  } else {
    event.preventDefault();
    event.stopPropagation();
    actionKey
      .run()
      .then(_ => {
        state.setState(
          _.dialog !== undefined
            ? {
                ..._,
                dialog: {
                  ..._.dialog,
                  keys: [..._.dialog.keys, ...defaultKeys],
                },
              }
            : _,
        );
      })
      .catch(err => {
        console.error(err);
        state.setDialog({
          type: 'error',
          title: err instanceof IntlError ? err.formattedMessage : String(err),
          lines: [],
          keys: [
            keyY({
              desc: { id: messageId.dismiss },
              run: async () => ({
                dialog: undefined,
              }),
            }),
          ],
        });
      });
  }
};

export const useKeyDownEvent = ({ action }: Readonly<{ action?: Action }>) => {
  const state = useStore();
  const { modifierKeys, setModifierKeys } = state;

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (modifierKeys.metaKey && event.code === 'KeyX') {
        updateModifierUp('MetaLeft', state);
        updateModifierUp('MetaRight', state);
      } else if (state.dialog !== undefined) {
        runAction({
          event,
          actionKeys: state.dialog.keys,
          modifierKeys,
          state,
        });
      } else if (action !== undefined) {
        runAction({
          event,
          actionKeys: action.keys,
          modifierKeys,
          state,
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

export const useKeyboardEvent = (params: Readonly<{ action?: Action }>) => {
  useKeyDownEvent(params);
  useKeyUpEvent();
};
