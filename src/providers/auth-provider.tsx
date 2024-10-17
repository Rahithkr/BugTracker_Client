import React, { createContext, useContext, ReactNode } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store'
import { login, logout } from '../redux/slice/authSlice'

interface AuthContextType {
  login: (username: string) => void
  logout: () => void
  isAuthenticated: boolean
  user: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const loginHandler = (username: string) => {
    dispatch(login(username))
  }

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <AuthContext.Provider value={{ login: loginHandler, logout: logoutHandler, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}