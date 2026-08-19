import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog, type DialogSize } from './dialog';
import { expect, userEvent, within } from 'storybook/test';

function DeleteProjectDialog({ size }: { size?: DialogSize }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="cursor-pointer text-body font-regular text-neutral-600">
        Delete project
      </Dialog.Trigger>
      <Dialog.Content size={size}>
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Close aria-label="Close" className="absolute right-6 top-6 cursor-pointer">
          ×
        </Dialog.Close>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close className="cursor-pointer text-body font-regular text-neutral-600">
            Cancel
          </Dialog.Close>
          <Dialog.Close className="cursor-pointer rounded-[4px] bg-primary-600 px-4 py-2 text-body font-medium text-white">
            Delete
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

const meta = {
  component: DeleteProjectDialog,
  title: 'Dialog',
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof DeleteProjectDialog>;
export default meta;

type Story = StoryObj<typeof DeleteProjectDialog>;

export const Small = {
  args: { size: 'small' },
} satisfies Story;

export const Medium = {
  args: { size: 'medium' },
} satisfies Story;

export const Large = {
  args: { size: 'large' },
} satisfies Story;

export const OpensOnTriggerClick = {
  args: { size: 'small' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText('Delete project'));

    const dialog = within(canvas.getByText('Delete project?').closest('dialog') as HTMLElement);
    await expect(dialog.getByText('This action cannot be undone.')).toBeTruthy();
  },
} satisfies Story;
