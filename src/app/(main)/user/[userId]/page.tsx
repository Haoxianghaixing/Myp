'use client'

import { useUserStore } from '@/store/user'

export default function Page({ params }: { params: { userId: string } }) {
  const { userId } = params
  const { userInfo } = useUserStore()
  return (
    <div>
      <h1>
        {userInfo?.id === Number(userId)
          ? 'My Page'
          : 'Page of user(id: ' + userId + ')'}
      </h1>
    </div>
  )
}
