import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog, type DialogSize } from './dialog';
import { Button } from '../button/button';
import { expect, userEvent, within } from 'storybook/test';

function DeleteProjectDialog({ size }: { size?: DialogSize }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="ghost" />}>
        Delete project
      </Dialog.Trigger>
      <Dialog.Content size={size}>
        <Dialog.Title showClose>Delete project?</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost" size="medium" />}>
            Cancel
          </Dialog.Close>
          <Dialog.Close render={<Button variant="primary" size="medium" />}>
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

    const dialog = within(
      canvas.getByText('Delete project?').closest('dialog') as HTMLElement,
    );
    await expect(
      dialog.getByText('This action cannot be undone.'),
    ).toBeTruthy();
  },
} satisfies Story;
