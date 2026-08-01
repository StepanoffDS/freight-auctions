import { MOCK_CITIES } from '../../model/mock-cities';
import type { ApiSchemas } from '../schema';

type AuctionDetail = ApiSchemas['AuctionDetail'];
type AuctionListItem = ApiSchemas['AuctionListItem'];
type AuctionsListRequest = ApiSchemas['AuctionsListRequest'];
type AuctionBetsResponse = ApiSchemas['AuctionBetsResponse'];
type Bet = ApiSchemas['Bet'];
type Carrier = ApiSchemas['Carrier'];
type City = ApiSchemas['City'];
type SetBetRequest = ApiSchemas['SetBetRequest'];

const currentCarrier: Carrier = {
  uuid: '00000000-0000-4000-8000-000000000101',
  name: 'ООО Вектор Логистик',
  is_current_user: true,
};

const carriers: Carrier[] = [
  currentCarrier,
  {
    uuid: '00000000-0000-4000-8000-000000000102',
    name: 'ТК Север',
    is_current_user: false,
  },
  {
    uuid: '00000000-0000-4000-8000-000000000103',
    name: 'Юг Транс',
    is_current_user: false,
  },
];

const auctions: AuctionDetail[] = [
  makeAuction({
    uuid: '00000000-0000-4000-8000-000000000301',
    cargoNum: 'UL-2026-000148',
    type: 'Down',
    status: 'Trading',
    loadCity: MOCK_CITIES[0],
    unloadCity: MOCK_CITIES[1],
    cargoName: 'Молочная продукция',
    currentPrice: 120000,
    minBetPrice: 90000,
    maxBetPrice: 150000,
    userStatus: 'NotParticipant',
    canSetBet: true,
  }),
  makeAuction({
    uuid: '00000000-0000-4000-8000-000000000302',
    cargoNum: 'UL-2026-000219',
    type: 'Request',
    status: 'Trading',
    loadCity: MOCK_CITIES[2],
    unloadCity: MOCK_CITIES[3],
    cargoName: 'Стройматериалы',
    currentPrice: 104000,
    minBetPrice: 80000,
    maxBetPrice: 130000,
    userStatus: 'Losing',
    canSetBet: true,
    myBetPrice: 106000,
  }),
  makeAuction({
    uuid: '00000000-0000-4000-8000-000000000303',
    cargoNum: 'UL-2026-000301',
    type: 'FixPrice',
    status: 'Finished',
    loadCity: MOCK_CITIES[1],
    unloadCity: MOCK_CITIES[0],
    cargoName: 'Бытовая техника',
    currentPrice: 95000,
    minBetPrice: 95000,
    maxBetPrice: 95000,
    userStatus: 'Winner',
    canSetBet: false,
    hideBets: true,
    hideContacts: true,
    myBetPrice: 95000,
  }),
  makeAuction({
    uuid: '00000000-0000-4000-8000-000000000304',
    cargoNum: 'UL-2026-000417',
    type: 'Up',
    status: 'Canceled',
    loadCity: MOCK_CITIES[3],
    unloadCity: MOCK_CITIES[2],
    cargoName: 'Металлопрокат',
    currentPrice: null,
    minBetPrice: null,
    maxBetPrice: null,
    userStatus: null,
    canSetBet: false,
    noViewPrice: true,
  }),
];

const betsByAuctionUuid: Record<string, Bet[]> = {
  '00000000-0000-4000-8000-000000000301': [
    makeBet('00000000-0000-4000-8000-000000000401', carriers[1], 122000, 1),
  ],
  '00000000-0000-4000-8000-000000000302': [
    makeBet('00000000-0000-4000-8000-000000000402', carriers[1], 104000, 1),
    makeBet('00000000-0000-4000-8000-000000000403', currentCarrier, 106000, 2),
  ],
  '00000000-0000-4000-8000-000000000303': [
    makeBet('00000000-0000-4000-8000-000000000404', currentCarrier, 95000, 1),
  ],
  '00000000-0000-4000-8000-000000000304': [],
};

