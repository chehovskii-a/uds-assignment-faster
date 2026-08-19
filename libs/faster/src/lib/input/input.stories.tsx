import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';
import { expect, fn, userEvent } from 'storybook/test';

const meta = {
  component: Input,
  title: 'Input',
  args: {
    placeholder: 'Placeholder',
    onValueChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    helpText: { control: 'text' },
  },
} satisfies Meta<typeof Input>;
export default meta;

type Story = StoryObj<typeof Input>;

export const Playground = {
  args: {
    size: 'large',
  },
} satisfies Story;

export const Sizes = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Input {...args} size="large" />
      <Input {...args} size="medium" />
      <Input {...args} size="small" />
    </div>
  ),
} satisfies Story;

export const WithLeftIcon = {
  args: { leftIcon: <SearchIcon />, placeholder: 'Search' },
} satisfies Story;

export const WithRightIcon = {
  args: { rightIcon: <SearchIcon />, placeholder: 'Search' },
} satisfies Story;

export const WithPrefix = {
  args: { prefix: '$', placeholder: '0.00' },
} satisfies Story;

export const WithSuffix = {
  args: { suffix: 'USD', placeholder: '0.00' },
} satisfies Story;

export const Clearable = {
  args: { clearable: true, clearIcon: <CircleXIcon />, placeholder: 'Search', defaultValue: 'hello' },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Search');
    await userEvent.click(input);
    await expect(canvas.getByRole('button', { name: 'Clear input' })).toBeTruthy();
  },
} satisfies Story;

export const Invalid = {
  args: { invalid: true, helpText: 'This field is required', placeholder: 'Email' },
} satisfies Story;

export const Disabled = {
  args: { disabled: true, defaultValue: 'Disabled value' },
} satisfies Story;

export const HelpText = {
  args: { helpText: 'We will never share your email.', placeholder: 'Email' },
} satisfies Story;

export const ValueChangeInteraction = {
  args: { placeholder: 'Type here' },
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByPlaceholderText('Type here'), 'hello');
    await expect(args.onValueChange).toHaveBeenCalledWith('hello');
  },
} satisfies Story;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function CircleXIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.5 12.09-1.41 1.41L12 13.41l-2.09 2.09-1.41-1.41L10.59 12l-2.09-2.09 1.41-1.41L12 10.59l2.09-2.09 1.41 1.41L13.41 12l2.09 2.09z" />
    </svg>
  );
}
