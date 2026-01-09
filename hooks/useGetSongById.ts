import { Song } from '@/types';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

export const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { supabase } = useSupabase();

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error } = await supabase.from('songs').select('*').eq('id', id).single();

      if (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
      setSong(data as Song);
      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabase]);

  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song]
  );
};
