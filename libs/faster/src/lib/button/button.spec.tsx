import { render, screen, fireEvent } from '@testing-library/react';

import Button from './button';

describe('Button', () => {
  it('renders a native button by default', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveProperty('type', 'button');
  });

  it('fires onClick', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);

    fireEvent.click(screen.getByText('Save'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies the native disabled attribute by default', () => {
    render(<Button disabled>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not fire onClick when disabled', () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    fireEvent.click(screen.getByText('Save'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps the button focusable when focusableWhenDisabled is set', () => {
    render(
      <Button disabled focusableWhenDisabled>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
  });

  it('renders leftIcon and rightIcon around the label', () => {
    render(
      <Button leftIcon={<span data-testid="left" />} rightIcon={<span data-testid="right" />}>
        Continue
      </Button>,
    );

    expect(screen.getByTestId('left')).toBeTruthy();
    expect(screen.getByTestId('right')).toBeTruthy();
  });

  it('composes render prop onto a custom element', () => {
    render(
      <Button render={<a href="/settings">Settings</a>} nativeButton={false}>
        Settings
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/settings');
  });

  it('supports the render-as-function form with component state', () => {
    render(
      <Button
        disabled
        focusableWhenDisabled
        render={(props, state) => (
          <button {...props} data-loading={state.disabled || undefined}>
            Save
          </button>
        )}
      >
        Save
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Save' }).getAttribute('data-loading')).toBe('true');
  });
});
