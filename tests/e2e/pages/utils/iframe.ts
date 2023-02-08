export const getIframeField = (selector: string) => {
  return cy.iframe().find(selector, { timeout: 50000 })
    .its('0.contentDocument.body', { timeout: 50000 }).should('not.be.empty')
    .then(cy.wrap);
};
