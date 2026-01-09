import { Song } from '@/types';
import { useSupabase } from '@/providers/SupabaseProvider';

export const useLoadImage = (song: Song) => {
  const { supabase } = useSupabase();

  if (!song) {
    return null;
  }

  const { data: imageData } = supabase.storage.from('images').getPublicUrl(song.image_path);

  return imageData.publicUrl;
};