export const auctionMockStore = {
  list(body: AuctionsListRequest): ApiSchemas['AuctionsListResponse'] {
    const page = body.page || 1;
    const perPage = body.per_page || 10;
    const filtered = auctions
      .map(toListItem)
      .filter((item) => matchFilters(item, body));
    const sorted = sortItems(filtered, body);
    const start = (page - 1) * perPage;

    return {
      items: sorted.slice(start, start + perPage),
      pagination: {
        page,
        per_page: perPage,
        total: sorted.length,
        pages: Math.ceil(sorted.length / perPage),
      },
    };
  },

  detail(auctionUuid: string) {
    return auctions.find((auction) => auction.auction_uuid === auctionUuid);
  },

  bets(auctionUuid: string): AuctionBetsResponse | null {
    const auction = this.detail(auctionUuid);

    if (!auction) {
      return null;
    }

    const items = auction.trading.hide_bets_history
      ? []
      : (betsByAuctionUuid[auctionUuid] ?? []);

    return {
      auction_uuid: auctionUuid,
      is_hidden: auction.trading.hide_bets_history,
      participants_count: new Set(items.map((bet) => bet.carrier.uuid)).size,
      items,
    };
  },

  setBet(auctionUuid: string, body: SetBetRequest) {
    const auction = this.detail(auctionUuid);

    if (!auction) {
      return {
        status: 404 as const,
        body: error('AUCTION_NOT_FOUND', 'Auction was not found.'),
      };
    }

    if (auction.status !== 'Trading') {
      return {
        status: 409 as const,
        body: error(
          'AUCTION_STATE_CHANGED',
          'Auction is no longer accepting bets.',
        ),
      };
    }

    if (!auction.trading.can_set_bet) {
      return {
        status: 403 as const,
        body: error('BET_FORBIDDEN', 'Bet cannot be set for this auction.'),
      };
    }

    const validationErrors = validateBet(auction, body.price);

    if (validationErrors.length > 0) {
      return {
        status: 422 as const,
        body: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed.',
          errors: validationErrors,
        },
      };
    }

    const items = betsByAuctionUuid[auctionUuid] ?? [];
    const now = new Date().toISOString();
    const existingBet = items.find((bet) => bet.carrier.is_current_user);
    const bet =
      existingBet ??
      makeBet(crypto.randomUUID(), currentCarrier, body.price, null, now);

    bet.price = body.price;
    bet.price_without_vat = withoutVat(body.price);
    bet.status = 'Active';
    bet.created_at = existingBet?.created_at ?? now;

    if (!existingBet) {
      items.push(bet);
      betsByAuctionUuid[auctionUuid] = items;
    }

    rerankBets(auction, items);
    syncAuctionAfterBet(auction, bet);

    return {
      status: 200 as const,
      body: {
        auction,
        bet,
      },
    };
  },
};

function makeAuction(params: {
  uuid: string;
  cargoNum: string;
  type: ApiSchemas['AuctionType'];
  status: ApiSchemas['AuctionStatus'];
  loadCity: City;
  unloadCity: City;
  cargoName: string;
  currentPrice: number | null;
  minBetPrice: number | null;
  maxBetPrice: number | null;
  userStatus: ApiSchemas['UserTradingStatus'];
  canSetBet: boolean;
  hideBets?: boolean;
  hideContacts?: boolean;
  noViewPrice?: boolean;
  myBetPrice?: number;
}): AuctionDetail {
  const now = '2026-07-30T08:00:00.000Z';
  const loadDate = '2026-08-05T09:00:00.000Z';
  const unloadDate = '2026-08-06T18:00:00.000Z';
  const hidden = params.hideContacts ?? false;

  return {
    auction_uuid: params.uuid,
    cargo_num: params.cargoNum,
    auc_type: params.type,
    status: params.status,
    user_trading_status: params.userStatus,
    organizer: {
      uuid: '00000000-0000-4000-8000-000000000501',
      name: 'Умная логистика',
      inn: '6310000000',
    },
    contacts: {
      is_hidden: hidden,
      items: hidden ? [] : [contact()],
    },
    route: {
      points: [
        routePoint(
          '00000000-0000-4000-8000-000000000601',
          'Load',
          1,
          params.loadCity,
          loadDate,
          hidden,
        ),
        routePoint(
          '00000000-0000-4000-8000-000000000602',
          'Unload',
          2,
          params.unloadCity,
          unloadDate,
          hidden,
        ),
      ],
      distance_km: 1050,
    },
    cargo: {
      cargo_uuid: '00000000-0000-4000-8000-000000000701',
      name: params.cargoName,
      weight_tons: 20,
      volume_m3: 82,
      body_type: 'Tent',
      packaging: 'Паллеты',
      places_count: 33,
      temperature_from: null,
      temperature_to: null,
      is_hazardous: false,
    },
    vehicle_requirements: {
      body_type: 'Tent',
      loading_type: 'side',
      vehicle_count: 1,
      extra_requirements: ['Ремни', 'GPS'],
    },
    payment: {
      type: 'Deferred',
      delay_days: 10,
      note: 'Оплата по оригиналам документов',
    },
    price: {
      currency: 'RUB',
      current_price: params.noViewPrice ? null : params.currentPrice,
      price_per_km: params.currentPrice
        ? Math.round(params.currentPrice / 1050)
        : null,
      bet_step: params.minBetPrice === params.maxBetPrice ? null : 1000,
      available_price:
        params.currentPrice && params.canSetBet ? params.currentPrice - 1000 : null,
      min_bet_price: params.minBetPrice,
      max_bet_price: params.maxBetPrice,
      start_price: params.maxBetPrice,
      with_vat: true,
    },
    trading: {
      can_set_bet: params.canSetBet,
      hide_bets_history: params.hideBets ?? false,
      hide_points_address_and_contacts: hidden,
      no_view_cargo_price: params.noViewPrice ?? false,
      starts_at: '2026-07-30T07:00:00.000Z',
      ends_at: '2026-08-01T18:00:00.000Z',
      server_time: now,
    },
    my_bet: params.myBetPrice
      ? {
          bet_uuid: '00000000-0000-4000-8000-000000000801',
          price: params.myBetPrice,
          price_without_vat: withoutVat(params.myBetPrice),
          status: params.userStatus === 'Winner' ? 'Winner' : 'Active',
          ranking_place: params.userStatus === 'Losing' ? 2 : 1,
          created_at: now,
          updated_at: null,
        }
      : null,
    created_at: '2026-07-29T09:00:00.000Z',
    updated_at: now,
  };
}

