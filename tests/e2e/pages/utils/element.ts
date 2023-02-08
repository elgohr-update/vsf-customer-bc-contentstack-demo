export function el(selector: string, children?: string) {
  return children ? cy.get(`[data-e2e="${selector}"] ${children}, ${selector} ${children}`) : cy.get(`[data-e2e="${selector}"], ${selector}`);
}
