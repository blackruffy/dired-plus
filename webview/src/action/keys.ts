import { closePanel } from '@src/events/native';
import { IntlMessage } from '@src/i18n';
import { messageId } from '@src/i18n/ja';
import { ActionKey, ModifierKeys, State, toModifierKeys } from '@src/store';
import { Task } from 'fp-ts/lib/Task';

export type KeyParams = Readonly<{
  desc: IntlMessage;
  run: Task<Partial<State>>;
}>;

export const key =
  (name: string, code: string, modifierKeys?: Partial<ModifierKeys>) =>
  ({ desc, run }: KeyParams): ActionKey => ({
    name,
    desc,
    code,
    modifierKeys: toModifierKeys(modifierKeys),
    run,
  });

export const keyAlphabet = (
  name: string,
  modifierKeys?: Partial<ModifierKeys>,
) => key(name, `Key${name.toUpperCase()}`, modifierKeys);

export const keyCtrl = (name: string, code: string) =>
  key(`^ + ${name}`, code, { controlKey: true });

export const keyCtrlAlphabet = (name: string) =>
  keyCtrl(name, `Key${name.toUpperCase()}`);

export const keys = {
  escape: key('ESC', 'Escape'),
  enter: key('⏎', 'Enter'),
  space: key('␣', 'Space'),
  backspace: key('BS', 'Backspace'),
  tab: key('TAB', 'Tab'),
  shift: {
    enter: key('⇧ + ↩︎', 'Enter', { shiftKey: true }),
  },
};

export const keyEscape = key('ESC', 'Escape');
export const keyEnter = key('⏎', 'Enter');
export const keyShiftEnter = key('⇧ + ↩︎', 'Enter', { shiftKey: true });
export const keySpace = key('␣', 'Space');
export const keyBackspace = key('BS', 'Backspace');
export const keyTab = key('TAB', 'Tab');
export const keyC = keyAlphabet('c');
export const keyD = keyAlphabet('d');
export const keyF = keyAlphabet('f');
export const keyG = keyAlphabet('g');
export const keyI = keyAlphabet('i');
export const keyN = keyAlphabet('n');
export const keyO = keyAlphabet('o');
export const keyP = keyAlphabet('p');
export const keyQ = keyAlphabet('q');
export const keyR = keyAlphabet('r');
export const keyX = keyAlphabet('x');
export const keyY = keyAlphabet('y');
export const keyZ = keyAlphabet('z');

export const keyCtrlBackspace = keyCtrl('BS', 'Backspace');
export const keyCtrlSpace = keyCtrl('␣', 'Space');

export const keyCtrlC = keyCtrlAlphabet('c');
export const keyCtrlD = keyCtrlAlphabet('d');
export const keyCtrlF = keyCtrlAlphabet('f');
export const keyCtrlG = keyCtrlAlphabet('g');
export const keyCtrlI = keyCtrlAlphabet('i');
export const keyCtrlN = keyCtrlAlphabet('n');
export const keyCtrlO = keyCtrlAlphabet('o');
export const keyCtrlP = keyCtrlAlphabet('p');
export const keyCtrlQ = keyCtrlAlphabet('q');
export const keyCtrlR = keyCtrlAlphabet('r');
export const keyCtrlX = keyCtrlAlphabet('x');
export const keyCtrlY = keyCtrlAlphabet('y');
export const keyCtrlZ = keyCtrlAlphabet('z');

export const defaultKeys: ReadonlyArray<ActionKey> = [
  keyEscape({
    desc: { id: messageId.quit },
    run: async () => {
      await closePanel();
      return {};
    },
  }),
];
