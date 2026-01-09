'use client';

import { Song } from '@/types';
import { PlayButton } from './PlayButton';
import Image from 'next/image';
import { useLoadImage } from '@/hooks/useLoadImage';

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

export const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  const imagePath = useLoadImage(data);

  return (
    <div
      onClick={() => onClick(data.id)}
      className="
        relative group flex flex-col
        rounded-lg overflow-hidden
        bg-card/50 hover:bg-card
        cursor-pointer p-3
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-black/20
      "
    >
      <div className="relative aspect-square w-full rounded-md overflow-hidden shadow-md shadow-black/40">
        <Image
          loading="eager"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          src={imagePath || '/images/liked.png'}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          alt={`${data.title} album cover`}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full text-card-foreground">{data.title}</p>
        <p className="text-muted-foreground text-sm pb-2 w-full truncate">By {data.author}</p>
      </div>
      <div className="absolute bottom-[100px] right-4">
        <PlayButton />
      </div>
    </div>
  );
};
