import { getRandomLanguage } from '../support/utils';
import { emailRegisterTester, emailTester } from '../support/constants';

describe('Sign up navigation', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
  });

  it('should navigate to the sign up page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/sign-up`);
    cy.url().should('include', `/${locale}/sign-up`);

    cy.get('input[name="email"]')
      .type(emailRegisterTester)
      .should('have.value', emailRegisterTester);

    cy.screenshot();

    cy.getDictionary(locale, 'sign-up').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.get('input[name="name"]')
      .type('Test User')
      .should('have.value', 'Test User');

    cy.get('input[name="password"]')
      .type('123456')
      .should('have.value', '123456');

    cy.get('input[name="passwordConfirmation"]')
      .type('123456')
      .should('have.value', '123456');

    cy.screenshot();

    cy.getDictionary(locale, 'sign-up').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.screenshot();

    cy.wait(1000);

    cy.visit(`/${locale}/app`);
    cy.url().should('include', `/${locale}/verification`);

    cy.getCodeOTP(emailRegisterTester).then((code) => {
      const stringCode = code.toString().padStart(6, '0');
      cy.request({
        method: 'POST',
        url: `/api/verification`,
        body: {
          code: stringCode,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    cy.visit(`/${locale}/app`);
    cy.url().should('include', `/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').should('exist');

    cy.removeUser(emailRegisterTester);
  });

  it('should not allow to register with the same email', () => {
    cy.insertUserToDatabase({
      email: emailTester,
      name: 'TestUser',
      password: '123456',
      money: 150,
      isVerified: true,
    });

    const locale = getRandomLanguage();

    cy.visit(`/${locale}/sign-up`);

    cy.get('input[name="email"]').type(emailTester);

    cy.screenshot();

    cy.getDictionary(locale, 'sign-up').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="password"]').type('123456');
    cy.get('input[name="passwordConfirmation"]').type('123456');

    cy.getDictionary(locale, 'sign-up').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.url().should('include', `/${locale}/sign-up`);

    cy.getDictionary(locale, 'sign-up').then((dictionary) => {
      cy.contains('p', dictionary['error-email']).should('exist');
    });

    cy.removeUser(emailTester);
  });

  it('should allow a user to access the page after registering and logging out', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/sign-up`);
    cy.url().should('include', `/${locale}/sign-up`);

    cy.get('input[name="email"]')
      .type(emailRegisterTester)
      .should('have.value', emailRegisterTester);

    cy.screenshot();

    cy.getDictionary(locale, 'sign-up').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.get('input[name="name"]')
      .type('Test User')
      .should('have.value', 'Test User');

    cy.get('input[name="password"]')
      .type('123456')
      .should('have.value', '123456');

    cy.get('input[name="passwordConfirmation"]')
      .type('123456')
      .should('have.value', '123456');

    cy.screenshot();

    cy.getDictionary(locale, 'sign-up').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.screenshot();

    cy.wait(1000);

    cy.visit(`/${locale}/app`);
    cy.url().should('include', `/${locale}/verification`);

    cy.getCodeOTP(emailRegisterTester).then((code) => {
      const stringCode = code.toString().padStart(6, '0');
      cy.request({
        method: 'POST',
        url: `/api/verification`,
        body: {
          code: stringCode,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    cy.visit(`/${locale}/app`);
    cy.url().should('include', `/${locale}/app`);

    cy.logout();

    cy.visit(`/${locale}/sign-in`);

    cy.get('input[name="email"]').type(emailRegisterTester);
    cy.get('input[name="password"]').type('123456');

    cy.screenshot();

    cy.getDictionary(locale, 'sign-in').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.url().should('include', `/${locale}/app`);

    cy.removeUser(emailRegisterTester);
  });
});
