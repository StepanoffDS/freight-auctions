import { useQuery } from '@tanstack/react-query';

import {
  BET_STATUS_LABEL,
  formatAuctionDate,
  formatMoney,
} from '@/entities/auction';
import {
  type AuctionBetsResponseDto,
  type AuctionDetailDto,
  auctionQueries,
} from '@/shared/api';
import { Badge } from '@/shared/ui/kit/badge';
import { ParamField } from '@/shared/ui/ParamField.component';

import { Section } from '../ui-kit.component';

type Bet = AuctionBetsResponseDto['items'][number];

export function AuctionBetsSection({ auction }: { auction: AuctionDetailDto }) {
  const { data, error, isError, isPending } = useQuery(
    auctionQueries.bets(auction.auction_uuid),
  );

  if (isPending) {
    return (
      <Section title='История ставок'>
        <p className='text-sm text-muted-foreground'>Загрузка ставок...</p>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section title='История ставок'>
        <p className='text-sm text-destructive'>
          Не удалось загрузить ставки: {error.message}
        </p>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section title='История ставок'>
        <p className='text-sm text-muted-foreground'>Нет данных по ставкам.</p>
      </Section>
    );
  }

  if (auction.trading.hide_bets_history || data.is_hidden) {
    return (
      <Section title='История ставок'>
        <p className='text-sm text-muted-foreground'>
          История ставок скрыта организатором.
        </p>
      </Section>
    );
  }

  return (
    <Section title='История ставок'>
      <ParamField
        label='Участников'
        value={data.participants_count.toLocaleString('ru-RU')}
      />

      {data.items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>Ставок пока нет.</p>
      ) : (
        <div className='grid gap-3'>
          {data.items.map((bet) => (
            <BetRow
              bet={bet}
              currency={auction.price.currency}
              key={bet.bet_uuid}
            />
          ))}
        </div>
      )}
    </Section>
  );
}

function BetRow({ bet, currency }: { bet: Bet; currency: string }) {
  return (
    <div className='grid gap-3 border-t pt-3 text-sm first:border-t-0 first:pt-0 sm:grid-cols-2 lg:grid-cols-5'>
      <ParamField
        label='Перевозчик'
        value={
          <span className='inline-flex flex-wrap items-center gap-2'>
            {bet.carrier.name}
            {bet.carrier.is_current_user && (
              <Badge variant='default'>моя компания</Badge>
            )}
          </span>
        }
      />
      <ParamField label='Цена с НДС' value={formatMoney(bet.price, currency)} />
      <ParamField
        label='Цена без НДС'
        value={formatMoney(bet.price_without_vat, currency)}
      />
      <ParamField label='Место' value={bet.ranking_place ?? '-'} />
      <ParamField
        label='Статус'
        value={
          <span className='inline-flex flex-wrap items-center gap-2'>
            {BET_STATUS_LABEL[bet.status]}
            {bet.is_winner && <Badge>победитель</Badge>}
            {bet.is_canceled && <Badge variant='destructive'>отменена</Badge>}
          </span>
        }
      />
      {bet.cancel_reason && (
        <div className='sm:col-span-2 lg:col-span-5'>
          <ParamField label='Причина отмены' value={bet.cancel_reason} />
        </div>
      )}
      <div className='sm:col-span-2 lg:col-span-5'>
        <ParamField
          label='Дата ставки'
          value={formatAuctionDate(bet.created_at)}
        />
      </div>
    </div>
  );
}
