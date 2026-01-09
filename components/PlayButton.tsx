import { FaPlay } from 'react-icons/fa';

export const PlayButton = () => {
  return (
    <button
      className="
        flex items-center justify-center
        rounded-full
        bg-primary text-primary-foreground
        p-4
        opacity-0 
        translate-y-2
        shadow-lg shadow-primary/30
        transition-all duration-300 ease-out
        group-hover:opacity-100
        group-hover:translate-y-0
        hover:scale-105 hover:shadow-xl hover:shadow-primary/40
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
      "
      aria-label="Play"
    >
      <FaPlay className="text-primary-foreground ml-0.5" size={16} />
    </button>
  );
};
