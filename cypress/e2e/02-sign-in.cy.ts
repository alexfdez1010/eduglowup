import { UserWithPasswordDto } from '../../lib/dto/user.dto';
import { getRandomLanguage } from '../support/utils';
import { emailTester } from '../support/constants';

describe('Sign in navigation', () => {
  beforeEach(() => {
    cy.setCookiesForTests();

    const user: UserWithPasswordDto = {
      email: emailTester,
      name: 'TestUser',
      password: '123456',
      money: 100,
      isVerified: true,
    };

    cy.insertUserToDatabase(user).then((userData) => {
      cy.wrap(userData).as('userData');
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
  });

  it('should navigate to the sign in page', () => {
    const locale = getRandomLanguage();

    cy.getDictionary(locale, 'sign-in').then((dictionary) => {
      cy.visit(`/${locale}/sign-in`);
      cy.url().should('include', `/${locale}/sign-in`);

      cy.screenshot();

      cy.get('input[name="email"]')
        .type(emailTester)
        .should('have.value', emailTester);
      cy.get('input[name="password"]')
        .type('123456')
        .should('have.value', '123456');

      cy.screenshot();

      const textButton = dictionary['title'];

      cy.contains('button', textButton).click();

      cy.screenshot();

      cy.url().should('include', `/${locale}/app`);

      cy.screenshot();
    });
  });

  it('should not allow to login if the email/password is incorrect', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/sign-in`);
    cy.url().should('include', `/${locale}/sign-in`);

    cy.get('input[name="email"]').type(emailTester);
    cy.get('input[name="password"]').type('1234567');

    cy.screenshot();

    cy.getDictionary(locale, 'sign-in').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.url().should('include', `/${locale}/sign-in`);

    cy.getDictionary(locale, 'sign-in').then((dictionary) => {
      cy.contains('p', dictionary['error-credentials']).should('exist');
    });
  });
});
