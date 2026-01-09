'use client';

import * as RadixSlider from '@radix-ui/react-slider';

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ 
  value = 1, 
  onChange, 
  max = 1, 
  step = 0.1,
  className = ''
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <RadixSlider.Root
      className={`
        relative flex items-center select-none touch-none w-full h-5 group cursor-pointer
        ${className}
      `}
      defaultValue={[value]}
      value={[value]}
      onValueChange={handleChange}
      max={max}
      step={step}
      aria-label="Slider"
    >
      <RadixSlider.Track
        className="
          bg-muted relative grow rounded-full h-1
          transition-all duration-150
          group-hover:h-1.5
        "
      >
        <RadixSlider.Range
          className="
            absolute bg-foreground rounded-full h-full
            group-hover:bg-primary
            transition-colors duration-150
          "
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="
          block w-3 h-3 bg-foreground rounded-full
          opacity-0 group-hover:opacity-100
          shadow-md shadow-black/50
          transition-all duration-150
          hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        "
      />
    </RadixSlider.Root>
  );
};
