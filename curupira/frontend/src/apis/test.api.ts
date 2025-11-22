import { httpClient } from '~/clients'

/**
 * Cliente de API para endpoints de teste
 */
export const testApi = {
  /**
   * Endpoint de teste da API
   */
  get: async (): Promise<any> => {
    const response = await httpClient.get('/api/test/')
    return response.data
  },
}
