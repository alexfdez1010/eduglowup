import { courseId, emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';
import { DocumentDto } from '../../lib/dto/document.dto';

describe('Flashcards exercise', () => {
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

  it('should be able to navigate and execute correctly the flashcards exercise workflow', () => {
    const locale = getRandomLanguage();

    cy.get('@document').then((doc) => {
      const document = doc as unknown as DocumentDto;

      cy.visit(`/${locale}/app/courses/${courseId}/content/${document.id}`);

      cy.screenshot();

      cy.selectExercisesAndStartSession(locale, ['flashcards'], document.id);

      cy.wait(15000);
      cy.url().should('include', `/${locale}/app/sessions`);

      cy.countNumberOfQuestions(locale).then((numberOfQuestions) => {
        for (let i = 0; i < numberOfQuestions; i++) {
          const correctOrIncorrect =
            Math.random() > 0.5 ? 'correct' : 'incorrect';

          cy.getDictionary(locale, 'flashcards').then((dictionary) => {
            cy.get(
              `[aria-label="${i + 1}. ${dictionary[correctOrIncorrect]}"]`,
            ).click();

            if (correctOrIncorrect === 'correct') {
              cy.get(
                `[aria-label="${i + 1}. ${dictionary['rotate']}"]`,
              ).click();
            }
          });
        }
      });

      cy.getDictionary(locale, 'flashcards').then((dictionary) => {
        cy.contains('button', dictionary['submit']).click();
      });

      cy.wait(1000);

      cy.commonChecksExercises();
    });
  });
});
