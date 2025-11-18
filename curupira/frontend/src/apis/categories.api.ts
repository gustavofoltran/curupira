import { httpClient } from '~/clients'
import type { Category, PatchedCategory } from './types'

/**
 * Cliente de API para gerenciar categorias
 */
export const categoriesApi = {
  /**
   * Lista todas as categorias
   */
  list: async (): Promise<Category[]> => {
    const response = await httpClient.get<Category[]>('/api/categories/')
    return response.data
  },

  /**
   * Obtém uma categoria específica por ID
   */
  get: async (id: number): Promise<Category> => {
    const response = await httpClient.get<Category>(`/api/categories/${id}/`)
    return response.data
  },

  /**
   * Cria uma nova categoria
   */
  create: async (data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await httpClient.post<Category>('/api/categories/', data)
    return response.data
  },

  /**
   * Atualiza uma categoria completamente
   */
  update: async (id: number, data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await httpClient.put<Category>(
      `/api/categories/${id}/`,
      data,
    )
    return response.data
  },

  /**
   * Atualiza parcialmente uma categoria
   */
  partialUpdate: async (
    id: number,
    data: PatchedCategory,
  ): Promise<Category> => {
    const response = await httpClient.patch<Category>(
      `/api/categories/${id}/`,
      data,
    )
    return response.data
  },

  /**
   * Deleta uma categoria
   */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/categories/${id}/`)
  },
}
