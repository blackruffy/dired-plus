import { core } from '@core/index';
import { useMessages } from '@history/i18n';
import { MessageId, messageId } from '@history/i18n/ja';
import { defaultKeys } from '@history/keyboard/use-keyboard';
import { State, useStore } from '@history/store';
import { ord, readonlyArray, string } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { openItem } from './helpers';

export type ActionKey = core.action.ActionKey<State, MessageId>;
export type Action = core.action.Action<State, MessageId>;
export type ActionWithNullableKeys = core.action.ActionWithNullableKeys<
  State,
  MessageId
>;

const createAction = ({
  selectedItemIndex,
  itemList,
}: State): ActionWithNullableKeys | undefined => {
  const item =
    selectedItemIndex == null ? null : itemList?.items?.[selectedItemIndex];
  if (item != null) {
    return {
      id: 'item-list-is-item-default',
      keys: [
        core.keyboard.keys.keyEnter({
          desc: { id: messageId.open },
          run: openItem(item),
        }),
      ],
    };
  } else {
    return {
      id: 'item-list-is-no-item-default',
      keys: [],
    };
  }
};

export const useAction = (): Action | undefined => {
  const store = useStore();
  const action = createAction(useStore());
  const messages = useMessages(store.locale);

  return action === undefined
    ? undefined
    : {
        ...action,
        keys: pipe(
          [
            ...(action.keys.filter(_ => _ != null) as readonly ActionKey[]),
            ...defaultKeys,
          ],
          readonlyArray.sort<ActionKey>(
            ord.fromCompare((a, b) =>
              string.Ord.compare(messages[a.desc.id], messages[b.desc.id]),
            ),
          ),
        ),
      };
};
