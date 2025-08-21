import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { log } from '@/libs/logger';

export const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) {
    log.info('User not authenticated, returning empty liked songs list');
    return [];
  }

  const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    log.error('Failed to fetch liked songs', error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    //* Spread relation
    ...item.songs,
  }));
};
