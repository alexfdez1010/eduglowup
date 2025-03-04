import { CourseDto } from '../../lib/dto/course.dto';
import { UserWithPasswordDto } from '../../lib/dto/user.dto';
import { emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';

describe('Generate content', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData: UserWithPasswordDto) => {
      cy.wrap(userData).as('userData');
      cy.insertCourseToDatabase(userData.id).then((course: CourseDto) => {
        cy.wrap(course).as('course');
      });
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
  });

  it('should be able to generate content correctly', () => {
    const locale = getRandomLanguage();
    const topic = 'Teoría de juegos';

    cy.get('@course').then((cs) => {
      const course = cs as unknown as CourseDto;

      cy.visit(`/${locale}/app/courses/${course.id}`);
      cy.url().should('include', `/app/courses/${course.id}`);
    });

    cy.getDictionary(locale, 'content').then((dictionary) => {
      cy.contains('button', dictionary['upload-notes']).click();
      cy.contains('div', dictionary['generate-notes']).click();

      cy.get('input[name="topic"]').type(topic);
      cy.get('textarea[name="description"]').type(
        'Conceptos básicos de teoría de juegos',
      );

      cy.screenshot();

      cy.contains('button', dictionary['generate-notes']).click();
    });

    cy.wait(20000);

    cy.closeModal();

    cy.getDictionary(locale, 'content').then((dictionary) => {
      cy.get(`[aria-label="${dictionary['edit-document']} ${topic}"]`).should(
        'exist',
      );
    });
  });
});
