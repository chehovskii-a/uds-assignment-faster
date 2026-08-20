export const getHeading = () => cy.get('h1');

export const getMemberRows = () => cy.get('main ul > li');

export const getSearchInput = () => cy.get('#member-search');

export const getInviteInput = () => cy.get('#invite-email');

export const getSearchClearButton = () =>
  getSearchInput().parent().find('button[aria-label="Clear input"]');

export const getOpenDialog = () => cy.get('dialog[open]');

export const getDialogs = () => cy.get('dialog');
