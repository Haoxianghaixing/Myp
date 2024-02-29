'use client'

import { getUserInfo } from '@/api/user'
import { useUserStore } from '@/store/user'
import { ReactNode, useEffect } from 'react'

const Auth = ({ children }: { children: ReactNode }) => {
  const { setUserInfo } = useUserStore()
  useEffect(() => {
    getUserInfo().then((res) => {
      console.log('getUserInfo')
      const userInfo = res.data.data
      if (userInfo) {
        setUserInfo(userInfo)
      }
    })
  }, [])

  return children
}

export default Auth
