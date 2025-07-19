import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lucas Andrade',
  description: 'Criado por Lucas Andrade',
  generator: 'Lucas Andrade',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
