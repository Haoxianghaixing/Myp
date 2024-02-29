'use client'

import { register } from '@/api/user'
import { message } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Page() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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

    // 在这里处理注册逻辑
    register(email, password, username).then((res) => {
      if (res.data.code === 200) {
        router.push('/login')
      } else if (res.data.code === 400) {
        message.error('该邮箱已注册')
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
        onSubmit={handleSubmit}
        className='flex flex-col items-start bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='input rounded-lg mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='email'
          >
            用户名
          </label>
          <input
            // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            className='w-full h-full text-input'
            id='username'
            type='text'
            placeholder='用户名'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
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
            placeholder='邮箱'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className='input rounded-lg mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='email'
          >
            密码
          </label>
          <input
            // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            className='w-full h-full text-input'
            id='password'
            type='password'
            placeholder='请输入密码'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className='mb-2 text-sm flex self-end'>
          已有账号？
          <Link href='/login' className='text-blue-500'>
            点击登录
          </Link>
        </div>
        <div className='self-end'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            注册
          </button>
        </div>
      </form>
    </div>
  )
}
