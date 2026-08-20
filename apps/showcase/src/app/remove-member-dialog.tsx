import { Button, Dialog } from '@chehovskii-a/faster';

import type { Member, ShowcaseAction } from './state';

interface RemoveMemberDialogProps {
  member: Member | null;
  dispatch: (action: ShowcaseAction) => void;
}

/** Controlled by the pending row rather than a trigger element. */
export function RemoveMemberDialog({
  member,
  dispatch,
}: RemoveMemberDialogProps) {
  return (
    <Dialog.Root
      open={member !== null}
      onOpenChange={(open) => !open && dispatch({ type: 'removal/dismissed' })}
    >
      <Dialog.Content size="small">
        <Dialog.Title showClose>Remove member?</Dialog.Title>
        <Dialog.Description>
          {member?.email} will lose access to this workspace right away.
        </Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost" size="medium" />}>
            Cancel
          </Dialog.Close>
          <Button
            size="medium"
            onClick={() => dispatch({ type: 'removal/confirmed' })}
          >
            Remove
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
