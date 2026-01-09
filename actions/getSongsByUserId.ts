import { Song } from '@/types';
import { createClient } from '@/lib/supabase/server';

export const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return [];
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }
  return (data as any) || [];
};
