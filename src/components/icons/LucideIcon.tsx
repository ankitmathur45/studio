
"use client";
import React from 'react';
import * as icons from 'lucide-react';
import type { HabitSymbolName } from '@/types';
import { HABIT_ICON_LIST } from '@/lib/constants';

interface LucideIconProps extends icons.LucideProps {
  name: HabitSymbolName;
}

const LucideIcon: React.FC<LucideIconProps> = ({ name, ...props }) => {
  const iconEntry = HABIT_ICON_LIST.find(iconObj => iconObj.name === name);
  
  if (!iconEntry || !iconEntry.icon) {
    // Fallback icon if the specified name is not found
    const FallbackIcon = icons.HelpCircle;
    return <FallbackIcon {...props} />;
  }
  
  const IconComponent = iconEntry.icon as React.ElementType<icons.LucideProps>;
  return <IconComponent {...props} />;
};

export default LucideIcon;
