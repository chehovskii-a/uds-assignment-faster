import { render, screen } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('renders the showcase heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: 'Faster UI showcase' }),
    ).toBeTruthy();
  });

  it('lists the seeded members', () => {
    render(<App />);
    expect(screen.getByText('ada@taptap.io')).toBeTruthy();
    expect(screen.getByText('grace@taptap.io')).toBeTruthy();
    expect(screen.getByText('linus@taptap.io')).toBeTruthy();
  });
});
