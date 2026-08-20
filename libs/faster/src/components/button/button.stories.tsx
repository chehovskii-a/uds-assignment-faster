import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, buttonVariants } from './button';
import { expect, fn, userEvent } from 'storybook/test';

import { PlusIcon } from '#/icons/plus';

const meta = {
  component: Button,
  title: 'Button',
  args: {
    children: 'Button',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
    iconOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground = {
  args: {
    variant: 'primary',
    size: 'large',
  },
} satisfies Story;

export const Primary = {
  args: { variant: 'primary' },
} satisfies Story;

export const Outline = {
  args: { variant: 'outline' },
} satisfies Story;

export const Ghost = {
  args: { variant: 'ghost' },
} satisfies Story;

export const Link = {
  args: { variant: 'link' },
} satisfies Story;

export const Sizes = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Button {...args} size="large" />
      <Button {...args} size="medium" />
      <Button {...args} size="small" />
    </div>
  ),
} satisfies Story;

export const WithIcons = {
  args: {
    leftIcon: <PlusIcon />,
    children: 'Add item',
  },
} satisfies Story;

export const IconOnly = {
  args: {
    iconOnly: true,
    'aria-label': 'Add item',
    children: <PlusIcon />,
  },
} satisfies Story;

export const Disabled = {
  args: { disabled: true },
} satisfies Story;

export const ClickInteraction = {
  args: { children: 'Click me' },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Click me' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
} satisfies Story;

export const AsAnchorViaButtonVariants = {
  render: () => (
    <a
      href="#settings"
      className={buttonVariants({ variant: 'primary', size: 'large' })}
    >
      Settings
    </a>
  ),
} satisfies Story;
