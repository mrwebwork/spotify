'use client';

import { Button } from './Button';

import { usePlayer } from '@/hooks/usePlayer';
import { useUser } from '@/hooks/useUser';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useSupabase } from '@/providers/SupabaseProvider';

import { FaUserAlt } from 'react-icons/fa';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';

import { useRouter } from 'next/navigation';

import { twMerge } from 'tailwind-merge';

import { toast } from 'react-hot-toast';

//* Define the props interface for the Header component.
interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();
  const { supabase } = useSupabase();
  const { user } = useUser();
  const player = usePlayer();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out!');
    }
  };

  return (
    <header
      className={twMerge(
        'h-fit bg-gradient-to-b from-primary/20 to-transparent p-6 rounded-t-lg',
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors p-1"
            aria-label="Go back"
          >
            <RxCaretLeft className="text-foreground" size={28} />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors p-1"
            aria-label="Go forward"
          >
            <RxCaretRight className="text-foreground" size={28} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push('/')}
            className="rounded-full p-2.5 bg-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Home"
          >
            <HiHome className="text-background" size={18} />
          </button>
          <button
            onClick={() => router.push('/search')}
            className="rounded-full p-2.5 bg-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Search"
          >
            <BiSearch className="text-background" size={18} />
          </button>
        </div>
        <div className="flex items-center gap-x-3">
          {user ? (
            <div className="flex gap-x-3 items-center">
              <Button 
                onClick={handleLogout} 
                variant="secondary"
                size="sm"
              >
                Logout
              </Button>
              <Button 
                onClick={() => router.push('/account')} 
                variant="default"
                size="icon"
                className="h-9 w-9"
                aria-label="Account"
              >
                <FaUserAlt size={14} />
              </Button>
            </div>
          ) : (
            <>
              <Button
                onClick={authModal.onOpen}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Up
              </Button>
              <Button 
                onClick={authModal.onOpen}
                variant="default"
                size="sm"
              >
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
      {children}
    </header>
  );
};
