import { getRandomLanguage } from '../support/utils';
import { emailTester } from '../support/constants';
import { DocumentDto } from '../../lib/dto/document.dto';

describe('Sessions', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData) => {
      cy.insertTestDocument(userData.id).then((document) => {
        cy.wrap(document).as('document');
        cy.insertTestStudySession(userData.id, document.id).then(
          (sessionId) => {
            cy.wrap(sessionId).as('sessionId');
          },
        );
      });
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
  });

  // TODO: FIX ERROR
  it('should navigate correctly to the session from sessions page', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app/sessions`);

    cy.get('@sessionId').then((sessionId) => {
      cy.get(`a[href="/app/sessions/${sessionId}"]`).click();
      cy.url().should('contain', `/${locale}/app/sessions/${sessionId}`);
      cy.screenshot();
    });
  });

  it('should be able to delete a session', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app/sessions`);

    cy.get('@sessionId').then((sessionId) => {
      cy.get(`[data-cy="delete-session-${sessionId}-button"]`).click();
    });

    cy.screenshot();
  });
});
