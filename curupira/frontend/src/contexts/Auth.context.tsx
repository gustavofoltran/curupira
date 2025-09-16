import React, { createContext, useContext, useEffect, useState } from 'react'
import { httpClient } from '~/clients'
import { LocalStorage } from '~/types/enums/LocalStorage.enum'
import { decodeJwt } from '~/utils/helpers/decodeJwt.helper'

type Permissions = {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export type TRolesPermission = {
  [key: string]: Permissions
}

type TUser = {
  email: string
  name: string
  image: string
  company: {
    id: number
    image: string
    name: string
  }
  roles_permissions: TRolesPermission
}

type TAuthContextData = {
  isAuthenticated: boolean
  user: TUser
  company: TUser['company']
  accessToken: string | null
  refreshToken: string | null
  login: (data: { access_token: string; refresh_token: string }) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<TAuthContextData>({} as TAuthContextData)

type TAuthProviderProps = {
  children: React.ReactNode
}

const AuthProvider = ({ children }: TAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<TUser>({} as TUser)
  const [company, setCompany] = useState<TUser['company']>(
    {} as TUser['company'],
  )
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userLocalStorage = localStorage.getItem(LocalStorage.authUser)
    const tokensLocalStorage = localStorage.getItem(LocalStorage.authToken)

    if (userLocalStorage) {
      setUser(JSON.parse(userLocalStorage))
      setCompany(JSON.parse(userLocalStorage).company)
    }

    if (tokensLocalStorage) {
      const tokens = JSON.parse(tokensLocalStorage)
      setAccessToken(tokens.access_token)
      setRefreshToken(tokens.refresh_token)
      setIsAuthenticated(true)
      httpClient.defaults.headers.Authorization = `Bearer ${tokens.access_token}`
    }

    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const login = async (data: {
    access_token: string
    refresh_token: string
  }) => {
    setIsAuthenticated(true)
    setAccessToken(data.access_token)
    setRefreshToken(data.refresh_token)
    httpClient.defaults.headers.Authorization = `Bearer ${data.access_token}`
    const decodedJwt: TUser = decodeJwt(data.access_token)
    setUser(decodedJwt)
    setCompany(decodedJwt.company)

    localStorage.setItem(LocalStorage.authUser, JSON.stringify(decodedJwt))
    localStorage.setItem(LocalStorage.authToken, JSON.stringify(data))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser({} as TUser)
    setCompany({} as TUser['company'])
    setAccessToken(null)
    setRefreshToken(null)
    httpClient.defaults.headers.Authorization = null

    localStorage.removeItem(LocalStorage.authUser)
    localStorage.removeItem(LocalStorage.authToken)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        company,
        accessToken,
        refreshToken,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
