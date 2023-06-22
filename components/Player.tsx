'use client'

import { useGetSongById } from "@/hooks/useGetSongById";
import { useLoadSongUrl } from "@/hooks/useLoadSongUrl";
import { usePlayer } from "@/hooks/usePlayer"

export const Player = () => {
    const player = usePlayer();
    const {song} = useGetSongById(player.activeId);

    const songUrl = useLoadSongUrl(song!);

    //* Don't load player if you dont have the song, url or id 
    if (!song || !songUrl || !player.activeId) {
        return null;
    }

    return (
        <div className="
        fixed
        bottom-0
        bg-black
        w-full
        py-2
        h-[80px]
        px-4
        ">
            Player!
        </div>
    )
}