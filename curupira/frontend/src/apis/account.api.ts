import { httpClient } from '~/clients';
import { LocalStorage } from '~/types/enums/LocalStorage.enum';
import type { AuthResponse, LoginPayload, RegisterPayload, SearchHistoryResponse, UserProfile } from './types';

/**
 * Cliente de API para autenticação e conta de usuário
 */
export const accountApi = {
  /**
   * Registra um novo usuário
   */
  register: async (payload: RegisterPayload): Promise<{ id: number; username: string; email: string }> => {
    const response = await httpClient.post<{ id: number; username: string; email: string }>('/api/register/', payload);
    return response.data;
  },

  /**
   * Realiza login e retorna o token JWT
   * (armazenamento em localStorage é tratado no AuthContext)
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>('/api/login/', payload);
    return response.data;
  },

  /**
   * Retorna os dados do usuário autenticado (com base no JWT)
   */
  me: async (): Promise<UserProfile> => {
    let token: string | null = null;
    try {
      const stored = window.localStorage.getItem(LocalStorage.authToken);
      if (stored) {
        const parsed = JSON.parse(stored) as { token?: string };
        if (parsed?.token) token = parsed.token;
      }
    } catch {
      token = null;
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await httpClient.get<UserProfile>('/api/me/', { headers });
    return response.data;
  },

  /**
   * Obtém o histórico de buscas do usuário autenticado
   */
  getSearchHistory: async (params?: { page?: number; page_size?: number }): Promise<SearchHistoryResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', String(params.page));
    if (params?.page_size !== undefined) queryParams.append('page_size', String(params.page_size));

    // Recupera token salvo
    let token: string | null = null;
    try {
      const stored = window.localStorage.getItem(LocalStorage.authToken);
      if (stored) {
        const parsed = JSON.parse(stored) as { token?: string };
        if (parsed?.token) token = parsed.token;
      }
    } catch {
      token = null;
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await httpClient.get<SearchHistoryResponse>(
      `/api/search_history/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      { headers },
    );

    return response.data;
  },
};
