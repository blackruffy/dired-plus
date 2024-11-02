import * as format from 'intl-messageformat';
import { MessageDescriptor, PrimitiveType } from 'react-intl';

export type IntlIdBase = string;

export type IntlMessage<Id extends IntlIdBase> = Omit<MessageDescriptor, 'id'> &
  Readonly<{
    id: Id;
    values?: Record<
      string,
      | React.ReactNode
      | PrimitiveType
      | format.FormatXMLElementFn<React.ReactNode, React.ReactNode>
    >;
    opts?: format.Options;
  }>;

export type IntlMessages<Id extends IntlIdBase> = Readonly<{
  [K in Id]: string;
}>;

export type IntlMessageIdMap<Id extends IntlIdBase> = Readonly<{
  [K in Id]: K;
}>;

export class IntlError<Id extends string> extends Error {
  constructor(public readonly formattedMessage: IntlMessage<Id>) {
    super(JSON.stringify(formattedMessage));
  }
}

export const getIntlMessageIdMap = <Id extends IntlIdBase>(
  messages: IntlMessages<Id>,
): IntlMessageIdMap<Id> =>
  Object.keys(messages).reduce(
    (acc, key) => ({
      ...acc,
      [key]: key,
    }),
    {} as IntlMessageIdMap<Id>,
  );
