import { Song } from '@/types';
import { useSupabase } from '@/providers/SupabaseProvider';

export const useLoadSongUrl = (song: Song) => {
  const { supabase } = useSupabase();

  if (!song) {
    return '';
  }

  const { data: songData } = supabase.storage.from('songs').getPublicUrl(song.song_path);

  return songData.publicUrl;
};
