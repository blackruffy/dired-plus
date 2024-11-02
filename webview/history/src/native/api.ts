import {
  GetLongHistoryRequest,
  GetLongHistoryResponse,
} from '@common/messages';
import { request } from '@core/native/request';
import { ItemList } from '@history/store';

export const getLongHistory = async (): Promise<ItemList> =>
  await request<GetLongHistoryRequest, GetLongHistoryResponse>({
    key: 'get-long-history',
  });
