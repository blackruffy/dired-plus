import { core } from '@core/index';
import { en } from '@dired/i18n/en';
import { MessageId, Messages, ja } from '@dired/i18n/ja';
import React from 'react';

export const getMessages = (locale: string): Messages => {
  if (locale.toLowerCase().startsWith('ja')) {
    return ja;
  } else {
    return en;
  }
};

export const useMessages = (locale: string): Messages =>
  React.useMemo(() => getMessages(locale), [locale]);

export type IntlMessage = core.i18n.IntlMessage<MessageId>;
