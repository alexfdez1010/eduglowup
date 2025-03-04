import { getRandomLanguage } from '../support/utils';

describe('Landing page navigation', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
  });

  it('should navigate to the landing page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}`);
    cy.url().should('include', `/${locale}`);

    cy.screenshot();
  });

  it('should navigate to the about page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/about`);
    cy.url().should('include', `/${locale}/about`);

    cy.screenshot();

    cy.getDictionary(locale, 'about').then((dictionary) => {
      cy.get('h1').should('have.text', dictionary['about-title']);
    });

    cy.screenshot();
  });

  it('should navigate to the cookies page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/cookies`);
    cy.url().should('include', `/${locale}/cookies`);

    cy.screenshot();
  });

  it('should navigate to the terms and conditions page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/terms`);
    cy.url().should('include', `/${locale}/terms`);

    cy.screenshot();
  });

  it('should navigate to the privacy policy page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/privacy`);
    cy.url().should('include', `/${locale}/privacy`);

    cy.screenshot();
  });
});
