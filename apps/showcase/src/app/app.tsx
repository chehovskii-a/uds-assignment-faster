import { useMemo, useReducer } from 'react';

import { DangerZone } from './danger-zone';
import { InviteMemberDialog } from './invite-member-dialog';
import { MemberFilters } from './member-filters';
import { MemberList } from './member-list';
import { RemoveMemberDialog } from './remove-member-dialog';
import { filterMembers, initialState, showcaseReducer } from './state';

export function App() {
  const [state, dispatch] = useReducer(showcaseReducer, initialState);
  const { members, filter, invite, pendingRemoval } = state;

  const visibleMembers = useMemo(
    () => filterMembers(members, filter.query),
    [members, filter.query],
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 bg-neutral-50 px-6 py-10 font-regular">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 font-medium text-neutral-700">
            Faster UI showcase
          </h1>
          <p className="mt-1 text-body text-neutral-500">
            Team access for the TapTap workspace, built with Button, Input and
            Dialog.
          </p>
        </div>
        <InviteMemberDialog
          invite={invite}
          members={members}
          dispatch={dispatch}
        />
      </header>

      <section className="rounded-[4px] border border-border bg-white p-6">
        <h2 className="text-title font-medium text-neutral-700">
          Members
          <span className="ml-2 text-body font-regular text-neutral-500">
            {members.length}
          </span>
        </h2>
        <MemberFilters filter={filter} dispatch={dispatch} />
        <MemberList
          members={visibleMembers}
          query={filter.query}
          dispatch={dispatch}
        />
      </section>

      <DangerZone />

      <RemoveMemberDialog member={pendingRemoval} dispatch={dispatch} />
    </main>
  );
}

export default App;
