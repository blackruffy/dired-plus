import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import { core } from '@core/index';
import { IntlMessage } from '@dired/i18n';
import { MessageId } from '@dired/i18n/ja';
import { identity } from 'fp-ts/lib/function';
import { create } from 'zustand';

export interface State extends core.store.State<State, MessageId, ItemList> {
  readonly checked: Readonly<{ [key: number]: boolean }>;
  readonly mode?: Mode;
  readonly setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  readonly setMode: (mode?: Mode) => void;
}

export type StatusType = core.store.StatusType;

export type Status = core.store.Status<MessageId>;

export type SelectedView = core.store.SelectedView;
export type SearchBox = core.store.SearchBox;
export type ListItem = core.store.ListItem;
export type ModifierKeys = core.action.ModifierKeys;
export type ActionKey = core.action.ActionKey<State, MessageId>;

export type Mode = CopyMode | RenameMode;

// export type ConfirmMode = Readonly<{
//   type: 'confirm';
//   action: Action;
// }>;

export type CopyMode = Readonly<{
  type: 'copy';
  source: ReadonlyArray<Item>;
}>;

export type RenameMode = Readonly<{
  type: 'rename';
  source: ReadonlyArray<Item>;
}>;

// export type ErrorMode = Readonly<{
//   type: 'error';
//   message: string;
// }>;

export type Action = core.action.Action<State, MessageId>;

export type Dialog = core.store.Dialog<State, MessageId>;

export type DialogButton = core.store.DialogButton<State, MessageId>;

export const statusState = (
  message: IntlMessage,
  type: StatusType = 'info',
): Partial<State> => ({
  status: {
    message,
    type,
  },
});

export const useStore = create<State>(set => ({
  ...core.store.createStore<State, MessageId, ItemList>(set, identity),
  checked: {},
  setChecked: checked => set(() => ({ checked })),
  setMode: mode => set(() => ({ mode })),
}));
