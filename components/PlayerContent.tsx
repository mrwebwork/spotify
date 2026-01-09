'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Song } from '@/types';
import { usePlayer } from '@/hooks/usePlayer';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2';
import { BiShuffle, BiRepeat } from 'react-icons/bi';
import { TbRepeatOnce } from 'react-icons/tb';
import { MediaItem } from './MediaItem';
import { LikeButton } from './LikeButton';
import { Slider } from './Slider';
import useSound from 'use-sound';

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds === Infinity) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = player.isMuted || player.volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNextSong = useCallback(() => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    
    if (player.isShuffled) {
      const remainingIds = player.ids.filter((id) => id !== player.activeId);
      if (remainingIds.length === 0) {
        player.setId(player.ids[0]);
        return;
      }
      const randomIndex = Math.floor(Math.random() * remainingIds.length);
      player.setId(remainingIds[randomIndex]);
      return;
    }

    const nextSong = player.ids[currentIndex + 1];
    if (!nextSong) {
      if (player.repeatMode === 'all') {
        player.setId(player.ids[0]);
      }
      return;
    }
    player.setId(nextSong);
  }, [player]);

  const onPlayPreviousSong = useCallback(() => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      player.setId(player.ids[player.ids.length - 1]);
      return;
    }
    player.setId(previousSong);
  }, [player]);

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: player.isMuted ? 0 : player.volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      if (player.repeatMode === 'one') {
        sound?.play();
      } else {
        onPlayNextSong();
      }
    },
    onpause: () => setIsPlaying(false),
    format: ['mp3'],
  });

  useEffect(() => {
    sound?.play();
    return () => {
      sound?.unload();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sound]);

  useEffect(() => {
    if (sound) {
      setDuration(sound.duration() / 1000);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (sound.playing()) {
          setCurrentTime(sound.seek() as number);
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sound, isPlaying]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const handleSeek = (value: number) => {
    if (sound) {
      sound.seek(value);
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    player.setVolume(value);
  };

  const getRepeatIcon = () => {
    if (player.repeatMode === 'one') {
      return <TbRepeatOnce size={18} className="text-primary" />;
    }
    return <BiRepeat size={18} className={player.repeatMode === 'all' ? 'text-primary' : 'text-muted-foreground'} />;
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Progress bar - full width on top */}
      <div className="hidden md:flex items-center gap-2 w-full max-w-2xl mx-auto">
        <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={currentTime}
          onChange={handleSeek}
          max={duration || 100}
          step={0.1}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-10 tabular-nums">
          {formatTime(duration)}
        </span>
      </div>

      {/* Main player controls */}
      <div className="grid grid-cols-3 h-full items-center">
        {/* Song info - left */}
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-x-4">
            <MediaItem data={song} />
            <LikeButton songId={song.id} />
          </div>
        </div>

        {/* Playback controls - center */}
        <div className="flex flex-col items-center justify-center gap-1">
          {/* Mobile play button */}
          <div className="flex md:hidden col-auto w-full justify-end items-center">
            <button
              onClick={handlePlay}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-foreground p-1 hover:scale-105 active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <Icon size={24} className="text-background" />
            </button>
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex justify-center items-center w-full gap-x-4">
            <button
              onClick={player.toggleShuffle}
              className={`transition-colors hover:text-foreground ${player.isShuffled ? 'text-primary' : 'text-muted-foreground'}`}
              aria-label="Toggle shuffle"
            >
              <BiShuffle size={18} />
            </button>
            <button
              onClick={onPlayPreviousSong}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous song"
            >
              <AiFillStepBackward size={22} />
            </button>
            <button
              onClick={handlePlay}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-foreground hover:scale-105 active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <Icon size={20} className="text-background" />
            </button>
            <button
              onClick={onPlayNextSong}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next song"
            >
              <AiFillStepForward size={22} />
            </button>
            <button
              onClick={player.cycleRepeat}
              className="transition-colors hover:text-foreground"
              aria-label="Toggle repeat"
            >
              {getRepeatIcon()}
            </button>
          </div>
        </div>

        {/* Volume controls - right */}
        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[140px]">
            <button
              onClick={player.toggleMute}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={player.isMuted ? 'Unmute' : 'Mute'}
            >
              <VolumeIcon size={22} />
            </button>
            <Slider 
              value={player.isMuted ? 0 : player.volume} 
              onChange={handleVolumeChange}
              max={1}
              step={0.01}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
