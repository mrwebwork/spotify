'use client';

import { Button } from './Button';

import { useUser } from '@/hooks/useUser';

import { FaUserAlt } from 'react-icons/fa';
import { RxCaretLeft } from 'react-icons/rx';
import { RxCaretRight } from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';

import { useRouter } from 'next/navigation';

import { twMerge } from 'tailwind-merge';

import { useAuthModal } from '@/hooks/useAuthModal';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { toast } from 'react-hot-toast';

//* Define the props interface for the Header component.
interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

//* Define the Header functional component.
export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  //* Use custom hooks and utilities.
  const authModal = useAuthModal();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  //* Define logout handler
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    //TODO: Reset any playing songs
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out!');
    }
  };
  //* Header component with navigation and login/logout.
  return (
    <div
      className={twMerge(
        `
        h-fit 
        bg-gradient-to-b
        from-emerald-800
        p-6
    `,
        className
      )}
    >
      <div
        className="
            w-full
            mb-4
            flex
            items-center
            justify-between
        "
      >
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <HiHome className="text-black" size={20} />
          </button>
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          {user ? (
            <div
              className="
                    flex
                    gap-x-4 
                    items-center
                    "
            >
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button onClick={() => router.push('/account')} className="bg-white">
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-transparent text-neutral-300 font-medium"
                >
                  Sign Up
                </Button>
              </div>
              <div>
                <Button onClick={authModal.onOpen} className="bg-white px-6 py-2">
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
