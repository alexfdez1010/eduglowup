import { UserDto } from '../../lib/dto/user.dto';
import { emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';

describe('Configuration', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData: UserDto) => {
      cy.wrap(userData).as('userData');
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
  });

  it('should be able to logout', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app`);

    cy.logout();

    cy.screenshot();

    cy.url().should('include', `/${locale}/sign-in`);
  });

  it('should be able to modify user name', () => {
    const locale = getRandomLanguage();
    const newName = 'TestUser Modified';

    cy.visit(`/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(1).click();

    cy.screenshot();

    cy.get('input[name="name"]').clear().type(newName);

    cy.getDictionary(locale, 'configuration').then((dictionary) => {
      cy.contains('button', dictionary['update-name']).click();
    });

    cy.screenshot();

    cy.closeModal();

    cy.logout();

    cy.visit(`/${locale}/sign-in`);

    cy.get('input[name="email"]').type(emailTester);
    cy.get('input[name="password"]').type('123456');

    cy.screenshot();

    cy.getDictionary(locale, 'sign-in').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.url().should('include', `/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(1).click();

    cy.screenshot();

    cy.get('input[name="name"]').should('have.value', newName);
  });

  it('should be able to add a password if the user has logged in with Google and access the page after logging out', () => {
    cy.nullablePassword(emailTester);

    const locale = getRandomLanguage();
    cy.visit(`/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(1).click();

    cy.screenshot();

    cy.get('input[name="newPassword"]').type('12345678');

    cy.getDictionary(locale, 'configuration').then((dictionary) => {
      cy.contains('button', dictionary['update-password']).click();
    });

    cy.screenshot();

    cy.closeModal();

    cy.logout();

    cy.visit(`/${locale}/sign-in`);

    cy.get('input[name="email"]').type(emailTester);
    cy.get('input[name="password"]').type('12345678');

    cy.screenshot();

    cy.getDictionary(locale, 'sign-in').then((dictionary) => {
      cy.contains('button', dictionary['title']).click();
    });

    cy.url().should('include', `/${locale}/app`);
  });

  it('should not be able to modify the password is the old is incorrect', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(1).click();

    cy.screenshot();

    cy.get('input[name="oldPassword"]').type('12345678');
    cy.get('input[name="newPassword"]').type('12345678');

    cy.getDictionary(locale, 'configuration').then((dictionary) => {
      cy.contains('button', dictionary['update-password']).click();
    });

    cy.getDictionary(locale, 'configuration').then((dictionary) => {
      cy.contains('p', dictionary['error-password-old']).should('exist');
    });
  });

  it('should be able to access invitation code', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(3).click();

    cy.screenshot();
  });

  it('should be able to access the statistics page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(4).click();

    cy.url().should('include', `/${locale}/app/statistics`);

    cy.screenshot();
  });

  it('should be able to access the sessions page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(5).click();

    cy.url().should('include', `/${locale}/app/sessions`);

    cy.screenshot();
  });

  it('should be able to access the certificates page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(7).click();

    cy.url().should('include', `/${locale}/app/certificates`);

    cy.screenshot();
  });

  it('should be able to modify pomodoro configuration', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app`);

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(6).click();

    cy.screenshot();

    cy.get('[data-cy="pomodoro-enabled"]').find('span').eq(2).click();
    cy.get('input[name="usesPomodoro"]').should('have.value', 'false');

    cy.screenshot();

    cy.getDictionary(locale, 'configuration').then((dictionary) => {
      cy.contains('button', dictionary['save']).click();
    });

    cy.screenshot();

    cy.closeModal();

    cy.get('[data-cy="profile-avatar-button"]').click();
    cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(6).click();

    cy.get('input[name="usesPomodoro"]').should('have.value', 'false');
  });
});
