import { emailRegisterTester, emailTester } from '../support/constants';
import { getRandomLanguage } from '../support/utils';
import { InvitationDto } from '../../lib/dto/invitation.dto';

describe('Invitation', () => {
  beforeEach(() => {
    cy.setCookiesForTests();
    cy.loginUser().then((userData) => {
      cy.wrap(userData).as('userData');
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
    cy.removeUser(emailRegisterTester);
  });

  it('should be able to invite a user', () => {
    const locale = getRandomLanguage();

    cy.visit(`/${locale}/app`);

    cy.logout();

    cy.screenshot();

    cy.getInvitation(emailTester).then((invitation: InvitationDto) => {
      cy.visit(invitation.invitationLink);

      cy.getDictionary(locale, 'invitation').then((dictionary) => {
        cy.contains('button', dictionary['accept-invitation']).click();
      });

      cy.url().should('include', `/${locale}/sign-up`);

      cy.screenshot();

      cy.get('input[name="email"]').type(emailRegisterTester);

      cy.getDictionary(locale, 'sign-up').then((dictionary) => {
        cy.contains('button', dictionary['title']).click();
      });

      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="password"]').type('123456');
      cy.get('input[name="passwordConfirmation"]').type('123456');

      cy.getDictionary(locale, 'sign-up').then((dictionary) => {
        cy.contains('button', dictionary['title']).click();
      });

      cy.wait(1000);

      cy.visit(`/${locale}/verification`);

      cy.url().should('include', `/${locale}/verification`);

      cy.getCodeOTP(emailRegisterTester).then((code) => {
        const stringCode = code.toString().padStart(6, '0');
        cy.request({
          method: 'POST',
          url: `/api/verification`,
          body: {
            code: stringCode,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      });

      cy.visit(`/${locale}/app`);
      cy.url().should('include', `/${locale}/app`);

      cy.getInvitation(emailTester).then((invitation: InvitationDto) => {
        expect(invitation.invitationCount).to.be.equal(1);
      });
    });
  });
});
