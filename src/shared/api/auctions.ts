import { queryOptions } from '@tanstack/react-query';

import { unwrapApiResponse } from './api-error';
import { apiClient } from './client';
import type { ApiSchemas } from './schema';

export type AuctionsListRequestDto = ApiSchemas['AuctionsListRequest'];
export type AuctionsListResponseDto = ApiSchemas['AuctionsListResponse'];
export type AuctionListItemDto = ApiSchemas['AuctionListItem'];
export type AuctionDetailDto = ApiSchemas['AuctionDetail'];
export type AuctionBetsResponseDto = ApiSchemas['AuctionBetsResponse'];
export type SetBetRequestDto = ApiSchemas['SetBetRequest'];
export type SetBetResponseDto = ApiSchemas['SetBetResponse'];

export const auctionQueryKeys = {
  all: ['auctions'] as const,
  list: (body: AuctionsListRequestDto) =>
    [...auctionQueryKeys.all, 'list', body] as const,
  detail: (auctionUuid: string) =>
    [...auctionQueryKeys.all, 'detail', auctionUuid] as const,
  bets: (auctionUuid: string) =>
    [...auctionQueryKeys.all, 'bets', auctionUuid] as const,
};

export async function getAuctionsList(body: AuctionsListRequestDto) {
  return unwrapApiResponse(
    await apiClient.POST('/auctions/list', {
      body,
    }),
  );
}

export async function getAuctionDetail(auctionUuid: string) {
  return unwrapApiResponse(
    await apiClient.GET('/auctions/{auctionUuid}', {
      params: {
        path: { auctionUuid },
      },
    }),
  );
}

export async function getAuctionBets(auctionUuid: string) {
  return unwrapApiResponse(
    await apiClient.GET('/auctions/{auctionUuid}/bets', {
      params: {
        path: { auctionUuid },
      },
    }),
  );
}

export async function setAuctionBet(
  auctionUuid: string,
  body: SetBetRequestDto,
) {
  return unwrapApiResponse(
    await apiClient.POST('/auctions/{auctionUuid}/bets', {
      params: {
        path: { auctionUuid },
      },
      body,
    }),
  );
}

export const auctionQueries = {
  list: (body: AuctionsListRequestDto) =>
    queryOptions({
      queryKey: auctionQueryKeys.list(body),
      queryFn: () => getAuctionsList(body),
    }),
  detail: (auctionUuid: string) =>
    queryOptions({
      queryKey: auctionQueryKeys.detail(auctionUuid),
      queryFn: () => getAuctionDetail(auctionUuid),
    }),
  bets: (auctionUuid: string) =>
    queryOptions({
      queryKey: auctionQueryKeys.bets(auctionUuid),
      queryFn: () => getAuctionBets(auctionUuid),
    }),
};
