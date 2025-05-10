
"use client";
import { HABIT_ICON_LIST } from '@/lib/constants';
import type { HabitSymbolName } from '@/types';
import { cn } from '@/lib/utils';
import LucideIcon from '@/components/icons/LucideIcon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IconPickerProps {
  selectedIcon: HabitSymbolName;
  onSelectIcon: (iconName: HabitSymbolName) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">Symbol</label>
      <ScrollArea className="h-32 rounded-md border p-2">
        <div className="grid grid-cols-6 gap-2">
          {HABIT_ICON_LIST.map(({ name }) => (
            <button
              type="button"
              key={name}
              onClick={() => onSelectIcon(name)}
              className={cn(
                "flex h-10 w-full items-center justify-center rounded-md border transition-all duration-150 ease-in-out",
                selectedIcon === name ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : 'bg-muted hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label={`Select icon ${name}`}
            >
              <LucideIcon name={name} size={20} />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default IconPicker;
