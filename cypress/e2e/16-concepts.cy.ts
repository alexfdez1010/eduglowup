import { courseId, emailTester } from '../support/constants';
import { DocumentDto } from '../../lib/dto/document.dto';
import { getRandomLanguage } from '../support/utils';

describe('Concepts exercise', () => {
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

  it('should be able to navigate and execute correctly the concepts exercise workflow', () => {
    const locale = getRandomLanguage();

    cy.get('@document').then((doc) => {
      const document = doc as unknown as DocumentDto;

      cy.visit(`/${locale}/app/create`);

      cy.get(`a[href="/app/courses/${courseId}"]`).click();

      cy.get(`a[href="/app/courses/${courseId}/content/${document.id}"]`).click();

      cy.screenshot();

      cy.selectExercisesAndStartSession(locale, ['concepts'], document.id);

      cy.wait(5000);
      cy.url().should('include', `/${locale}/app/sessions`);

      cy.countNumberOfQuestions(locale).then((numberOfQuestions) => {
        for (let i = 0; i < numberOfQuestions; i++) {
          const randomIndex = Math.floor(Math.random() * numberOfQuestions);

          cy.get(`[data-cy="concept-question-button-${i}"]`).click();

          cy.get(`[data-cy="concept-answer-${randomIndex}"]`).click();

          cy.get('[data-cy="feedback-positive-button"]').first().click();
        }
      });

      cy.getDictionary(locale, 'concepts').then((dictionary) => {
        cy.contains('button', dictionary['submit']).click();
      });

      cy.wait(1000);

      cy.commonChecksExercises();
    });
  });
});
