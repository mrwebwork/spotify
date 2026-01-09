'use client';

import { useGetSongById } from '@/hooks/useGetSongById';
import { useLoadSongUrl } from '@/hooks/useLoadSongUrl';
import { usePlayer } from '@/hooks/usePlayer';
import { PlayerContent } from './PlayerContent';

export const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass border-t border-border/50 px-4 py-3">
        <PlayerContent key={songUrl} song={song} songUrl={songUrl} />
      </div>
    </div>
  );
};
