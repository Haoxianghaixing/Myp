'use client'

import { useUserStore } from '@/store/user'
import { Tooltip } from 'antd'
import Link from 'next/link'
import clsx from 'clsx'
import { useState } from 'react'
import { useRouter } from 'next/router'

const Navbar = () => {
  const { userInfo } = useUserStore()
  const [selectedNav, setSelectedNav] = useState('地图页')

  const navbarList = [
    {
      name: '地图页',
      path: '/map/00',
    },
    {
      name: '图片页',
      path: '/share',
    },
  ]

  return (
    <nav
      className='flex justify-between w-screen items-center h-14 bg-transparent text-black relative font-mono '
      role='navigation'
    >
      <div className='flex flex-row p-4 text-white font-bold '>
        {navbarList.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            onClick={() => {
              setSelectedNav(item.name)
            }}
            className={
              'px-3 ' +
              clsx({
                'decoration-cyan-400 underline decoration-2 underline-offset-8':
                  selectedNav === item.name,
              })
            }
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div>
        {userInfo ? (
          <div
            className='px-4 cursor-pointe text-white font-bold'
            onClick={() => {
              setSelectedNav('')
            }}
          >
            <Tooltip
              color='white'
              overlayInnerStyle={{
                color: 'black',
              }}
              title='点击前往个人主页'
            >
              <Link href={`/user/${userInfo.id}`}>
                Welcome, {userInfo.name}
              </Link>
            </Tooltip>
          </div>
        ) : (
          <div className='px-4 cursor-pointe text-white font-bold'>
            <Link href='/login'>点击登录</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
