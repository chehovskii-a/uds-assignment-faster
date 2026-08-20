import { Button, Dialog } from '@chehovskii-a/faster';

export function DangerZone() {
  return (
    <section className="rounded-[4px] border border-border bg-white p-6">
      <h2 className="text-title font-medium text-neutral-700">Danger zone</h2>
      <p className="mt-1 text-body text-neutral-500">
        A confirmation Dialog gates the destructive action.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Dialog.Root>
          <Dialog.Trigger render={<Button variant="outline" />}>
            Archive workspace
          </Dialog.Trigger>
          <Dialog.Content size="medium" closedby="closerequest">
            <Dialog.Title showClose>Archive this workspace?</Dialog.Title>
            <Dialog.Description>
              Members lose access immediately. You can restore the workspace
              from the admin console within 30 days. This dialog ignores
              backdrop clicks, so the choice has to be explicit.
            </Dialog.Description>
            <Dialog.Footer>
              <Dialog.Close render={<Button variant="ghost" size="medium" />}>
                Keep it
              </Dialog.Close>
              <Dialog.Close render={<Button size="medium" />}>
                Archive
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
        <Button variant="link">Read the docs</Button>
        <Button variant="outline" disabled>
          Transfer ownership
        </Button>
      </div>
    </section>
  );
}
