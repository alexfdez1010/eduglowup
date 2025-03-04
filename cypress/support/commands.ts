import { UserWithPasswordDto } from '../../lib/dto/user.dto';
import { emailTester } from './constants';
import { getRandomLanguage } from './utils';
import { CourseDto } from '../../lib/dto/course.dto';
import { UUID } from '../../lib/uuid';

declare global {
  namespace Cypress {
    interface Chainable {
      insertUserToDatabase(user: UserWithPasswordDto): Chainable;
      insertCourseToDatabase(userId: string): Chainable;
      loginUser(user?: UserWithPasswordDto): Chainable;
      removeUser(email: string): Chainable;
      setCookiesForTests(): Chainable;
      getCodeOTP(email: string): Chainable;
      logger(message: string): Chainable;
      getDictionary(locale: string, key: string): Chainable;
      insertTestDocument(userId: string): Chainable;
      insertTestStudySession(userId: string, documentId: string): Chainable;
      getInvitation(email: string): Chainable;
      selectExercisesAndStartSession(
        locale: string,
        exercises: string[],
        documentId: string,
      ): Chainable;
      commonChecksExercises(): Chainable;
      logout(): Chainable;
      nullablePassword(email: string): Chainable;
      closeModal(): Chainable;
      getTimeSpent(email: string): Chainable;
      countNumberOfQuestions(locale: string): Chainable;
      finishCompetition(): Chainable;
      incrementScore(email: string, score: number): Chainable;
      makeFriends(email1: string, email2: string): Chainable;
      getMoney(email: string): Chainable;
    }
  }
}

Cypress.Commands.add('getCodeOTP', (email) => {
  return cy.task('getCodeOTP', email).then((code) => {
    return code;
  });
});

Cypress.Commands.add('insertUserToDatabase', (user) => {
  const userData = cy.task('addToDatabaseUser', user).then((userData) => {
    return userData;
  });
  expect(userData).to.be.an('object');
  return userData;
});

Cypress.Commands.add('insertCourseToDatabase', (userId: string) => {
  const course: CourseDto = {
    id: UUID.generate(),
    title: 'Test 1 course',
    language: 'en',
    ownerId: userId,
  };

  const courseData = cy
    .task('addCourseToDatabase', course)
    .then((courseData) => {
      return courseData;
    });
  expect(courseData).to.be.an('object');
  return courseData;
});

Cypress.Commands.add('removeUser', (email: string) => {
  return cy.task('removeUser', email).then((result) => {
    expect(result).to.equal(true);
    return result;
  });
});

Cypress.Commands.add('loginUser', (user: UserWithPasswordDto) => {
  const locale = getRandomLanguage();

  if (!user) {
    user = {
      email: emailTester,
      name: 'TestUser',
      password: '123456',
      money: 200,
      isVerified: true,
    };
  }

  const userData = cy.insertUserToDatabase(user).then((user) => {
    return user;
  });

  cy.visit(`/${locale}/sign-in`);
  cy.url().should('include', `/${locale}/sign-in`);

  cy.get('input[name="email"]')
    .type(user.email)
    .should('have.value', user.email);
  cy.get('input[name="password"]')
    .type(user.password)
    .should('have.value', user.password);

  cy.getDictionary(locale, 'sign-in').then((dictionary) => {
    cy.contains('button', dictionary['title']).click();
  });

  cy.url().should('include', `/${locale}/app`);

  userData.then(() => {});

  return userData;
});

Cypress.Commands.add('logger', (message) => {
  cy.task('logger', message);
});

Cypress.Commands.add('setCookiesForTests', () => {
  cy.setCookie('analytics_consent', 'denied', {
    log: true,
  });
});

Cypress.Commands.add('getDictionary', (locale: string, key: string) => {
  return cy.task('getDictionaryOnCypress', { locale, key });
});

Cypress.Commands.add('insertTestDocument', (userId: string) => {
  cy.task('insertTestDocument', userId).then((document) => {
    return document;
  });
});

Cypress.Commands.add(
  'insertTestStudySession',
  (userId: string, documentId: string) => {
    cy.task('insertTestStudySession', { userId, documentId }).then(
      (sessionId) => {
        return sessionId;
      },
    );
  },
);

Cypress.Commands.add('getInvitation', (email: string) => {
  cy.task('getInvitation', email).then((invitation) => {
    return invitation;
  });
});

Cypress.Commands.add(
  'selectExercisesAndStartSession',
  (locale: string, exercises: string[], documentId: string) => {
    const allExercises = [
      'quiz',
      'true-false',
      'concepts',
      'flashcards',
      'short-questions',
    ];

    const exercisesToClick = allExercises.filter(
      (exercise) => !exercises.includes(exercise),
    );

    cy.getDictionary(locale, 'content').then((dictionary) => {
      cy.contains('button', dictionary['select-exercises']).click();
      for (const exercise of exercisesToClick) {
        cy.contains('div', dictionary[exercise]).click({ force: true });
      }
      cy.contains('button', dictionary['select-exercises']).click();
      cy.get(`[data-cy=start-session-button-${documentId}]`).click();
      cy.wait(100);
    });
  },
);

Cypress.Commands.add('commonChecksExercises', () => {
  cy.get('[data-cy="explain-button"]').first().click();

  cy.wait(5000);

  cy.screenshot();

  cy.get('[aria-label="Close"]').click();

  cy.get('[data-cy="feedback-positive-button"]').first().click();
  cy.get('[data-cy="feedback-negative-button"]').first().click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="profile-avatar-button"]').click();
  cy.get('[data-cy="configuration-dropdown-menu"]').find('li').eq(8).click();
});

Cypress.Commands.add('nullablePassword', (email: string) => {
  cy.task('nullablePassword', email).then((result) => {
    expect(result).to.equal(true);
    return result;
  });
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[aria-label="Close"]').click();
});

Cypress.Commands.add('getTimeSpent', (email: string) => {
  cy.task('getTimeSpent', email).then((result) => {
    expect(result).to.be.a('number');
    return result;
  });
});

Cypress.Commands.add('countNumberOfQuestions', (locale: string) => {
  cy.getDictionary(locale, 'sessions').then((dictionary) => {
    cy.get(`[aria-label="${dictionary['go-to-summary']}"]`).then(
      ($elements) => {
        return $elements.length;
      },
    );
  });
});

Cypress.Commands.add('finishCompetition', () => {
  cy.task('finishCompetition').then((result) => {
    expect(result).to.be.true;
    return result;
  });
});

Cypress.Commands.add('incrementScore', (email: string, score: number) => {
  cy.task('incrementScore', { email, score }).then((result) => {
    expect(result).to.be.true;
    return result;
  });
});

Cypress.Commands.add('makeFriends', (email1: string, email2: string) => {
  cy.task('makeFriends', { email1, email2 }).then((result) => {
    expect(result).to.be.true;
    return result;
  });
});

Cypress.Commands.add('getMoney', (email: string) => {
  cy.task('getMoney', email).then((result) => {
    expect(result).to.be.a('number');
    return result;
  });
});
