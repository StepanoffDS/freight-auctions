import type { UseFormSetError } from 'react-hook-form';

import { ApiError } from '@/shared/api';

export type BetFormValues = {
  comment: string;
  price: string;
};

export function applyValidationError(
  error: unknown,
  setError: UseFormSetError<BetFormValues>,
) {
  if (!(error instanceof ApiError) || error.status !== 422) {
    return false;
  }

  const payload = error.payload;

  if (!payload || typeof payload !== 'object' || !('errors' in payload)) {
    return false;
  }

  const errors = payload.errors;

  if (!Array.isArray(errors)) {
    return false;
  }

  errors.forEach((item) => {
    if (
      item &&
      typeof item === 'object' &&
      'field' in item &&
      item.field === 'price' &&
      'message' in item &&
      typeof item.message === 'string'
    ) {
      setError('price', { message: item.message, type: 'server' });
    }
  });

  return true;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Повторите попытку позже.';
}
