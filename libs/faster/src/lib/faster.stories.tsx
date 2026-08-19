import type { Meta, StoryObj } from '@storybook/react-vite';
import { FasterFaster } from './faster';
import { expect } from 'storybook/test';

const meta = {
  component: FasterFaster,
  title: 'FasterFaster',
} satisfies Meta<typeof FasterFaster>;
export default meta;

type Story = StoryObj<typeof FasterFaster>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/FasterFaster/gi)).toBeTruthy();
  },
} satisfies Story;
