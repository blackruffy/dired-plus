import { IntlIdBase, IntlMessage } from '@core/i18n';

export type Action<State, IntlId extends IntlIdBase> = Readonly<{
  id: string;
  keys: ReadonlyArray<ActionKey<State, IntlId>>;
}>;

export type ActionWithNullableKeys<
  State,
  IntlId extends IntlIdBase,
> = Readonly<{
  id: string;
  keys: ReadonlyArray<ActionKey<State, IntlId> | null | undefined>;
}>;

export type ModifierKeys = Readonly<{
  shiftKey: boolean;
  controlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}>;

export type ActionKey<State, IntlId extends IntlIdBase> = Readonly<{
  name: string;
  desc: IntlMessage<IntlId>;
  modifierKeys: ModifierKeys;
  code: string;
  run: () => Promise<Partial<State>>;
}>;
