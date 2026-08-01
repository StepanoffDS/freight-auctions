import { z } from 'zod';

import { AUCTION_STATUSES } from '@/entities/auction';
import type { AuctionsListRequestDto } from '@/shared/api';
import { DEFAULT_AUCTIONS_SEARCH } from '@/shared/model/auctions';

export const AUCTION_TYPES = ['Request', 'Up', 'Down', 'FixPrice'] as const;

const SORT_FIELDS = [
  'created_at',
  'loading_date',
  'current_price',
  'cargo_num',
] as const;

const SORT_DIRECTIONS = ['asc', 'desc'] as const;

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .catch(undefined);

const optionalBooleanSchema = z
  .preprocess((value) => {
    if (value === true || value === 'true') {
      return true;
    }

    if (value === false || value === 'false') {
      return false;
    }

    return undefined;
  }, z.boolean().optional())
  .catch(undefined);

const optionalNumberSchema = z.coerce
  .number()
  .positive()
  .optional()
  .catch(undefined);

const statusesSchema = z
  .preprocess((value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string' && value.length > 0) {
      return value.split(',');
    }

    return [];
  }, z.array(z.enum(AUCTION_STATUSES)))
  .catch([]);

export const auctionsSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  per_page: z.coerce.number().int().positive().max(50).catch(10),
  cargo_num: z.string().trim().optional().catch(undefined),
  status: z.enum(AUCTION_STATUSES).optional().catch(undefined),
  statuses: statusesSchema,
  auc_type: z.enum(AUCTION_TYPES).optional().catch(undefined),
  load_city_uuid: z.uuid().optional().catch(undefined),
  unload_city_uuid: z.uuid().optional().catch(undefined),
  loading_date_from: dateSchema,
  loading_date_to: dateSchema,
  is_available: optionalBooleanSchema,
  is_bidder: optionalBooleanSchema,
  price_from: optionalNumberSchema,
  price_to: optionalNumberSchema,
  sort_field: z.enum(SORT_FIELDS).catch('created_at'),
  sort_direction: z.enum(SORT_DIRECTIONS).catch('desc'),
});

export type AuctionsSearchParams = z.infer<typeof auctionsSearchSchema>;

export { DEFAULT_AUCTIONS_SEARCH };

export function buildAuctionsListRequest(
  search: AuctionsSearchParams,
): AuctionsListRequestDto {
  const filters: NonNullable<AuctionsListRequestDto['filters']> = {};

  if (search.cargo_num) {
    filters.cargo_num = search.cargo_num;
  }

  if (search.status) {
    filters.status = search.status;
  }

  if (search.statuses.length > 0) {
    filters.statuses = search.statuses;
  }

  if (search.auc_type) {
    filters.auc_type = search.auc_type;
  }

  if (search.load_city_uuid) {
    filters.load_city_uuid = search.load_city_uuid;
  }

  if (search.unload_city_uuid) {
    filters.unload_city_uuid = search.unload_city_uuid;
  }

  if (search.loading_date_from) {
    filters.loading_date_from = search.loading_date_from;
  }

  if (search.loading_date_to) {
    filters.loading_date_to = search.loading_date_to;
  }

  if (search.is_available != null) {
    filters.is_available = search.is_available;
  }

  if (search.is_bidder != null) {
    filters.is_bidder = search.is_bidder;
  }

  if (search.price_from != null) {
    filters.price_from = search.price_from;
  }

  if (search.price_to != null) {
    filters.price_to = search.price_to;
  }

  return {
    page: search.page,
    per_page: search.per_page,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    sort: {
      field: search.sort_field,
      direction: search.sort_direction,
    },
  };
}
