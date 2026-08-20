import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';
import { expect, userEvent } from 'storybook/test';

import { SearchIcon } from '#/icons/search';

const meta = {
  component: Input.Root,
  title: 'Input',
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input.Root>;
export default meta;

type Story = StoryObj<typeof Input.Root>;

export const Playground = {
  args: { size: 'large' },
  render: (args) => (
    <Input.Root {...args}>
      <Input.Control placeholder="Placeholder" />
    </Input.Root>
  ),
} satisfies Story;

export const Sizes = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Input.Root {...args} size="large">
        <Input.Control placeholder="Large" />
      </Input.Root>
      <Input.Root {...args} size="medium">
        <Input.Control placeholder="Medium" />
      </Input.Root>
      <Input.Root {...args} size="small">
        <Input.Control placeholder="Small" />
      </Input.Root>
    </div>
  ),
} satisfies Story;

export const WithLeftIcon = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Adornment side="start">
        <SearchIcon />
      </Input.Adornment>
      <Input.Control placeholder="Search" />
    </Input.Root>
  ),
} satisfies Story;

export const WithRightIcon = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Control placeholder="Search" />
      <Input.Adornment side="end">
        <SearchIcon />
      </Input.Adornment>
    </Input.Root>
  ),
} satisfies Story;

export const WithPrefix = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Adornment side="start" chip>
        $
      </Input.Adornment>
      <Input.Control placeholder="0.00" />
    </Input.Root>
  ),
} satisfies Story;

export const WithSuffix = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Control placeholder="0.00" />
      <Input.Adornment side="end" chip>
        USD
      </Input.Adornment>
    </Input.Root>
  ),
} satisfies Story;

export const NumberVariant = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Control type="number" placeholder="0" />
    </Input.Root>
  ),
} satisfies Story;

export const Clearable = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Control placeholder="Search" defaultValue="hello" />
      <Input.Clear />
    </Input.Root>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Search');
    const clearButton = canvas.getByRole('button', { name: 'Clear input' });
    await expect(clearButton).not.toBeVisible();

    await userEvent.click(input);
    await expect(clearButton).toBeVisible();
  },
} satisfies Story;

export const ClearableWithSuffix = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Control placeholder="Amount" defaultValue="10" />
      <Input.Clear />
      <Input.Adornment side="end" chip>
        USD
      </Input.Adornment>
    </Input.Root>
  ),
} satisfies Story;

export const PrefixAndLeftIcon = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Adornment side="start" chip>
        $
      </Input.Adornment>
      <Input.Adornment side="start">
        <SearchIcon />
      </Input.Adornment>
      <Input.Control placeholder="0.00" />
    </Input.Root>
  ),
} satisfies Story;

export const Invalid = {
  render: (args) => (
    <div className="flex w-64 flex-col">
      <Input.Root {...args} invalid>
        <Input.Control placeholder="Email" aria-describedby="invalid-error" />
      </Input.Root>
      <Input.Error id="invalid-error">This field is required</Input.Error>
    </div>
  ),
} satisfies Story;

export const Disabled = {
  render: (args) => (
    <Input.Root {...args} disabled>
      <Input.Control placeholder="Search" defaultValue="Disabled value" />
    </Input.Root>
  ),
} satisfies Story;

export const HelpText = {
  render: (args) => (
    <div className="flex w-64 flex-col">
      <Input.Root {...args}>
        <Input.Control placeholder="Email" aria-describedby="help-hint" />
      </Input.Root>
      <Input.Help id="help-hint">We will never share your email.</Input.Help>
    </div>
  ),
} satisfies Story;

export const TypingInteraction = {
  render: (args) => (
    <Input.Root {...args}>
      <Input.Control placeholder="Type here" />
    </Input.Root>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Type here') as HTMLInputElement;
    await userEvent.type(input, 'hello');
    await expect(input.value).toBe('hello');
  },
} satisfies Story;
