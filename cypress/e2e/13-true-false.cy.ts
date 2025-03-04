import { emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';
import { DocumentDto } from '../../lib/dto/document.dto';

describe('True/False exercise', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData) => {
      cy.insertTestDocument(userData.id).then((document) => {
        cy.wrap(document).as('document');
      });
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
    cy.clearLocalStorage('exercises');
  });

  it('should be able to navigate execute correctly the true/false exercise workflow', () => {
    const locale = getRandomLanguage();

    cy.get('@document').then((doc) => {
      const document = doc as unknown as DocumentDto;

      cy.screenshot();

      cy.visit(`/${locale}/app/content/${document.id}/summaries/3`);

      cy.selectExercisesAndStartSession(locale, ['true-false'], document.id);

      cy.wait(15000);

      cy.url().should('include', `/${locale}/app/sessions`);
      cy.screenshot();

      cy.countNumberOfQuestions(locale).then((numberOfQuestions) => {
        for (let i = 0; i < numberOfQuestions; i++) {
          const elementToClick =
            Math.random() > 0.5 ? `true-selector-${i}` : `false-selector-${i}`;
          cy.get(`[data-cy="${elementToClick}"]`).click();
        }
      });

      cy.get("[data-cy='ask-button']").click();
      cy.get("textarea[name='text']").type(
        locale === 'es'
          ? '¿Quién era Nietzsche?{enter}'
          : 'Who was Nietzsche?{enter}',
      );

      cy.wait(5000);

      cy.screenshot();

      cy.get('[aria-label="Close"]').click();

      cy.getDictionary(locale, 'true-false').then((dictionary) => {
        cy.contains('button', dictionary['submit']).click();
      });

      cy.wait(1000);

      cy.get('[data-cy="explain-button"]').first().click();

      cy.wait(5000);

      cy.get('[aria-label="Close"]').click();

      cy.get('[data-cy="feedback-positive-button"]').first().click();
      cy.get('[data-cy="feedback-negative-button"]').first().click();

      cy.screenshot();
    });
  });
});
