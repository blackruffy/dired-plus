import { core } from '@core/index';
import { MessageId } from '@history/i18n/ja';
import { identity } from 'fp-ts/lib/function';
import { create } from 'zustand';

export interface State extends core.store.State<State, MessageId, ItemList> {
  history?: ItemList;
  setHistory: (history: ItemList) => void;
}

export type Item = string;
export type ItemList = Readonly<{
  items: ReadonlyArray<Item>;
}>;

export const useStore = create<State>(set => ({
  ...core.store.createStore<State, MessageId, ItemList>(set, identity),
  setHistory: history => set(() => ({ history })),
}));