function toListItem(auction: AuctionDetail): AuctionListItem {
  const loadPoint = auction.route.points[0];
  const unloadPoint = auction.route.points[auction.route.points.length - 1];

  return {
    auction_uuid: auction.auction_uuid,
    cargo_num: auction.cargo_num,
    auc_type: auction.auc_type,
    status: auction.status,
    user_trading_status: auction.user_trading_status,
    route: {
      load_city: loadPoint.city,
      unload_city: unloadPoint.city,
      distance_km: auction.route.distance_km,
    },
    loading_date: loadPoint.date_from.slice(0, 10),
    unloading_date: unloadPoint.date_from.slice(0, 10),
    cargo: {
      name: auction.cargo.name,
      weight_tons: auction.cargo.weight_tons,
      volume_m3: auction.cargo.volume_m3,
      body_type: auction.cargo.body_type,
    },
    price: {
      currency: auction.price.currency,
      current_price: auction.price.current_price,
      price_per_km: auction.price.price_per_km,
      bet_step: auction.price.bet_step,
    },
    trading: {
      can_set_bet: auction.trading.can_set_bet,
      hide_bets_history: auction.trading.hide_bets_history,
      hide_points_address_and_contacts:
        auction.trading.hide_points_address_and_contacts,
      no_view_cargo_price: auction.trading.no_view_cargo_price,
    },
    has_my_bet: Boolean(auction.my_bet),
    created_at: auction.created_at,
  };
}

function routePoint(
  point_uuid: string,
  type: ApiSchemas['RoutePointType'],
  sequence: number,
  city: City,
  date_from: string,
  hidden: boolean,
): ApiSchemas['RoutePoint'] {
  return {
    point_uuid,
    type,
    sequence,
    city,
    address: hidden ? null : `${city.name}, Промышленная 1`,
    date_from,
    date_to: null,
    contacts: hidden ? [] : [contact()],
  };
}

function contact(): ApiSchemas['Contact'] {
  return {
    name: 'Иван Петров',
    phone: '+7 999 100-20-30',
    email: 'ivan.petrov@example.com',
  };
}

function makeBet(
  bet_uuid: string,
  carrier: Carrier,
  price: number,
  ranking_place: number | null,
  created_at = '2026-07-30T08:00:00.000Z',
): Bet {
  return {
    bet_uuid,
    carrier,
    price,
    price_without_vat: withoutVat(price),
    status: 'Active',
    ranking_place,
    is_winner: false,
    is_canceled: false,
    cancel_reason: null,
    created_at,
  };
}

