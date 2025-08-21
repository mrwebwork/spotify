import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { log } from '@/libs/logger';

export const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    log.error('Session error when fetching songs by user ID', { message: sessionError.message });
    return [];
  }

  // Validate user ID before using in query
  const userId = sessionData.session?.user.id;
  if (!userId) {
    log.info('User not authenticated, returning empty songs list');
    return [];
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    log.error('Failed to fetch songs by user ID', { message: error.message });
    return [];
  }
  return (data as any) || [];
};
