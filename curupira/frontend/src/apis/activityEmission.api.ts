import { httpClient } from '~/clients'
import type { ActivityEmissionParams, EmissionResponse } from './types'

/**
 * Cliente de API para cálculos de emissão
 */
export const activityEmissionApi = {
  /**
   * Obtém dados de emissão de atividade via query parameters
   * @param params - Parâmetros de query (id, value1, value2)
   */
  get: async (params: ActivityEmissionParams): Promise<EmissionResponse> => {
    const queryParams = new URLSearchParams()
    queryParams.append('id', String(params.id))
    if (params.value1) queryParams.append('value1', params.value1)
    if (params.value2) queryParams.append('value2', params.value2)

    const response = await httpClient.get<EmissionResponse>(
      `/api/activity_emission/?${queryParams.toString()}`,
    )
    return response.data
  },
}
