import { UserWithPasswordDto } from '../../lib/dto/user.dto';
import { getRandomLanguage } from '../support/utils';
import { CourseDto } from '../../lib/dto/course.dto';


describe('Upload audio', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData: UserWithPasswordDto) => {
      cy.insertCourseToDatabase(userData.id).then((course: any) => {
        cy.wrap(course).as('course');
      });
    });
  });


  it('should upload audio', () => {

    const audioName = 'audio-test.mp3';
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


      cy.get('[data-cy="upload-audio"]').click();
      cy.wait(100);
      cy.screenshot();

      cy.get('input[name="document"]').selectFile(
        'cypress/fixtures/audios/' + audioName,
        { force: true },
      );

      cy.screenshot();
      cy.get('[data-cy="upload-audio-button"]').click();

      cy.wait(30000);

      cy.screenshot();

      cy.get('[data-cy="explore-content-link"]').should('exist');

    });
  });

});