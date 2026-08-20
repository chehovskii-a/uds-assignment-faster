import { Input } from './input';

describe('Input', () => {
  it('renders and accepts typed input', () => {
    cy.mount(
      <Input.Root>
        <Input.Control placeholder="Search" />
      </Input.Root>,
    );

    cy.get('input').type('hello').should('have.value', 'hello');
  });

  it('does not accept input when disabled', () => {
    cy.mount(
      <Input.Root disabled>
        <Input.Control placeholder="Search" />
      </Input.Root>,
    );

    cy.get('input').should('be.disabled');
  });

  it('marks the field invalid and links Input.Error', () => {
    cy.mount(
      <Input.Root invalid>
        <Input.Control placeholder="Email" aria-describedby="err" />
        <Input.Error id="err">Enter a valid email</Input.Error>
      </Input.Root>,
    );

    cy.get('input').should('have.attr', 'aria-invalid', 'true');
    cy.contains('Enter a valid email').should('be.visible');
  });

  it('renders start/end adornments', () => {
    cy.mount(
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

    cy.contains('$').should('be.visible');
    cy.contains('USD').should('be.visible');
  });

  it('shows Input.Clear only while focused and non-empty, and resets on click', () => {
    cy.mount(
      <Input.Root>
        <Input.Control placeholder="Search" defaultValue="hello" />
        <Input.Clear />
      </Input.Root>,
    );

    cy.get('button[aria-label="Clear input"]').should('not.be.visible');
    cy.get('input').focus();
    cy.get('button[aria-label="Clear input"]').should('be.visible').click();
    cy.get('input').should('have.value', '');
  });
});
