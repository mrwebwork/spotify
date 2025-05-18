'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuthModal } from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';

import { useSessionContext } from '@supabase/auth-helpers-react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

interface LikeButtonProps {
  songId: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();

  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  //* Check if song is liked or not
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    // Make sure we have valid IDs
    if (!songId || songId === 'undefined') {
      console.error('Invalid song ID');
      return;
    }

    const fetchData = async () => {
      //* Find song in liked_songs table
      const { data, error } = await supabaseClient
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  //* Dynamically render icon if the song is liked or not
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    // Validate user ID and song ID
    if (!user.id || user.id === 'undefined') {
      toast.error('User ID is invalid');
      return;
    }

    if (!songId || songId === 'undefined') {
      toast.error('Song ID is invalid');
      return;
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabaseClient.from('liked_songs').insert({
        song_id: songId,
        user_id: user.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success('Liked!');
      }
    }

    router.refresh();
  };

  return (
    <button
      onClick={handleLike}
      className="
        hover:opacity-75
        transition
        "
    >
      <Icon color={isLiked ? '#1DB954' : 'white'} size={25} />
    </button>
  );
};
