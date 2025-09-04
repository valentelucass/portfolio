import type { Metadata } from 'next'
import './globals.css'
import './favicon.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Lucas Andrade',
  description: 'Criado por Lucas Andrade',
  generator: 'Lucas Andrade',
  icons: {
    icon: '/favicon-circle.svg',
    apple: '/favicon-circle.svg',
    shortcut: '/favicon-circle.svg'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
