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
  key(`^ ${name}`, code, { controlKey: true });

export const keyCtrlAlphabet = (name: string) =>
  keyCtrl(name, `Key${name.toUpperCase()}`);

export const keys = {
  escape: key('ESC', 'Escape'),
  enter: key('⏎', 'Enter'),
  space: key('␣', 'Space'),
  backspace: key('BS', 'Backspace'),
  tab: key('TAB', 'Tab'),
  shift: {
    enter: key('⇧ ↩︎', 'Enter', { shiftKey: true }),
  },
};

export const keyEscape = key('ESC', 'Escape');
export const keyEnter = key('⏎', 'Enter');
export const keyShiftEnter = key('⇧ ↩︎', 'Enter', { shiftKey: true });
export const keySpace = key('␣', 'Space');
export const keyBackspace = key('BS', 'Backspace');
export const keyTab = key('TAB', 'Tab');
export const keyC = keyAlphabet('C');
export const keyD = keyAlphabet('D');
export const keyF = keyAlphabet('F');
export const keyG = keyAlphabet('G');
export const keyI = keyAlphabet('I');
export const keyN = keyAlphabet('N');
export const keyO = keyAlphabet('O');
export const keyP = keyAlphabet('P');
export const keyQ = keyAlphabet('Q');
export const keyR = keyAlphabet('R');
export const keyX = keyAlphabet('X');
export const keyY = keyAlphabet('Y');
export const keyZ = keyAlphabet('Z');

export const keyCtrlBackspace = keyCtrl('BS', 'Backspace');
export const keyCtrlSpace = keyCtrl('␣', 'Space');

export const keyCtrlC = keyCtrlAlphabet('C');
export const keyCtrlD = keyCtrlAlphabet('D');
export const keyCtrlF = keyCtrlAlphabet('F');
export const keyCtrlG = keyCtrlAlphabet('G');
export const keyCtrlI = keyCtrlAlphabet('I');
export const keyCtrlN = keyCtrlAlphabet('N');
export const keyCtrlO = keyCtrlAlphabet('O');
export const keyCtrlP = keyCtrlAlphabet('P');
export const keyCtrlQ = keyCtrlAlphabet('Q');
export const keyCtrlR = keyCtrlAlphabet('R');
export const keyCtrlU = keyCtrlAlphabet('U');
export const keyCtrlX = keyCtrlAlphabet('X');
export const keyCtrlY = keyCtrlAlphabet('Y');
export const keyCtrlZ = keyCtrlAlphabet('Z');

export const defaultKeys: ReadonlyArray<ActionKey> = [
  keyEscape({
    desc: { id: messageId.quit },
    run: async () => {
      await closePanel();
      return {};
    },
  }),
];
