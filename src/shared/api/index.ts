export { ApiError, unwrapApiResponse } from './api-error';
export {
  auctionQueries,
  auctionQueryKeys,
  getAuctionBets,
  getAuctionDetail,
  getAuctionsList,
  setAuctionBet,
} from './auctions';
export { apiClient } from './client';
export { queryClient } from './query-client';
export type { ApiErrorPayload } from './api-error';
export type {
  AuctionBetsResponseDto,
  AuctionDetailDto,
  AuctionListItemDto,
  AuctionsListRequestDto,
  AuctionsListResponseDto,
  SetBetRequestDto,
  SetBetResponseDto,
} from './auctions';
export type { ApiOperations, ApiPaths, ApiSchemas } from './schema';
