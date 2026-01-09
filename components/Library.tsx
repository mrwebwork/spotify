'use client';

import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { useSubscribeModal } from '@/hooks/useSubscribeModal';
import { useOnPlay } from '@/hooks/useOnPlay';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { useUploadModal } from '@/hooks/useUploadModal';
import { Song } from '@/types';
import { MediaItem } from './MediaItem';

interface LibraryProps {
  songs: Song[];
}

export const Library: React.FC<LibraryProps> = ({ songs }) => {
  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const { user, subscription } = useUser();
  const onPlay = useOnPlay(songs);

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return uploadModal.onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-muted-foreground" size={24} />
          <p className="text-muted-foreground font-medium text-sm">Your Library</p>
        </div>
        <button
          onClick={onClick}
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          aria-label="Add to library"
        >
          <AiOutlinePlus size={18} />
        </button>
      </div>
      <div className="flex flex-col gap-y-1 mt-4 px-3 pb-4">
        {songs.length === 0 ? (
          <p className="text-muted-foreground text-sm px-2 py-4 text-center">
            No songs in your library yet.
          </p>
        ) : (
          songs.map((item) => (
            <MediaItem onClick={(id: string) => onPlay(id)} key={item.id} data={item} />
          ))
        )}
      </div>
    </div>
  );
};
