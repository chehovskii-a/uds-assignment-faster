import { Input } from '@chehovskii-a/faster';

import { SearchIcon } from './icons';
import type { FilterState, ShowcaseAction } from './state';

interface MemberFiltersProps {
  filter: FilterState;
  dispatch: (action: ShowcaseAction) => void;
}

export function MemberFilters({ filter, dispatch }: MemberFiltersProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <div className="sm:flex-1">
        <label htmlFor="member-search" className="sr-only">
          Search members
        </label>
        <Input.Root>
          <Input.Adornment side="start">
            <SearchIcon />
          </Input.Adornment>
          <Input.Control
            id="member-search"
            placeholder="Search members"
            value={filter.query}
            onChange={(event) =>
              dispatch({ type: 'query/changed', value: event.target.value })
            }
          />
          <Input.Clear
            onClick={() => dispatch({ type: 'query/changed', value: '' })}
          />
        </Input.Root>
      </div>
      <div className="sm:w-48">
        <label htmlFor="seat-budget" className="sr-only">
          Monthly seat budget
        </label>
        <Input.Root size="medium">
          <Input.Adornment side="start" chip>
            $
          </Input.Adornment>
          <Input.Control
            id="seat-budget"
            type="number"
            min={0}
            value={filter.budget}
            onChange={(event) =>
              dispatch({ type: 'budget/changed', value: event.target.value })
            }
          />
          <Input.Adornment side="end" chip>
            USD
          </Input.Adornment>
        </Input.Root>
      </div>
    </div>
  );
}
