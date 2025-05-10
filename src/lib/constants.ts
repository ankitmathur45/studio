import type { Habit, HabitSymbolName } from '@/types';
import { BarChart3, BookOpen, Coffee, DollarSign, Dumbbell, Heart, Moon, Smile, Sun, ThumbsDown, ThumbsUp, XCircle, Zap } from 'lucide-react';

export const MAX_HABITS = 15;

export const PREDEFINED_COLORS = [
  '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#EF476F', 
  '#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D', '#43AA8B', 
  '#577590', '#277DA1', '#6A0DAD', '#C3A1FF', '#FF7F50', '#FFBF00'
];

export const HABIT_ICON_LIST: { name: HabitSymbolName; icon: React.ElementType }[] = [
  { name: 'ThumbsUp', icon: ThumbsUp },
  { name: 'Smile', icon: Smile },
  { name: 'Coffee', icon: Coffee },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'ThumbsDown', icon: ThumbsDown },
  { name: 'XCircle', icon: XCircle },
  { name: 'Zap', icon: Zap },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Heart', icon: Heart },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Moon', icon: Moon },
  { name: 'Sun', icon: Sun },
  { name: 'BarChart3', icon: BarChart3 },
];


export const DEFAULT_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Exercise',
    color: PREDEFINED_COLORS[2],
    symbol: 'Dumbbell',
    isNegative: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Read 30 Mins',
    color: PREDEFINED_COLORS[3],
    symbol: 'BookOpen',
    isNegative: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Avoid Junk Food',
    color: PREDEFINED_COLORS[0],
    symbol: 'XCircle',
    isNegative: true,
    createdAt: new Date().toISOString(),
  },
];

export const APP_NAME = "Habitual";
