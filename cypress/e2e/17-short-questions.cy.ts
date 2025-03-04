import { DocumentDto } from '../../lib/dto/document.dto';
import { getRandomLanguage } from '../support/utils';
import { courseId, emailTester } from '../support/constants';

describe('Short questions exercise', () => {
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

  it('should be able to navigate and execute correctly the short questions exercise workflow', () => {
    const locale = getRandomLanguage();

    const text = 'Hello '.repeat(40);

    cy.get('@document').then((doc) => {
      const document = doc as unknown as DocumentDto;

      cy.visit(`/${locale}/app/courses/${courseId}/content/${document.id}`);

      cy.screenshot();

      cy.selectExercisesAndStartSession(
        locale,
        ['short-questions'],
        document.id,
      );

      cy.wait(5000);
      cy.url().should('include', `/${locale}/app/sessions`);
      cy.screenshot();

      cy.countNumberOfQuestions(locale).then((numberOfQuestions) => {
        for (let i = 0; i < numberOfQuestions; i++) {
          cy.get(`[data-cy="short-question-answer-${i}"]`).type(text);
        }
      });

      cy.getDictionary(locale, 'short-questions').then((dictionary) => {
        cy.contains('button', dictionary['submit']).click();
      });

      cy.wait(5000);

      cy.commonChecksExercises();
    });
  });
});
