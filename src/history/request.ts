import {
  UpdateItemListRequest,
  UpdateItemListResponse,
} from '@src/common/messages';
import { request } from '@src/helpers/request';
import { State } from '@src/state';
import * as vscode from 'vscode';

export const updateItemList = async (
  state: State,
  panel: vscode.WebviewPanel,
): Promise<void> => {
  await request<UpdateItemListRequest, UpdateItemListResponse>(panel, {
    key: 'update-item-list',
  });
};
