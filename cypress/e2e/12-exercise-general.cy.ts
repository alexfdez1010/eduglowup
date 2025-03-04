import { emailTester } from '../support/constants';
import { getRandomLanguage, parseTime } from '../support/utils';
import { DocumentDto } from '../../lib/dto/document.dto';

describe('Exercises general', () => {
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

  it('should be able to navigate to the part summary from the study session page', () => {
    const locale = getRandomLanguage();

    cy.get('@sessionId').then((sessionId) => {
      cy.visit(`/${locale}/app/sessions/${sessionId}`);
    });

    cy.screenshot();

    cy.getDictionary(locale, 'sessions').then((dictionary) => {
      cy.get(`[aria-label="${dictionary['go-to-summary']}"]`).first().click();

      cy.get('[aria-label="Close"]').should('exist');

      cy.closeModal();
    });

    cy.screenshot();
  });

  it('should be able to access to the next exercise from the study session page', () => {
    const locale = getRandomLanguage();

    cy.get('@sessionId').then((sessionId) => {
      cy.visit(`/${locale}/app/sessions/${sessionId}`);
    });

    cy.screenshot();

    cy.getDictionary(locale, 'sessions').then((dictionary) => {
      cy.scrollTo('bottom');
      cy.screenshot();
      cy.contains('button', dictionary['next-exercise']).click();
    });

    cy.screenshot();
  });

  it('Pomodoro should work correctly', () => {
    const locale = getRandomLanguage();

    cy.get('@sessionId').then((sessionId) => {
      cy.visit(`/${locale}/app/sessions/${sessionId}`);
    });

    cy.screenshot();

    cy.scrollTo('top');

    cy.getDictionary(locale, 'sessions').then((dictionary) => {
      cy.get(`[aria-label="${dictionary['pomodoro-pause']}"]`).click();

      cy.get(`[aria-label="${dictionary['pomodoro-restart']}"]`).click();

      cy.get('[data-cy="pomodoro-time"]').then(($time) => {
        const time = parseTime($time.text());
        expect(time).to.be.equal(60 * 25);
      });

      cy.get(`[aria-label="${dictionary['pomodoro-increase']}"]`).click();

      cy.get('[data-cy="pomodoro-time"]').then(($time) => {
        const time = parseTime($time.text());
        expect(time).to.be.equal(60 * 26);
      });

      cy.get(`[aria-label="${dictionary['pomodoro-decrease']}"]`).click();

      cy.get('[data-cy="pomodoro-time"]').then(($time) => {
        const previousTime = parseTime($time.text());
        expect(previousTime).to.be.equal(60 * 25);
      });

      for (let i = 0; i < 25; i++) {
        cy.get(`[aria-label="${dictionary['pomodoro-decrease']}"]`).click();
      }

      cy.get('[data-cy="pomodoro-time"]').then(($time) => {
        const previousTime = parseTime($time.text());
        expect(previousTime).to.be.equal(60 * 5);
      });

      for (let i = 0; i < 5; i++) {
        cy.get(`[aria-label="${dictionary['pomodoro-decrease']}"]`).click();
      }

      cy.get('[data-cy="pomodoro-time"]').then(($time) => {
        const previousTime = parseTime($time.text());
        expect(previousTime).to.be.equal(60 * 25);
      });

      cy.get(`[aria-label="${dictionary['pomodoro-pause']}"]`).click();

      cy.wait(1000);

      cy.get('[data-cy="pomodoro-time"]').then(($time) => {
        const time = parseTime($time.text());
        expect(time).to.be.below(60 * 25);
      });
    });
  });
});
