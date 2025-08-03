// pages/_app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CryptoDash</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Track top cryptocurrencies in real-time" />
      </Head>

      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <main className="px-4 sm:px-6 lg:px-8">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  )
}
