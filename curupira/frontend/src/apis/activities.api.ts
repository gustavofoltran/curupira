import { httpClient } from '~/clients'
import type { Activity, PatchedActivity } from './types'

/**
 * Cliente de API para gerenciar atividades
 */
export const activitiesApi = {
  /**
   * Lista todas as atividades
   */
  list: async (): Promise<Activity[]> => {
    const response = await httpClient.get<Activity[]>('/api/activities/')
    return response.data
  },

  /**
   * Obtém uma atividade específica por ID
   */
  get: async (id: number): Promise<Activity> => {
    const response = await httpClient.get<Activity>(`/api/activities/${id}/`)
    return response.data
  },

  /**
   * Cria uma nova atividade
   */
  create: async (data: Omit<Activity, 'id'>): Promise<Activity> => {
    const response = await httpClient.post<Activity>('/api/activities/', data)
    return response.data
  },

  /**
   * Atualiza uma atividade completamente
   */
  update: async (id: number, data: Omit<Activity, 'id'>): Promise<Activity> => {
    const response = await httpClient.put<Activity>(
      `/api/activities/${id}/`,
      data,
    )
    return response.data
  },

  /**
   * Atualiza parcialmente uma atividade
   */
  partialUpdate: async (
    id: number,
    data: PatchedActivity,
  ): Promise<Activity> => {
    const response = await httpClient.patch<Activity>(
      `/api/activities/${id}/`,
      data,
    )
    return response.data
  },

  /**
   * Deleta uma atividade
   */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/activities/${id}/`)
  },
}
