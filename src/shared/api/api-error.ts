import type { ApiSchemas } from './schema';

export type ApiErrorPayload =
  | ApiSchemas['ErrorResponse']
  | ApiSchemas['ValidationErrorResponse']
  | unknown;

type ApiResult<TData, TError> =
  | {
      data: TData;
      error?: never;
      response: Response;
    }
  | {
      data?: never;
      error: TError;
      response: Response;
    };

export class ApiError<TPayload = ApiErrorPayload> extends Error {
  readonly payload: TPayload;
  readonly response: Response;
  readonly status: number;

  constructor(response: Response, payload: TPayload) {
    super(getApiErrorMessage(payload, response));
    this.name = 'ApiError';
    this.payload = payload;
    this.response = response;
    this.status = response.status;
  }
}

export function unwrapApiResponse<TData, TError>(
  result: ApiResult<TData, TError>,
): TData {
  if ('error' in result) {
    throw new ApiError(result.response, result.error);
  }

  return result.data;
}

function getApiErrorMessage(payload: unknown, response: Response) {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message;
  }

  return `API request failed with status ${response.status}`;
}
