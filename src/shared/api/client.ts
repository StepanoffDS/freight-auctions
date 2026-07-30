import createClient from 'openapi-fetch';

import { CONFIG } from '../model/config';
import type { ApiPaths } from './schema';

export const apiClient = createClient<ApiPaths>({
  baseUrl: CONFIG.API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});
