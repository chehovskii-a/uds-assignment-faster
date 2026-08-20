import { type FormEvent } from 'react';
import { Button, Dialog, Input } from '@chehovskii-a/faster';

import { PlusIcon } from './icons';
import type { InviteState, Member, ShowcaseAction } from './state';

interface InviteMemberDialogProps {
  invite: InviteState;
  members: Member[];
  dispatch: (action: ShowcaseAction) => void;
}

/** Turns the control's own ValidityState into a message, so no regex is needed. */
function validationMessage(control: HTMLInputElement): string | null {
  if (control.validity.valueMissing) {
    return 'An email address is required.';
  }
  if (control.validity.typeMismatch) {
    return 'Enter a valid email address.';
  }
  return null;
}

export function InviteMemberDialog({
  invite,
  members,
  dispatch,
}: InviteMemberDialogProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const control = event.currentTarget.elements.namedItem(
      'invite-email',
    ) as HTMLInputElement;

    const message = validationMessage(control);
    if (message) {
      dispatch({ type: 'invite/rejected', error: message });
      return;
    }
    if (members.some((member) => member.email === control.value)) {
      dispatch({
        type: 'invite/rejected',
        error: 'This person is already a member.',
      });
      return;
    }
    dispatch({ type: 'invite/accepted', email: control.value });
  }

  const describedBy = invite.error ? 'invite-email-error' : 'invite-email-help';

  return (
    <Dialog.Root
      open={invite.open}
      onOpenChange={(open) => dispatch({ type: 'invite/toggled', open })}
    >
      <Dialog.Trigger render={<Button leftIcon={<PlusIcon />} />}>
        Invite member
      </Dialog.Trigger>
      <Dialog.Content size="small">
        <Dialog.Title showClose>Invite a member</Dialog.Title>
        <Dialog.Description>
          They will receive an email with a link to join this workspace.
        </Dialog.Description>
        {/* noValidate keeps the browser bubbles away; we render the messages inline. */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-4">
            <label
              htmlFor="invite-email"
              className="mb-1 block text-body font-medium text-neutral-700"
            >
              Email address
            </label>
            <Input.Root invalid={invite.error !== null}>
              <Input.Control
                id="invite-email"
                name="invite-email"
                type="email"
                required
                placeholder="name@taptap.io"
                value={invite.email}
                aria-describedby={describedBy}
                onChange={(event) =>
                  dispatch({
                    type: 'invite/emailChanged',
                    value: event.target.value,
                  })
                }
              />
              <Input.Clear
                onClick={() =>
                  dispatch({ type: 'invite/emailChanged', value: '' })
                }
              />
            </Input.Root>
            {invite.error ? (
              <Input.Error id="invite-email-error">{invite.error}</Input.Error>
            ) : (
              <Input.Help id="invite-email-help">
                Only work email addresses can be invited.
              </Input.Help>
            )}
          </div>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="ghost" size="medium" />}>
              Cancel
            </Dialog.Close>
            <Button type="submit" size="medium">
              Send invite
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
