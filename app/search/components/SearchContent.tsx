'use client';

import { useOnPlay } from '@/hooks/useOnPlay';

import { LikeButton } from '@/components/LikeButton';
import { MediaItem } from '@/components/MediaItem';

import { Song } from '@/types';

interface SearchContentProps {
  songs: Song[];
}

export const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  //* Pass all the songs from the playlist
  const onPlay = useOnPlay(songs);
  if (songs.length === 0) {
    return (
      <div
        className="
            flex
            flex-col
            gap-y-2
            w-full
            px-6
            text-neutral-400
            "
      ></div>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};
