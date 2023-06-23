'use client'

import { Song } from "@/types";

import {BsPauseFill, BsPlayFill} from "react-icons/bs";
import { AiFillBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";


import { MediaItem } from "./MediaItem";
import { LikeButton } from "./LikeButton";
import { Slider } from "./Slider";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

export const PlayerContent: React.FC<PlayerContentProps> = ({
    song, 
    songUrl
}) => {
    const Icon = true ? BsPauseFill : BsPlayFill;
    const VolumeIcon = true ? HiSpeakerXMark : HiSpeakerWave
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
                <div onClick={() => {}} 
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

            {/* Desktop View for the playbutton */}
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
                onClick={() => {}}
                size={30}
                className="
                text-neutral-400
                cursor-pointer
                hover:text-white
                transistion
                "
                />
                <div
                onClick={() => {}}
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
                onClick={() => {}}
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
                onClick={() => {}}
                className="
                cursor-pointer
                "
                size={34}/>
                <Slider/>
                </div>
            </div>

        </div>
    )
}