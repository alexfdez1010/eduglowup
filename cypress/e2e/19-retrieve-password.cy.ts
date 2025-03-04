import { emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';

describe('Email password retrieval testing', () => {
  let password: string = '123456';

  beforeEach(() => {
    cy.setCookiesForTests();

    const user = {
      email: emailTester,
      name: 'TestUser',
      password: password,
      money: 200,
      isVerified: true,
    };

    cy.insertUserToDatabase(user).then((user) => {});
  });

  afterEach(() => {
    cy.removeUser(emailTester);
    cy.clearLocalStorage('exercises');
  });

  it('should be able to retrieve the password', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/sign-in`);

    cy.get('a[href="/retrieve-password"]').click();

    cy.screenshot();

    cy.wait(500);

    cy.get('[data-cy="email-retrieve-password"]').type(emailTester);

    cy.get('[data-cy="submit-retrieve-password"]').click();
  });
});
