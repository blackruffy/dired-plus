import { en } from '@src/i18n/en';
import { MessageId, Messages, ja } from '@src/i18n/ja';
import * as format from 'intl-messageformat';
import React from 'react';
import { MessageDescriptor, PrimitiveType } from 'react-intl';

export const getMessages = (locale: string): Messages => {
  if (locale.toLowerCase().startsWith('ja')) {
    return ja;
  } else {
    return en;
  }
};

export const useMessages = (locale: string): Messages =>
  React.useMemo(() => getMessages(locale), [locale]);

export type IntlMessage = Omit<MessageDescriptor, 'id'> &
  Readonly<{
    id: MessageId;
    values?: Record<
      string,
      | React.ReactNode
      | PrimitiveType
      | format.FormatXMLElementFn<React.ReactNode, React.ReactNode>
    >;
    opts?: format.Options;
  }>;
