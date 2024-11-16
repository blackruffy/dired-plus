import { IntlIdBase } from '@core/i18n';
import { Dialog } from '@core/store';

export * from './item-list';

export type State<Self, IntlId extends IntlIdBase> = Readonly<{
  fromDialog: (dialog?: Dialog<Self, IntlId>) => Partial<Self>;
}>;
