import { UserWithPasswordDto } from '../../lib/dto/user.dto';
import { emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';

describe('Upload document', () => {
  let types = beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData: UserWithPasswordDto) => {
      cy.wrap(userData).as('userData');
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
  });

  it('Should create a course with document and publish it', () => {
    const documentName = 'JDo_classguide_en-US.pdf';
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app/create`);

    cy.get('[data-cy="create-course-button"]').click();
    cy.screenshot();

    cy.get('[data-cy="create-course-name"]').type('Test 1 course');
    cy.get('[data-cy="create-course-submit"]').click();

    cy.wait(500);
    cy.screenshot();
  });
});
