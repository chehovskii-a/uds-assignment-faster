import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Input from './input';

describe('Input', () => {
  it('renders a native input by default', () => {
    render(<Input placeholder="Search" />);

    const input = screen.getByPlaceholderText('Search');
    expect(input.tagName).toBe('INPUT');
  });

  it('supports uncontrolled usage and fires onChange/onValueChange', () => {
    const onChange = jest.fn();
    const onValueChange = jest.fn();
    render(<Input placeholder="Search" onChange={onChange} onValueChange={onValueChange} />);

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(input.value).toBe('hello');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('hello');
  });

  it('supports controlled usage via value/onValueChange', () => {
    function Controlled() {
      const [value, setValue] = useState('initial');
      return <Input placeholder="Search" value={value} onValueChange={setValue} />;
    }

    render(<Controlled />);
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(input.value).toBe('initial');

    fireEvent.change(input, { target: { value: 'updated' } });
    expect(input.value).toBe('updated');
  });

  it('sets aria-invalid and data-invalid when invalid', () => {
    render(<Input placeholder="Email" invalid helpText="Enter a valid email" />);

    const input = screen.getByPlaceholderText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.closest('[data-invalid]')).toBeTruthy();
  });

  it('links helpText via aria-describedby', () => {
    render(<Input placeholder="Email" helpText="Enter a valid email" />);

    const input = screen.getByPlaceholderText('Email');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(screen.getByText('Enter a valid email').id).toBe(describedBy);
  });

  it('merges a caller-supplied aria-describedby with the generated help-text id', () => {
    render(<Input placeholder="Email" helpText="Enter a valid email" aria-describedby="external-hint" />);

    const input = screen.getByPlaceholderText('Email');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('external-hint');
    expect(describedBy).toContain(screen.getByText('Enter a valid email').id);
  });

  it('disables the native input and marks the shell disabled', () => {
    render(<Input placeholder="Search" disabled />);

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.closest('[data-disabled]')).toBeTruthy();
  });

  it('renders leftIcon and rightIcon', () => {
    render(
      <Input
        placeholder="Search"
        leftIcon={<span data-testid="left" />}
        rightIcon={<span data-testid="right" />}
      />,
    );

    expect(screen.getByTestId('left')).toBeTruthy();
    expect(screen.getByTestId('right')).toBeTruthy();
  });

  it('renders prefix and suffix', () => {
    render(<Input placeholder="0.00" prefix="$" suffix="USD" />);

    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('USD')).toBeTruthy();
  });

  it('shows the clear control only while focused and non-empty, and clears on click', () => {
    render(<Input placeholder="Search" clearable clearIcon={<span data-testid="clear-icon" />} />);

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(input.value).toBe('');
  });

  it('calls onClear when the clear control is activated', () => {
    const onClear = jest.fn();
    render(<Input placeholder="Search" clearable onClear={onClear} />);

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('composes render prop onto a custom input element', () => {
    render(<Input placeholder="Search" render={<input placeholder="Search" data-testid="custom" />} />);

    expect(screen.getByTestId('custom').tagName).toBe('INPUT');
  });
});
