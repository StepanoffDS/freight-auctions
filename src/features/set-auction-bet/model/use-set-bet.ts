import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  type AuctionDetailDto,
  auctionQueryKeys,
  setAuctionBet,
  type SetBetRequestDto,
} from '@/shared/api/auctions';

import {
  applyValidationError,
  type BetFormValues,
  buildBetSchema,
  getErrorMessage,
} from './bet-form';

export function useSetBet({
  auction,
  form,
}: {
  auction: AuctionDetailDto;
  form: ReturnType<typeof useForm<BetFormValues>>;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: SetBetRequestDto) =>
      setAuctionBet(auction.auction_uuid, body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...auctionQueryKeys.all, 'list'],
        }),
        queryClient.invalidateQueries({
          queryKey: auctionQueryKeys.detail(auction.auction_uuid),
        }),
        queryClient.invalidateQueries({
          queryKey: auctionQueryKeys.bets(auction.auction_uuid),
        }),
      ]);
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    form.clearErrors();

    const parsed = buildBetSchema(auction).safeParse(values);
    console.log('parsed', parsed);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0] === 'price') {
          form.setError('price', { message: issue.message, type: 'validate' });
        }
      });
      return;
    }

    try {
      await mutation.mutateAsync(parsed.data);
      toast.success('Ставка принята', {
        description: 'Ставка сохранена, данные аукциона обновляются.',
      });
    } catch (error) {
      if (applyValidationError(error, form.setError)) {
        toast.error('Проверьте ставку', {
          description: 'Сервер вернул ошибку валидации.',
        });
        return;
      }

      toast.error('Не удалось сохранить ставку', {
        description: getErrorMessage(error),
      });
    }
  });

  return { mutation, onSubmit };
}
