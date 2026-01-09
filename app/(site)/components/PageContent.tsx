'use client';

import { SongItem } from '@/components/SongItem';
import { useOnPlay } from '@/hooks/useOnPlay';
import { Song } from '@/types';

interface PageContentProps {
  songs: Song[];
}

export const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No songs available</h3>
        <p className="text-muted-foreground text-sm">Upload some songs to get started</p>
      </div>
    );
  }

  return (
    <div
      className="
        grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
        gap-4 mt-4 pb-24 md:pb-4
      "
      role="list"
      aria-label="Songs"
    >
      {songs.map((item) => (
        <SongItem key={item.id} onClick={(id: string) => onPlay(id)} data={item} />
      ))}
    </div>
  );
};
