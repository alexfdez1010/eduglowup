import { emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';
import { DocumentDto } from '../../lib/dto/document.dto';

describe('Quiz exercise', () => {
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

  it('should be able to navigate and execute correctly the quiz exercise workflow', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app/contents`);

    cy.get('@document').then((doc) => {
      const document = doc as unknown as DocumentDto;

      // Search for a href that contains the document id
      cy.contains('a', document.filename).click();

      cy.screenshot();

      cy.selectExercisesAndStartSession(locale, ['quiz'], document.id);

      cy.wait(10000);

      cy.url().should('include', `/${locale}/app/sessions`);
      cy.screenshot();

      cy.countNumberOfQuestions(locale).then((numberOfQuestions) => {
        for (let i = 0; i < numberOfQuestions; i++) {
          const randomIndex = Math.floor(Math.random() * 4);

          cy.get(`[data-cy="quiz-answer-${i}-${randomIndex}"]`).click();
        }
      });

      cy.getDictionary(locale, 'quiz').then((dictionary) => {
        cy.contains('button', dictionary['submit']).click();
      });

      cy.wait(1000);

      cy.get('[data-cy="explain-button"]').first().click();

      cy.wait(5000);

      cy.screenshot();

      cy.get('[aria-label="Close"]').click();

      cy.getDictionary(locale, 'sessions').then((dictionary) => {
        cy.contains('button', dictionary['next-exercise']).click();
      });

      cy.countNumberOfQuestions(locale).then((numberOfQuestions) => {
        for (let i = 0; i < numberOfQuestions; i++) {
          const randomIndex = Math.floor(Math.random() * 4);
          cy.get(`[data-cy="quiz-answer-${i}-${randomIndex}"]`).click();
        }
      });

      cy.screenshot();

      cy.get('[data-cy="feedback-positive-button"]').first().click();
      cy.get('[data-cy="feedback-negative-button"]').first().click();

      cy.getDictionary(locale, 'quiz').then((dictionary) => {
        cy.contains('button', dictionary['submit']).click();
      });

      cy.wait(1000);

      cy.screenshot();
    });
  });
});
