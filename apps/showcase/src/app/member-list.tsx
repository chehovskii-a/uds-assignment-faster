import { Button } from '@chehovskii-a/faster';

import { TrashIcon } from './icons';
import type { Member, ShowcaseAction } from './state';

interface MemberListProps {
  members: Member[];
  query: string;
  dispatch: (action: ShowcaseAction) => void;
}

export function MemberList({ members, query, dispatch }: MemberListProps) {
  if (members.length === 0) {
    return (
      <p className="py-6 text-center text-body text-neutral-500">
        No members match “{query}”.
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-border">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-subtitle text-neutral-700">
              {member.email}
            </p>
            <p className="text-caption text-neutral-500">{member.role}</p>
          </div>
          <Button
            variant="ghost"
            size="small"
            leftIcon={<TrashIcon />}
            disabled={member.role === 'Owner'}
            onClick={() => dispatch({ type: 'removal/requested', member })}
          >
            Remove
          </Button>
        </li>
      ))}
    </ul>
  );
}
