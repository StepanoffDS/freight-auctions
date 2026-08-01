import type { AuctionListItemDto } from '@/shared/api/auctions';

export const AUCTION_STATUSES = [
  'Draft',
  'Published',
  'Trading',
  'Finished',
  'Canceled',
  'Archived',
] as const;

export type AuctionStatus = (typeof AUCTION_STATUSES)[number];

export const AUCTION_STATUS_LABEL: Record<AuctionStatus, string> = {
  Draft: 'Черновик',
  Published: 'Опубликован',
  Trading: 'Торги',
  Finished: 'Завершен',
  Canceled: 'Отменен',
  Archived: 'Архив',
} as const;

export const AUCTION_TYPE_LABEL: Record<
  AuctionListItemDto['auc_type'],
  string
> = {
  Request: 'Заявка',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фиксированная цена',
} as const;

export const USER_TRADING_STATUS_LABEL: Record<
  NonNullable<AuctionListItemDto['user_trading_status']>,
  string
> = {
  NotParticipant: 'Не участвует',
  Leading: 'Лидирует',
  Losing: 'Проигрывает',
  Winner: 'Победитель',
  Lost: 'Проиграл',
  Canceled: 'Отменен',
} as const;
