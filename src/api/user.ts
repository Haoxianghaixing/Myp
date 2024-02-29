import { IUserInfo } from '@/types/user'
import axios from 'axios'

export const getUserInfo = () =>
  axios.get<{
    code: number
    data: IUserInfo
  }>(`/api/user/getUserInfo`)

export const login = (email: string, password: string) =>
  axios.post<{
    code: number
    message: string
    data?: IUserInfo
  }>(`/api/user/login`, {
    email,
    password,
  })

export const register = (email: string, password: string, name: string) =>
  axios.post<{
    code: number
    message: string
  }>(`/api/user/register`, {
    email,
    password,
    name,
  })