function matchFilters(item: AuctionListItem, body: AuctionsListRequest) {
  const filters = body.filters;

  if (!filters) {
    return true;
  }

  const statuses = filters.statuses?.length
    ? filters.statuses
    : filters.status
      ? [filters.status]
      : null;
  const price = item.price.current_price;

  return (
    (!filters.cargo_num ||
      item.cargo_num.toLowerCase().includes(filters.cargo_num.toLowerCase())) &&
    (!statuses || statuses.includes(item.status)) &&
    (!filters.auc_type || item.auc_type === filters.auc_type) &&
    (!filters.load_city_uuid ||
      item.route.load_city.uuid === filters.load_city_uuid) &&
    (!filters.unload_city_uuid ||
      item.route.unload_city.uuid === filters.unload_city_uuid) &&
    (!filters.loading_date_from ||
      item.loading_date >= filters.loading_date_from) &&
    (!filters.loading_date_to || item.loading_date <= filters.loading_date_to) &&
    (filters.is_available == null ||
      item.trading.can_set_bet === filters.is_available) &&
    (filters.is_bidder == null || item.has_my_bet === filters.is_bidder) &&
    (filters.price_from == null || (price != null && price >= filters.price_from)) &&
    (filters.price_to == null || (price != null && price <= filters.price_to))
  );
}

function sortItems(items: AuctionListItem[], body: AuctionsListRequest) {
  const sort = body.sort;

  if (!sort) {
    return items;
  }

  return [...items].sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;

    if (sort.field === 'current_price') {
      return ((a.price.current_price ?? 0) - (b.price.current_price ?? 0)) * direction;
    }

    return String(a[sort.field]).localeCompare(String(b[sort.field])) * direction;
  });
}

function validateBet(auction: AuctionDetail, price: number) {
  const errors: ApiSchemas['ValidationErrorItem'][] = [];

  if (!Number.isFinite(price) || price <= 0) {
    errors.push({ field: 'price', message: 'Price must be greater than 0.' });
  }

  if (auction.price.min_bet_price != null && price < auction.price.min_bet_price) {
    errors.push({ field: 'price', message: 'Price is lower than minimum bet price.' });
  }

  if (auction.price.max_bet_price != null && price > auction.price.max_bet_price) {
    errors.push({ field: 'price', message: 'Price is greater than maximum bet price.' });
  }

  if (auction.price.bet_step != null && auction.price.min_bet_price != null) {
    const steps = (price - auction.price.min_bet_price) / auction.price.bet_step;

    if (!Number.isInteger(steps)) {
      errors.push({ field: 'price', message: 'Price must match auction step.' });
    }
  }

  return errors;
}

function rerankBets(auction: AuctionDetail, items: Bet[]) {
  const active = items
    .filter((bet) => !bet.is_canceled)
    .sort((a, b) =>
      auction.auc_type === 'Up' ? b.price - a.price : a.price - b.price,
    );

  active.forEach((bet, index) => {
    bet.ranking_place = index + 1;
    bet.status = auction.status === 'Finished' && index === 0 ? 'Winner' : 'Active';
    bet.is_winner = bet.status === 'Winner';
  });
}

function syncAuctionAfterBet(auction: AuctionDetail, bet: Bet) {
  const items = betsByAuctionUuid[auction.auction_uuid] ?? [];
  const leader = items.find((item) => item.ranking_place === 1);

  auction.my_bet = {
    bet_uuid: bet.bet_uuid,
    price: bet.price,
    price_without_vat: bet.price_without_vat,
    status: bet.status,
    ranking_place: bet.ranking_place,
    created_at: bet.created_at,
    updated_at: new Date().toISOString(),
  };
  auction.user_trading_status = bet.ranking_place === 1 ? 'Leading' : 'Losing';
  auction.price.current_price = leader?.price ?? auction.price.current_price;
  auction.price.price_per_km = auction.price.current_price
    ? Math.round(auction.price.current_price / (auction.route.distance_km || 1))
    : null;
  auction.price.available_price =
    auction.price.current_price && auction.price.bet_step
      ? auction.price.current_price +
        (auction.auc_type === 'Up' ? auction.price.bet_step : -auction.price.bet_step)
      : null;
  auction.updated_at = new Date().toISOString();
}

function withoutVat(price: number) {
  return Math.round((price / 1.2) * 100) / 100;
}

function error(code: string, message: string): ApiSchemas['ErrorResponse'] {
  return { code, message };
}
