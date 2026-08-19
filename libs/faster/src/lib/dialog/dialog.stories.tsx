import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog';
import { expect } from 'storybook/test';

const meta = {
  component: Dialog,
  title: 'Dialog',
} satisfies Meta<typeof Dialog>;
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Dialog/gi)).toBeTruthy();
  },
} satisfies Story;
