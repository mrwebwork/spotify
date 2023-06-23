'use client'

import { useEffect, useState } from "react";

import { Song } from "@/types";

import { usePlayer } from "@/hooks/usePlayer";

import {BsPauseFill, BsPlayFill} from "react-icons/bs";
import { AiFillBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";

import { MediaItem } from "./MediaItem";
import { LikeButton } from "./LikeButton";
import { Slider } from "./Slider";
import useSound from "use-sound";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

export const PlayerContent: React.FC<PlayerContentProps> = ({
    song, 
    songUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    //* Play the next song in the playlist
    const onPlayNextSong = () => {
        if (player.ids.length === 0){
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        //* Check if there is a next song to play  
        const nextSong = player.ids[currentIndex + 1];
        //* If song is last in array, reset playlist
        if (!nextSong) {
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    }

    //* Play the previous song in the playlist
    const onPlayPreviousSong = () => {
        if (player.ids.length === 0){
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        //* Check the song BEFORE the one currently playing
        const previousSong = player.ids[currentIndex - 1];
        
        //? What if the song we are currently playing is FIRST in the array & we click on play previous song
        //! Don't load the same song 
        //* Load the LAST song in the array, go backwards
        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    };
    
    const [play, {pause, sound}] = useSound(
        songUrl,
        {
            volume: volume,
            //* Play song 
            onplay: () => setIsPlaying(true),
            //* End song then immediately play next song
            onend: () => {
                setIsPlaying(false);
                onPlayNextSong();
            },
            onpause: () => setIsPlaying(false),
            format: ['mp3']
        }
    );

    //* Automatcially play the song when the player component loads
    useEffect(() => {
        sound?.play();
        return () => {
            sound?.unload();
        }
    }, [sound]);

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    };

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    }

    return (
        <div className="
        grid
        grid-cols-2
        md:grid-cols-3
        h-full
        ">
            <div className="
            flex
            w-full
            justify-start
            ">
                <div className="
                flex
                items-center
                gap-x-4
                ">
                    <MediaItem data={song}/>
                    <LikeButton songId={song.id}/>
                </div>
            </div>

            <div className="
            flex
            md:hidden
            col-auto
            w-full
            justify-end
            items-center
            ">
                <div onClick={handlePlay} 
                className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-full
                bg-white
                p-1
                cursor-pointer
                ">
                    <Icon size={30} className="text-black"/>
                </div>
            </div>

            {/* //* Desktop View for the playbutton */}
            <div className="
            hidden
            h-full
            md:flex
            justify-center
            items-center
            w-full
            max-w-[722px]
            gap-x-6
            ">
                <AiFillBackward 
                onClick={onPlayPreviousSong}
                size={30}
                className="
                text-neutral-400
                cursor-pointer
                hover:text-white
                transistion
                "
                />
                <div
                onClick={handlePlay}
                className="
                flex
                items-center
                justify-center
                h-10
                w-10
                rounded-full
                bg-white
                p-1
                cursor-pointer
                "
                >
                    <Icon size={30} className="text-black"/>
                </div>
                <AiFillStepForward 
                onClick={onPlayNextSong}
                size={30}
                className="
                text-neutral-400
                cursor-pointer
                hover:text-white
                transition
                "
                />
            </div>

            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                <VolumeIcon 
                onClick={toggleMute}
                className="
                cursor-pointer
                "
                size={34}/>
                <Slider value={volume} onChange={(value) => setVolume(value)}/>
                </div>
            </div>

        </div>
    )
}