'use client';

import { useEffect, useCallback } from 'react';
import { usePlayer } from './usePlayer';

export const useKeyboardShortcuts = () => {
  const player = usePlayer();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        player.setIsPlaying(!player.isPlaying);
        break;
      case 'KeyM':
        e.preventDefault();
        player.toggleMute();
        break;
      case 'KeyS':
        e.preventDefault();
        player.toggleShuffle();
        break;
      case 'KeyR':
        e.preventDefault();
        player.cycleRepeat();
        break;
      case 'ArrowUp':
        if (e.shiftKey) {
          e.preventDefault();
          player.setVolume(Math.min(1, player.volume + 0.1));
        }
        break;
      case 'ArrowDown':
        if (e.shiftKey) {
          e.preventDefault();
          player.setVolume(Math.max(0, player.volume - 0.1));
        }
        break;
    }
  }, [player]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
