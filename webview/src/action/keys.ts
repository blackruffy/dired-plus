import { ActionKey, ModifierKeys, Ok, toModifierKeys } from '@src/store';
import { Task } from 'fp-ts/lib/Task';

export type KeyParams = Readonly<{
  desc: string;
  run: Task<Ok>;
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

export const keyAlphabet = (name: string) =>
  key(name, `Key${name.toUpperCase()}`);

export const keyEscape = key('ESC', 'Escape');
export const keyEnter = key('⏎', 'Enter');
export const keyShiftEnter = key('⇧ + ↩︎', 'Enter', { shiftKey: true });
export const keySpace = key('␣', 'Space');
export const keyBackspace = key('⇦', 'Backspace');
export const keyCtrlBackspace = key('^ + ⇦', 'Backspace', {
  controlKey: true,
});
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
