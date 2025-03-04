import { UserDto } from '../../lib/dto/user.dto';
import { getRandomLanguage } from '../support/utils';
import { DocumentDto } from '../../lib/dto/document.dto';
import { emailTester } from '../support/constants';

describe('Document', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData: UserDto) => {
      cy.insertTestDocument(userData.id).then((document: DocumentDto) => {
        cy.wrap(document).as('content');
      });
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
  });

  it('should exist a link to navigate correctly to the statistics page', () => {
    const locale = getRandomLanguage();

    cy.get('@content').then((doc) => {
      const document = doc as unknown as DocumentDto;

      cy.visit(`/${locale}/app/contents`);

      const link = `/app/statistics/content/${document.id}`;

      cy.get(`a[href="${link}"]`).should('exist');
    });
  });

  it('should change the document name', () => {
    const locale = getRandomLanguage();

    cy.get('@content').then((doc) => {
      const document = doc as unknown as DocumentDto;

      cy.visit(`/${locale}/app/contents`);

      cy.getDictionary(locale, 'content').then((dictionary) => {
        cy.get(
          `[aria-label="${dictionary['edit-document']} ${document.filename}"]`,
        ).click();
      });

      const newName = 'New name';

      cy.get('input[name="name"]').clear().type('New name');

      cy.getDictionary(locale, 'content').then((dictionary) => {
        cy.contains('button', dictionary['update-document-name']).click();
      });

      cy.screenshot();

      cy.get('input[name="name"]').should('have.value', newName);

      cy.closeModal();

      cy.contains('a', newName).should('exist');
    });
  });

  it('should remove the document', () => {
    const locale = getRandomLanguage();

    cy.get('@content').then((doc) => {
      const document = doc as unknown as DocumentDto;

      cy.visit(`/${locale}/app/contents`);

      cy.getDictionary(locale, 'content').then((dictionary) => {
        cy.get(
          `[aria-label="${dictionary['edit-document']} ${document.filename}"]`,
        ).click();
      });

      cy.get('input[name="nameForDelete"]').type(document.filename);

      cy.screenshot();

      cy.getDictionary(locale, 'content').then((dictionary) => {
        cy.contains('button', dictionary['delete-document']).click();
      });

      cy.screenshot();
    });
  });
});
