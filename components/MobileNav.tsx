'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { TbPlaylist } from 'react-icons/tb';
import { twMerge } from 'tailwind-merge';
import { usePlayer } from '@/hooks/usePlayer';

export const MobileNav = () => {
  const pathname = usePathname();
  const player = usePlayer();

  const routes = [
    {
      icon: HiHome,
      label: 'Home',
      active: pathname === '/',
      href: '/',
    },
    {
      icon: BiSearch,
      label: 'Search',
      active: pathname === '/search',
      href: '/search',
    },
    {
      icon: TbPlaylist,
      label: 'Library',
      active: pathname === '/liked',
      href: '/liked',
    },
  ];

  return (
    <nav
      className={twMerge(
        'md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50',
        player.activeId && 'bottom-[72px]'
      )}
    >
      <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            className={twMerge(
              'flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all',
              route.active
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <route.icon size={22} />
            <span className="text-xs font-medium">{route.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
