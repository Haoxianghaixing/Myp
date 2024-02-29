'use client'

import Navbar from '@/components/common/navbar'

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex flex-col h-screen overflow-hidden bg-gradient-to-b from-[#1677b3] to-[#c3d7df] relative'>
      <Navbar />
      {children}
    </div>
  )
}
