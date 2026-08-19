import { render, screen, fireEvent } from '@testing-library/react';

import Dialog from './dialog';

function DeleteProjectDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Delete project</Dialog.Trigger>
      <Dialog.Content size="small">
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Close aria-label="Close">×</Dialog.Close>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close>Delete</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('starts closed by default', () => {
    render(<DeleteProjectDialog />);

    expect(screen.getByText('Delete project?').closest('dialog')?.hasAttribute('open')).toBe(false);
  });

  it('opens when the trigger is clicked', () => {
    render(<DeleteProjectDialog />);

    fireEvent.click(screen.getByText('Delete project'));

    expect(screen.getByText('Delete project?').closest('dialog')?.hasAttribute('open')).toBe(true);
    expect(screen.getByText('This action cannot be undone.')).toBeTruthy();
  });

  it('closes when a Dialog.Close is clicked', () => {
    render(<DeleteProjectDialog />);

    fireEvent.click(screen.getByText('Delete project'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('Delete project?').closest('dialog')?.hasAttribute('open')).toBe(false);
  });

  it('supports controlled open state via onOpenChange', () => {
    const onOpenChange = jest.fn();

    function Controlled() {
      return (
        <Dialog.Root open={true} onOpenChange={onOpenChange}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      );
    }

    render(<Controlled />);
    expect(screen.getByText('Title')).toBeTruthy();

    fireEvent.click(screen.getByText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('composes render prop behavior onto a custom element', () => {
    render(
      <Dialog.Root>
        <Dialog.Trigger render={<span role="link">Open link-styled trigger</span>} />
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    const trigger = screen.getByText('Open link-styled trigger');
    expect(trigger.tagName).toBe('SPAN');

    fireEvent.click(trigger);
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('throws when a part is used outside Dialog.Root', () => {
    expect(() => render(<Dialog.Trigger>Open</Dialog.Trigger>)).toThrow(
      /must be rendered inside <Dialog.Root>/,
    );
  });
});
