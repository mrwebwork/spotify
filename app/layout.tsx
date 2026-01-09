import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Figtree } from 'next/font/google';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { UserProvider } from '@/providers/UserProvider';
import { ModalProvider } from '@/providers/ModalProvider';
import { ToasterProvider } from '@/providers/ToasterProvider';
import { KeyboardShortcutsProvider } from '@/providers/KeyboardShortcutsProvider';
import { getSongsByUserId } from '@/actions/getSongsByUserId';
import { Player } from '@/components/Player';
import { getActiveProductsWithPrices } from '@/actions/getActiveProductsWithPrices';

const font = Figtree({ subsets: ['latin'] });

export const metadata = {
  title: 'Spotify Clone',
  description: 'Stream your favorite music with our Spotify-inspired music player.',
  keywords: ['music', 'streaming', 'spotify', 'player', 'songs'],
};

export const revalidate = 0;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <KeyboardShortcutsProvider>
              <ModalProvider products={products} />
              <Sidebar songs={userSongs}>{children}</Sidebar>
              <Player />
              <MobileNav />
            </KeyboardShortcutsProvider>
          </UserProvider>
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
