import { core } from '@core/index';
import { MessageId, messageId } from '@history/i18n/ja';
import { defaultKeys } from '@history/keyboard/use-keyboard';
import { State, useStore } from '@history/store';
import { array, ord, string } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { openItem } from './helpers';

export type ActionKey = core.action.ActionKey<State, MessageId>;
export type Action = core.action.Action<State, MessageId>;

const createAction = ({
  selectedView,
  itemList,
}: State): Action | undefined => {
  if (selectedView.name === 'search-box') {
    return {
      id: 'search-box-is-default',
      keys: [],
    };
  } else if (selectedView.name === 'list-item') {
    const item = itemList?.items?.[selectedView.index];
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
  }
};

export const useAction = (): Action | undefined => {
  const action = createAction(useStore());

  return action === undefined
    ? undefined
    : {
        ...action,
        keys: pipe(
          [...action.keys, ...defaultKeys],
          array.sort<ActionKey>(
            ord.fromCompare((a, b) => string.Ord.compare(a.name, b.name)),
          ),
        ),
      };
};
