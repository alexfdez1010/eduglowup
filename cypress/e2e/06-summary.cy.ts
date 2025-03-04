import { UserDto } from '../../lib/dto/user.dto';
import { DocumentDto } from '../../lib/dto/document.dto';
import { getRandomLanguage } from '../support/utils';
import { emailTester } from '../support/constants';

describe('Summary', () => {
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

  it('should navigate correctly on the summaries page and be able to extend a summary', () => {
    const locale = getRandomLanguage();

    cy.get('@document').then((doc) => {
      const document = doc as unknown as DocumentDto;
      cy.visit(`/${locale}/app/content/${document.id}/summaries/1`);

      cy.url().should(
        'include',
        `/${locale}/app/content/${document.id}/summaries/1`,
      );

      cy.screenshot();

      cy.contains('li', '3').click();
      cy.url().should(
        'include',
        `/${locale}/app/content/${document.id}/summaries/3`,
      );

      // Let's wait for the summary to be generated
      cy.wait(10000);

      cy.visit(`/${locale}/app/content/${document.id}/summaries/1`);
      cy.url().should(
        'include',
        `/${locale}/app/content/${document.id}/summaries/1`,
      );

      cy.screenshot();
    });
  });
});
