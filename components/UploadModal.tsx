'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import uniqid from 'uniqid';

import { useUploadModal } from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import { sanitizeErrorMessage } from '@/libs/helpers';

import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

export const UploadModal: React.FC = () => {
// File upload security constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit for security
const ALLOWED_AUDIO_TYPES = ['audio/mpeg'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  //* Initialising state and hooks
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  //* Using null for the files
  //* Initialise react-hook-form methods and set default form values
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }

      // Validate and sanitize user inputs to prevent security issues
      const sanitizedTitle = sanitizeInput(values.title);
      const sanitizedAuthor = sanitizeInput(values.author);

      if (!sanitizedTitle || !sanitizedAuthor) {
        toast.error('Title and author are required');
        return;
      }

      // Validate file uploads for security
      try {
        validateFileUpload(songFile, ALLOWED_AUDIO_TYPES, MAX_FILE_SIZE);
        validateFileUpload(imageFile, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Invalid file');
        return;
      }

      // Validate user ID to prevent unauthorized operations
      if (!user.id || user.id === 'undefined') {
        setIsLoading(false);
        return toast.error('Invalid user ID');
      }

      const uniqueID = uniqid();

      // Upload song to Supabase storage with secure file naming
      const { data: songData, error: songError } = await supabaseClient.storage
        .from('songs')
        .upload(`song-${sanitizedTitle}-${uniqueID}`, songFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed song upload.');
      }

      // Upload image to Supabase storage with secure file naming
      const { data: imageData, error: imageError } = await supabaseClient.storage
        .from('images')
        .upload(`image-${sanitizedTitle}-${uniqueID}`, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed image upload.');
      }

    }      // Validate user ID before database operation
      if (!user.id || user.id === 'undefined') {
        setIsLoading(false);
        return toast.error('Invalid user ID');
      }

      //* Insert new song record in the Supabase 'songs' table
      // Insert new song record with sanitized data
      const { error: supabaseError } = await supabaseClient.from('songs').insert({
        user_id: user.id,
        title: sanitizedTitle,
        author: sanitizedAuthor,
        image_path: imageData.path,
        song_path: songData.path,
      });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(sanitizeErrorMessage(supabaseError.message));
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song is created!');
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  //* Render the Modal component with a form to upload a new song
  return (
    <Modal
      title="Add a song"
      description="Upload a mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};
