import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Validate user ID before using in query
  const userId = session?.user?.id;
  if (!userId) {
    console.log('User not authenticated or missing ID');
    return [];
  }

  const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
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
