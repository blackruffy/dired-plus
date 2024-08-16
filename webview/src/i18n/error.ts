import { IntlMessage } from '.';

export class IntlError extends Error {
  constructor(public readonly formattedMessage: IntlMessage) {
    super(JSON.stringify(formattedMessage));
  }
}
