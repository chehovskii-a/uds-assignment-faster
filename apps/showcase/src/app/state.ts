export type MemberRole = 'Owner' | 'Maintainer' | 'Viewer';

export interface Member {
  id: number;
  email: string;
  role: MemberRole;
}

export interface InviteState {
  open: boolean;
  email: string;
  error: string | null;
}

export interface FilterState {
  query: string;
  budget: string;
}

export interface ShowcaseState {
  members: Member[];
  filter: FilterState;
  invite: InviteState;
  pendingRemoval: Member | null;
}

export type ShowcaseAction =
  | { type: 'query/changed'; value: string }
  | { type: 'budget/changed'; value: string }
  | { type: 'invite/toggled'; open: boolean }
  | { type: 'invite/emailChanged'; value: string }
  | { type: 'invite/rejected'; error: string }
  | { type: 'invite/accepted'; email: string }
  | { type: 'removal/requested'; member: Member }
  | { type: 'removal/dismissed' }
  | { type: 'removal/confirmed' };

const initialInvite: InviteState = { open: false, email: '', error: null };

export const initialState: ShowcaseState = {
  members: [
    { id: 1, email: 'ada@taptap.io', role: 'Owner' },
    { id: 2, email: 'grace@taptap.io', role: 'Maintainer' },
    { id: 3, email: 'linus@taptap.io', role: 'Viewer' },
  ],
  filter: { query: '', budget: '250' },
  invite: initialInvite,
  pendingRemoval: null,
};

function filterReducer(
  state: FilterState,
  action: ShowcaseAction,
): FilterState {
  switch (action.type) {
    case 'query/changed':
      return { ...state, query: action.value };
    case 'budget/changed':
      return { ...state, budget: action.value };
    default:
      return state;
  }
}

function inviteReducer(
  state: InviteState,
  action: ShowcaseAction,
): InviteState {
  switch (action.type) {
    case 'invite/toggled':
      return action.open ? { ...initialInvite, open: true } : initialInvite;
    case 'invite/emailChanged':
      return { ...state, email: action.value, error: null };
    case 'invite/rejected':
      return { ...state, error: action.error };
    default:
      return state;
  }
}

function removalReducer(
  state: Member | null,
  action: ShowcaseAction,
): Member | null {
  switch (action.type) {
    case 'removal/requested':
      return action.member;
    case 'removal/dismissed':
      return null;
    default:
      return state;
  }
}

export function showcaseReducer(
  state: ShowcaseState,
  action: ShowcaseAction,
): ShowcaseState {
  // Actions that span more than one slice are resolved here; the rest delegate.
  switch (action.type) {
    case 'invite/accepted':
      return {
        ...state,
        members: [
          ...state.members,
          { id: Date.now(), email: action.email, role: 'Viewer' },
        ],
        invite: initialInvite,
      };
    case 'removal/confirmed':
      return {
        ...state,
        members: state.members.filter(
          (member) => member.id !== state.pendingRemoval?.id,
        ),
        pendingRemoval: null,
      };
    default:
      return {
        ...state,
        filter: filterReducer(state.filter, action),
        invite: inviteReducer(state.invite, action),
        pendingRemoval: removalReducer(state.pendingRemoval, action),
      };
  }
}

export function filterMembers(members: Member[], query: string): Member[] {
  const term = query.trim().toLowerCase();
  return term
    ? members.filter((member) => member.email.toLowerCase().includes(term))
    : members;
}
