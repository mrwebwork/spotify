import { Sidebar } from '@/components/Sidebar'

import './globals.css'

import { Figtree } from 'next/font/google'

import { SupabaseProvider } from '@/providers/SupabaseProvider'
import { UserProvider } from '@/providers/UserProvider'
import { ModalProvider } from '@/providers/ModalProvider'
import { ToasterProvider } from '@/providers/ToasterProvider'

const font = Figtree({ subsets: ['latin'] })

//* Describe the web app 
export const metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music!',
}

//* Main layout component for the app 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //* Provider components 
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider/>
          <SupabaseProvider>
            <UserProvider>
              <ModalProvider />
                <Sidebar>
                  {children}
                </Sidebar>
            </UserProvider>
          </SupabaseProvider>
        </body>
    </html>
  )
}
