//* Import tailwind-merge for combining Tailwind CSS classes.
import { twMerge } from 'tailwind-merge';

//* Define the props interface for the Box component.
interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

export const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
        bg-neutral-900
        rounded-lg
        h-fit
        w-full
        `,
        className
      )}
    >
      {children}
    </div>
  );
};
