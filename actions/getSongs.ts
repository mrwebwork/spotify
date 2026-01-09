import { Song } from '@/types';
import { createClient } from '@/lib/supabase/server';

export const getSongs = async (): Promise<Song[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
  }

  return (data as any) || [];
};
