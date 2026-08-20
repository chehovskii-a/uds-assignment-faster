import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Input } from './input';

describe('Input', () => {
  it('renders a native input by default', () => {
    render(
      <Input.Root>
        <Input.Control placeholder="Search" />
      </Input.Root>,
    );

    const input = screen.getByPlaceholderText('Search');
    expect(input.tagName).toBe('INPUT');
  });

  it('fires onChange with typed value', () => {
    const onChange = jest.fn();
    render(
      <Input.Root>
        <Input.Control placeholder="Search" onChange={onChange} />
      </Input.Root>,
    );

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(input.value).toBe('hello');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('sets aria-invalid and data-invalid when invalid', () => {
    render(
      <Input.Root invalid>
        <Input.Control placeholder="Email" />
      </Input.Root>,
    );

    const input = screen.getByPlaceholderText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.closest('[data-invalid]')).toBeTruthy();
  });

  it('links Input.Error via aria-describedby', () => {
    render(
      <Input.Root invalid>
        <Input.Control placeholder="Email" aria-describedby="email-error" />
        <Input.Error id="email-error">Enter a valid email</Input.Error>
      </Input.Root>,
    );

    const input = screen.getByPlaceholderText('Email');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBe('email-error');
    expect(screen.getByText('Enter a valid email').id).toBe(describedBy);
  });

  it('disables the native input and marks the shell disabled from Input.Root', () => {
    render(
      <Input.Root disabled>
        <Input.Control placeholder="Search" />
      </Input.Root>,
    );

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.closest('[data-disabled]')).toBeTruthy();
  });

  it('lets Input.Control override the root disabled state', () => {
    render(
      <Input.Root disabled>
        <Input.Control placeholder="Search" disabled={false} />
      </Input.Root>,
    );

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  it('renders start and end adornments', () => {
    render(
      <Input.Root>
        <Input.Adornment side="start" data-testid="left">
          <span data-testid="left-icon" />
        </Input.Adornment>
        <Input.Control placeholder="Search" />
        <Input.Adornment side="end" data-testid="right">
          <span data-testid="right-icon" />
        </Input.Adornment>
      </Input.Root>,
    );

    expect(screen.getByTestId('left')).toBeTruthy();
    expect(screen.getByTestId('right')).toBeTruthy();
  });

  it('renders chip adornments for prefix/suffix content', () => {
    render(
      <Input.Root>
        <Input.Adornment side="start" chip>
          $
        </Input.Adornment>
        <Input.Control placeholder="0.00" />
        <Input.Adornment side="end" chip>
          USD
        </Input.Adornment>
      </Input.Root>,
    );

    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('USD')).toBeTruthy();
  });

  it('composes render prop onto a custom input element', () => {
    render(
      <Input.Root>
        <Input.Control
          placeholder="Search"
          render={<input placeholder="Search" data-testid="custom" />}
        />
      </Input.Root>,
    );

    expect(screen.getByTestId('custom').tagName).toBe('INPUT');
  });

  it('renders a native number input via the control type prop', () => {
    render(
      <Input.Root>
        <Input.Control type="number" placeholder="0" />
      </Input.Root>,
    );

    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    expect(input.type).toBe('number');
  });

  it('renders Input.Help', () => {
    render(
      <Input.Root>
        <Input.Control placeholder="Email" aria-describedby="email-hint" />
        <Input.Help id="email-hint">We will never share your email.</Input.Help>
      </Input.Root>,
    );

    expect(screen.getByText('We will never share your email.')).toBeTruthy();
  });

  it('marks Input.Clear hidden by default (visibility is CSS-only, see input.cy.tsx)', () => {
    render(
      <Input.Root>
        <Input.Control placeholder="Search" defaultValue="hello" />
        <Input.Clear />
      </Input.Root>,
    );

    expect(
      screen.getByRole('button', { name: 'Clear input' }).className,
    ).toContain('hidden');
  });

  it('clears an uncontrolled Input.Control and fires onChange', () => {
    const onChange = jest.fn();
    render(
      <Input.Root>
        <Input.Control
          placeholder="Search"
          defaultValue="hello"
          onChange={onChange}
        />
        <Input.Clear />
      </Input.Root>,
    );

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(input.value).toBe('hello');

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('clears a controlled Input.Control via onChange', () => {
    function Controlled() {
      const [value, setValue] = useState('hello');
      return (
        <Input.Root>
          <Input.Control
            placeholder="Search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Input.Clear />
        </Input.Root>
      );
    }

    render(<Controlled />);
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(input.value).toBe('hello');

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(input.value).toBe('');
  });
});
