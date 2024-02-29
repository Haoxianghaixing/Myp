import { IUserInfo } from '@/types/user'
import { create } from 'zustand'

type UserStore = {
  userInfo: IUserInfo | null
  setUserInfo: (userInfo: UserStore['userInfo']) => void
  isLogin: () => boolean
  clearUserInfo: () => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  isLogin: () => !!get().userInfo,
  clearUserInfo: () => set({ userInfo: null }),
}))
