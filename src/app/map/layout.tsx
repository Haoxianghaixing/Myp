'use client'

import Navbar from '@/components/common/navbar'

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex flex-col h-screen relative overflow-hidden'>
      <div className='absolute top-0 z-10'>
        <Navbar />
      </div>
      {children}
    </div>
  )
}
