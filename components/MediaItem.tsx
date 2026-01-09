'use client';

import Image from 'next/image';
import { useLoadImage } from '@/hooks/useLoadImage';
import { Song } from '@/types';
import { usePlayer } from '@/hooks/usePlayer';

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
}

export const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const player = usePlayer();
  const imageUrl = useLoadImage(data);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
    return player.setId(data.id);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-secondary/50 w-full p-2 rounded-md transition-colors group"
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden shadow-md shadow-black/30">
        <Image
          fill
          src={imageUrl || '/images/liked.png'}
          alt={`${data.title} cover`}
          className="object-cover"
          sizes="48px"
        />
      </div>
      <div className="flex flex-col gap-y-0.5 overflow-hidden">
        <p className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
          {data.title}
        </p>
        <p className="text-muted-foreground text-sm truncate">{data.author}</p>
      </div>
    </div>
  );
};
