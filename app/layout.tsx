import { Sidebar } from '@/components/Sidebar';

import './globals.css';

import { Figtree } from 'next/font/google';

import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { UserProvider } from '@/providers/UserProvider';
import { ModalProvider } from '@/providers/ModalProvider';
import { ToasterProvider } from '@/providers/ToasterProvider';

import { getSongsByUserId } from '@/actions/getSongsByUserId';
import { Player } from '@/components/Player';

const font = Figtree({ subsets: ['latin'] });

//* Describe the web app
export const metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music!',
};

export const revalidate = 0;

//* Main layout component for the app
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userSongs = await getSongsByUserId();

  //* Providers & Components
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs}>{children}</Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
