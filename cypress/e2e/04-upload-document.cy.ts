import { UserWithPasswordDto } from '../../lib/dto/user.dto';
import { getRandomLanguage } from '../support/utils';
import { emailTester } from '../support/constants';
import { DocumentDto } from '../../lib/dto/document.dto';
import { CourseDto } from '../../lib/dto/course.dto';
import { UUID } from '../../lib/uuid';

describe('Upload document', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData: UserWithPasswordDto) => {
      cy.insertCourseToDatabase(userData.id).then((course: CourseDto) => {
        cy.wrap(course).as('course');
      });
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
  });

  it('should upload a document correctly', () => {
    const documentName = 'JDo_classguide_en-US.pdf';
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app/create`);
    cy.screenshot();

    cy.get('[data-cy="explore-course-link"]').click();

    cy.get('@course').then((cs) => {
      const course = cs as unknown as CourseDto;

      cy.visit(`/${locale}/app/courses/${course.id}`);
      cy.url().should('include', `/app/courses/${course.id}`);

      cy.wait(100);
      cy.screenshot();

      cy.get('[data-cy="upload-content"]').click();
      cy.wait(100);
      cy.screenshot();

      cy.get('[data-cy="upload-document"]').click();
      cy.wait(100);
      cy.screenshot();

      cy.get('input[name="document"]').selectFile(
        'cypress/fixtures/documents/' + documentName,
        { force: true },
      );

      cy.screenshot();

      cy.get('[data-cy="upload-document-button"]').click();

      cy.wait(30000);

      cy.screenshot();

      cy.get('[data-cy="explore-content-link"]').should('exist');
    });
  });

  it('should not allow to upload a file that is too short', () => {
    const documentName = 'short_file.pdf';
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app/create`);
    cy.screenshot();

    cy.get('[data-cy="explore-course-link"]').click();

    cy.getDictionary(locale, 'content').then((dictionary) => {
      cy.get('@course').then((cs) => {
        const course = cs as unknown as CourseDto;

        cy.visit(`/${locale}/app/courses/${course.id}`);
        cy.url().should('include', `/app/courses/${course.id}`);

        cy.wait(100);
        cy.screenshot();

        cy.get('[data-cy="upload-content"]').click();
        cy.wait(100);
        cy.screenshot();

        cy.get('[data-cy="upload-document"]').click();
        cy.wait(100);
        cy.screenshot();

        cy.get('input[name="document"]').selectFile(
          'cypress/fixtures/documents/' + documentName,
          { force: true },
        );
        cy.get('[data-cy="upload-document-button"]').click();

        cy.contains(dictionary['file-too-short']).should('exist');
      });
    });
  });
});
