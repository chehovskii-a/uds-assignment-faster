import { createElement, type ReactNode } from 'react';
import { ClearIcon } from './clear';
import { PlusIcon } from './plus';
import { SearchIcon } from './search';

const icons = {
  plus: PlusIcon,
  search: SearchIcon,
  clear: ClearIcon,
} as const;

export type IconName = keyof typeof icons;

export const iconOptions: IconName[] = Object.keys(icons) as IconName[];

export const iconMapping: Record<IconName, ReactNode> = {
  ...Object.fromEntries(
    Object.entries(icons).map(([name, Icon]) => [name, createElement(Icon)]),
  ),
} as Record<IconName, ReactNode>;
