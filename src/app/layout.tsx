import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Auth from '@/components/common/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Myp',
  description: '属于自己的旅行地图',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AntdRegistry>
          <Auth>{children}</Auth>
        </AntdRegistry>
      </body>
    </html>
  )
}
