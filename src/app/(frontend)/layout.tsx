import React from 'react'
import './styles.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'HuanHQ\'s Blog',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="zh-CN">
      <body>
        <div className="container mx-auto px-1 sm:px-1 lg:px-1 xl:px-1 2xl:px-1 3xl:px-1 4xl:px-1">
          <Header />
          <main className="mt-36">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
