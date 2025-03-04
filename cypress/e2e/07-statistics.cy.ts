import { UserDto } from '../../lib/dto/user.dto';
import { DocumentDto } from '../../lib/dto/document.dto';
import { emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';

describe('Statistics', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData: UserDto) => {
      cy.insertTestDocument(userData.id).then((document: DocumentDto) => {
        cy.wrap(document).as('document');
      });
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
  });

  it('should be able to navigate correctly to the statistics page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app/statistics`);
    cy.url().should('include', `/${locale}/app/statistics`);

    cy.screenshot();
  });
});
