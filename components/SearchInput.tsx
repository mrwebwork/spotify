'use client';

import qs from 'query-string';
import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Input } from './Input';
import { BiSearch, BiX } from 'react-icons/bi';

export const SearchInput = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>('');
  const debouncedValue = useDebounce<string>(value, 400);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    const url = qs.stringifyUrl({
      url: '/search',
      query: query,
    });
    router.push(url);
  }, [debouncedValue, router]);

  const clearSearch = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative group">
      <BiSearch 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" 
        size={20} 
      />
      <Input
        ref={inputRef}
        placeholder="What do you want to listen to?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-12 pr-10 bg-secondary/50 focus:bg-secondary"
      />
      {value && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary"
          aria-label="Clear search"
        >
          <BiX size={20} />
        </button>
      )}
    </div>
  );
};
