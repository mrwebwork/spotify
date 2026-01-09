import { create } from 'zustand';

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  reset: () => void;
}

export const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'off',
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids: ids }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setVolume: (volume: number) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => {
    const { isMuted, volume } = get();
    set({ isMuted: !isMuted });
  },
  toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
  cycleRepeat: () => set((state) => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    return { repeatMode: modes[nextIndex] };
  }),
  reset: () => set({ ids: [], activeId: undefined, isPlaying: false }),
}));
