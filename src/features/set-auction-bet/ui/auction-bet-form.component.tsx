import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { formatMoney } from '@/entities/auction';
import { type AuctionDetailDto } from '@/shared/api';
import { ROUTES } from '@/shared/model/routes';
import { Button } from '@/shared/ui/kit/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/ui/kit/field';
import { Input } from '@/shared/ui/kit/input';

import { type BetFormValues } from '../model/bet-form';
import { useSetBet } from '../model/use-set-bet';
import { AuctionBetInfo } from './auction-bet-info.component';

export function AuctionBetForm({ auction }: { auction: AuctionDetailDto }) {
  const form = useForm<BetFormValues>({
    defaultValues: {
      comment: '',
      price: auction.my_bet?.price.toString() ?? '',
    },
  });
  const { mutation, onSubmit } = useSetBet({ auction, form });

  const { price } = auction;
  const disabled = !auction.trading.can_set_bet || mutation.isPending;
  const priceError = form.formState.errors.price;

  return (
    <form
      className='grid gap-5 rounded-md border bg-card p-4 sm:p-5'
      onSubmit={onSubmit}
    >
      <AuctionBetInfo auction={auction} />

      {!auction.trading.can_set_bet && (
        <p className='text-sm text-destructive'>
          Ставка по этому аукциону сейчас недоступна.
        </p>
      )}

      <Field data-invalid={Boolean(priceError)}>
        <FieldLabel htmlFor='bet-price'>Цена с НДС</FieldLabel>
        <Input
          aria-invalid={Boolean(priceError)}
          disabled={disabled}
          id='bet-price'
          inputMode='numeric'
          min={0}
          placeholder='Введите цену'
          type='number'
          {...form.register('price')}
        />
        <FieldDescription>
          Укажите сумму в {price.currency}.{' '}
          {price.available_price != null &&
            `Рекомендуемая ставка: ${formatMoney(
              price.available_price,
              price.currency,
            )}. `}
          {price.bet_step != null &&
            `Шаг: ${formatMoney(price.bet_step, price.currency)}.`}
        </FieldDescription>
        <FieldError errors={[priceError]} />
      </Field>

      <Field>
        <FieldLabel htmlFor='bet-comment'>Комментарий</FieldLabel>
        <Input
          disabled={disabled}
          id='bet-comment'
          placeholder='Необязательно'
          type='text'
          {...form.register('comment')}
        />
      </Field>

      <div className='flex flex-wrap gap-3'>
        <Button disabled={disabled} type='submit'>
          {mutation.isPending
            ? 'Сохраняем...'
            : auction.my_bet
              ? 'Изменить ставку'
              : 'Сделать ставку'}
        </Button>
        <Button
          render={
            <Link
              to={ROUTES.AUCTION}
              params={{ auctionUuid: auction.auction_uuid }}
            />
          }
          type='button'
          variant='outline'
        >
          К карточке
        </Button>
      </div>
    </form>
  );
}
