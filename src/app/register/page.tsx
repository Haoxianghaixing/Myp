'use client'

import { register } from '@/api/user'
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
    // 在这里处理注册逻辑
    register(email, password, username).then((res) => {
      if (res.data.code === 200) {
        router.push('/login')
      } else if (res.data.code === 400) {
        alert('该邮箱已注册')
      }
    })
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Register</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-start'>
        <label className='mb-2'>
          Username:
          <input
            type='text'
            value={username}
            onChange={handleUsernameChange}
            className='border border-gray-300 rounded px-2 py-1'
          />
        </label>
        <br />
        <label className='mb-2'>
          Email:
          <input
            type='text'
            value={email}
            onChange={handleEmailChange}
            className='border border-gray-300 rounded px-2 py-1'
          />
        </label>
        <br />
        <label className='mb-2'>
          Password:
          <input
            type='password'
            value={password}
            onChange={handlePasswordChange}
            className='border border-gray-300 rounded px-2 py-1'
          />
        </label>
        <br />
        <button
          type='submit'
          className='bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600'
        >
          Register
        </button>
      </form>
    </div>
  )
}
