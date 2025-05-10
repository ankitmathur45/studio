
"use client";
import { PREDEFINED_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">Color</label>
      <div className="grid grid-cols-6 gap-2">
        {PREDEFINED_COLORS.map((color) => (
          <button
            type="button"
            key={color}
            onClick={() => onSelectColor(color)}
            className={cn(
              "h-8 w-full rounded-md border-2 transition-all duration-150 ease-in-out",
              selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80',
              // Add border for very light colors to ensure visibility on white background
              (color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff') ? 'border-muted' : 'border-transparent'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
