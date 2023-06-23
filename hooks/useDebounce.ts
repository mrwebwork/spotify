import { useEffect, useState } from 'react';

//* Custom hook to implement a debounce feature for any value type.
export default function useDebounce<T>(value: T, delay?: number): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  //* Run the effect after every render when the 'value' or 'delay' changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay || 500);

    //* This will prevent setting state if the component unmounts before the delay has passed.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  //* Returning the debounced value.
  return debounceValue;
}
