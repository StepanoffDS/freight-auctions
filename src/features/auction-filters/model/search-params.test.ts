import { describe, expect, it } from 'vitest';

import {
  auctionsSearchSchema,
  buildAuctionsListRequest,
} from './search-params';

describe('auctionsSearchSchema', () => {
  it('uses safe fallbacks for invalid paging, sort and filters', () => {
    const result = auctionsSearchSchema.parse({
      auc_type: 'BadType',
      is_available: 'maybe',
      loading_date_from: '2026/08/05',
      page: 'bad',
      per_page: '999',
      price_from: '-1',
      sort_direction: 'sideways',
      sort_field: 'unknown',
      statuses: 'Trading,BadStatus',
    });

    expect(result).toMatchObject({
      auc_type: undefined,
      is_available: undefined,
      loading_date_from: undefined,
      page: 1,
      per_page: 10,
      price_from: undefined,
      sort_direction: 'desc',
      sort_field: 'created_at',
      statuses: [],
    });
  });

  it('parses supported statuses and boolean search params', () => {
    const result = auctionsSearchSchema.parse({
      is_available: 'true',
      is_bidder: 'false',
      statuses: 'Trading,Finished',
    });

    expect(result.statuses).toEqual(['Trading', 'Finished']);
    expect(result.is_available).toBe(true);
    expect(result.is_bidder).toBe(false);
  });
});

describe('buildAuctionsListRequest', () => {
  it('omits empty filters and keeps paging and sort', () => {
    const search = auctionsSearchSchema.parse({});

    expect(buildAuctionsListRequest(search)).toEqual({
      filters: undefined,
      page: 1,
      per_page: 10,
      sort: {
        direction: 'desc',
        field: 'created_at',
      },
    });
  });

  it('maps non-empty search params to API filters', () => {
    const search = auctionsSearchSchema.parse({
      auc_type: 'Down',
      cargo_num: ' UL-2026 ',
      is_available: 'true',
      is_bidder: 'false',
      load_city_uuid: '00000000-0000-4000-8000-000000000001',
      loading_date_from: '2026-08-01',
      loading_date_to: '2026-08-10',
      page: '2',
      per_page: '20',
      price_from: '90000',
      price_to: '150000',
      sort_direction: 'asc',
      sort_field: 'current_price',
      statuses: 'Trading,Finished',
      unload_city_uuid: '00000000-0000-4000-8000-000000000002',
    });

    expect(buildAuctionsListRequest(search)).toEqual({
      filters: {
        auc_type: 'Down',
        cargo_num: 'UL-2026',
        is_available: true,
        is_bidder: false,
        load_city_uuid: '00000000-0000-4000-8000-000000000001',
        loading_date_from: '2026-08-01',
        loading_date_to: '2026-08-10',
        price_from: 90000,
        price_to: 150000,
        statuses: ['Trading', 'Finished'],
        unload_city_uuid: '00000000-0000-4000-8000-000000000002',
      },
      page: 2,
      per_page: 20,
      sort: {
        direction: 'asc',
        field: 'current_price',
      },
    });
  });
});
