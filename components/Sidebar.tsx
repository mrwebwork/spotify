'use client';

import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import { usePlayer } from '@/hooks/usePlayer';
import { useMemo } from 'react';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';

import { Box } from './Box';
import { SidebarItem } from './SidebarItem';
import { Library } from './Library';

import { Song } from '@/types';

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

export const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
  const pathname = usePathname();
  const player = usePlayer();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: 'Home',
        active: pathname !== '/search',
        href: '/',
      },
      {
        icon: BiSearch,
        label: 'Search',
        active: pathname === '/search',
        href: '/search',
      },
    ],
    [pathname]
  );

  return (
    <div
      className={twMerge(
        'flex h-full',
        player.activeId && 'h-[calc(100%-80px)]'
      )}
    >
      <aside className="hidden md:flex flex-col gap-y-2 bg-background h-full w-[300px] p-2">
        <Box>
          <nav className="flex flex-col gap-y-2 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </nav>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} />
        </Box>
      </aside>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
    </div>
  );
};
