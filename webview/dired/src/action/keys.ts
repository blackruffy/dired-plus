import { core } from '@core/index';
import { MessageId, messageId } from '@dired/i18n/ja';
import { ActionKey, State } from '@dired/store';

export type KeyParams = core.keyboard.keys.KeyParams<State, MessageId>;

export const defaultKeys: ReadonlyArray<ActionKey> =
  core.keyboard.keys.defaultKeys(
    messageId.quit,
    messageId.nextPage,
    messageId.prevPage,
  );
