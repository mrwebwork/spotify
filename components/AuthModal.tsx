'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { Modal } from './Modal';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/hooks/useAuthModal';
import { Button } from './Button';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface AuthFormData {
  email: string;
  password: string;
}

export const AuthModal = () => {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormData>();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
      reset();
    }
  }, [session, router, onClose, reset]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
      reset();
      setIsSignUp(false);
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          },
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Check your email to confirm your account!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back!');
          router.refresh();
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
      },
    });
    
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isSignUp ? 'Create an account' : 'Welcome back'}
      description={isSignUp ? 'Sign up to start listening' : 'Login to your account'}
      isOpen={isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">Email</label>
          <input
            type="email"
            disabled={isLoading}
            {...register('email', { required: 'Email is required' })}
            placeholder="your@email.com"
            className="w-full rounded-md bg-neutral-700 border border-transparent px-3 py-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">Password</label>
          <input
            type="password"
            disabled={isLoading}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            placeholder="Your password"
            className="w-full rounded-md bg-neutral-700 border border-transparent px-3 py-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
          )}
        </div>

        <Button disabled={isLoading} type="submit" className="bg-emerald-500 text-black font-bold py-3 mt-2">
          {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </Button>

        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-700" />
          </div>
          <div className="relative bg-neutral-800 px-4 text-sm text-neutral-400">or</div>
        </div>

        <Button
          type="button"
          onClick={handleGitHubSignIn}
          disabled={isLoading}
          className="bg-neutral-700 text-white font-medium py-3 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </Button>

        <p className="text-neutral-400 text-sm text-center mt-2">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white underline hover:text-emerald-400 transition"
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </form>
    </Modal>
  );
};
