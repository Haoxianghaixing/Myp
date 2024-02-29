'use client'

import { login } from '@/api/user'
import { useUserStore } from '@/store/user'
import { message } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { setUserInfo } = useUserStore()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 检查邮箱和密码是否为空
    if (!email || !password) {
      message.error('邮箱和密码不能为空')
      return
    }

    // 检查邮箱格式
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
      message.error('邮箱格式不正确, 请重新输入')
      return
    }

    // 处理登录逻辑
    login(email, password).then((res) => {
      if (res.data.code === 200) {
        const userInfo = res.data.data
        setUserInfo(userInfo!)
        router.push('/map/00')
      } else if (res.data.code === 400) {
        message.error('用户名或密码错误')
      }
    })
  }

  return (
    <div className='flex relative justify-center items-center h-screen bg-gradient-to-t from-pink-200 to-purple-400'>
      <div className='absolute top-16 text-center text-white font-bold'>
        <p className='text-2xl'>欢迎来到 Myp</p>
        <p className='text-lg'>登录后即可开始记录你的旅行</p>
      </div>
      <form
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
        onSubmit={handleSubmit}
      >
        <div className='input rounded-lg mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='email'
          >
            邮箱
          </label>
          <input
            // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            className='w-full h-full text-input'
            id='email'
            type='email'
            placeholder='Email'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className='input rounded-lg mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='password'
          >
            密码
          </label>
          <input
            // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            className='w-full h-full text-input'
            id='password'
            type='password'
            placeholder='请输入 20 位以内密码'
            maxLength={20}
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className='mb-2 text-sm flex justify-end'>
          暂无账号？
          <Link href='/register' className='text-blue-500'>
            请点击注册
          </Link>
        </div>
        <div className='flex items-center justify-end'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            登录
          </button>
        </div>
      </form>
    </div>
  )
}
