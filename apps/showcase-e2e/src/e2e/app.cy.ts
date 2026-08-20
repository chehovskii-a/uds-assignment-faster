import {
  getDialogs,
  getHeading,
  getInviteInput,
  getMemberRows,
  getOpenDialog,
  getSearchClearButton,
  getSearchInput,
} from '../support/app.po';

describe('@faster/showcase-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('renders the showcase page', () => {
    getHeading().should('contain.text', 'Faster UI showcase');
    getMemberRows().should('have.length', 3);
  });

  it('filters members through the search Input', () => {
    getSearchInput().type('grace');
    getMemberRows().should('have.length', 1).should('contain.text', 'grace');

    getSearchInput().clear().type('nobody');
    getMemberRows().should('have.length', 0);
    cy.contains('No members match').should('be.visible');
  });

  it('clears the search Input via Input.Clear', () => {
    getSearchInput().type('ada');
    getMemberRows().should('have.length', 1);

    getSearchClearButton().should('be.visible').click();
    getSearchInput().should('have.value', '');
    getMemberRows().should('have.length', 3);
  });

  it('validates the invite Dialog before accepting a member', () => {
    cy.contains('button', 'Invite member').click();
    getOpenDialog().should('exist');

    getInviteInput().type('not-an-email');
    cy.contains('button', 'Send invite').click();
    cy.contains('Enter a valid email address.').should('be.visible');
    getInviteInput().should('have.attr', 'aria-invalid', 'true');

    getInviteInput().clear().type('ada@taptap.io');
    cy.contains('button', 'Send invite').click();
    cy.contains('This person is already a member.').should('be.visible');

    getInviteInput().clear().type('rob@taptap.io');
    cy.contains('button', 'Send invite').click();

    getDialogs().should('not.have.attr', 'open');
    getMemberRows().should('have.length', 4);
    cy.contains('rob@taptap.io').should('be.visible');
  });

  it('cancels the invite Dialog without adding a member', () => {
    cy.contains('button', 'Invite member').click();
    getInviteInput().type('nope@taptap.io');
    getOpenDialog().contains('button', 'Cancel').click();

    getDialogs().should('not.have.attr', 'open');
    getMemberRows().should('have.length', 3);
  });

  it('removes a member through the confirmation Dialog', () => {
    getMemberRows()
      .contains('li', 'grace@taptap.io')
      .contains('button', 'Remove')
      .click();

    cy.contains('Remove member?').should('be.visible');
    cy.contains('grace@taptap.io will lose access').should('be.visible');

    getOpenDialog().contains('button', 'Remove').click();

    getMemberRows().should('have.length', 2);
    cy.contains('grace@taptap.io').should('not.exist');
  });

  it('keeps the member when the removal Dialog is dismissed', () => {
    getMemberRows()
      .contains('li', 'linus@taptap.io')
      .contains('button', 'Remove')
      .click();
    getOpenDialog().contains('button', 'Cancel').click();

    getMemberRows().should('have.length', 3);
    cy.contains('linus@taptap.io').should('be.visible');
  });

  it('disables removal for the workspace owner', () => {
    getMemberRows()
      .contains('li', 'ada@taptap.io')
      .contains('button', 'Remove')
      .should('be.disabled');
  });

  it('closes the archive Dialog with the Escape key', () => {
    cy.contains('button', 'Archive workspace').click();
    getOpenDialog().should('contain.text', 'Archive this workspace?');

    getOpenDialog().find('button[aria-label="Close"]').type('{esc}');
    getDialogs().should('not.have.attr', 'open');
  });
});
