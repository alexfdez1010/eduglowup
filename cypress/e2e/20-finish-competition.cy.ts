import {
  emailRegisterTester,
  emailTester,
  emailTester2,
} from '../support/constants';
import {
  computeRewardsFriends,
  REWARDS_GENERAL,
} from '../../common/competition';

describe('Finish competition', () => {
  const initialMoney = 150;

  beforeEach(() => {
    cy.insertUserToDatabase({
      email: emailTester,
      name: 'Test',
      password: '123456',
      money: initialMoney,
      isVerified: true,
    });

    cy.insertUserToDatabase({
      email: emailTester2,
      name: 'Test2',
      password: '123456',
      money: initialMoney,
      isVerified: true,
    });

    cy.insertUserToDatabase({
      email: emailRegisterTester,
      name: 'Test3',
      password: '123456',
      money: initialMoney,
      isVerified: true,
    });
  });

  afterEach(() => {
    cy.removeUser(emailTester);
    cy.removeUser(emailTester2);
    cy.removeUser(emailRegisterTester);
  });

  it('the competition should be finished correctly', () => {
    cy.incrementScore(emailTester, 1_000_000);
    cy.incrementScore(emailTester2, 200_000);
    cy.incrementScore(emailRegisterTester, 300_000);

    cy.makeFriends(emailTester, emailTester2);
    cy.makeFriends(emailTester2, emailRegisterTester);

    cy.finishCompetition();

    const friendRewards = computeRewardsFriends(1);

    cy.getMoney(emailTester).then((result) => {
      expect(result).to.equal(
        initialMoney + REWARDS_GENERAL[0] + friendRewards[0],
      );
    });

    cy.getMoney(emailTester2).then((result) => {
      expect(result).to.equal(
        initialMoney + REWARDS_GENERAL[2] + computeRewardsFriends(2)[2],
      );
    });

    cy.getMoney(emailRegisterTester).then((result) => {
      expect(result).to.equal(
        initialMoney + REWARDS_GENERAL[1] + friendRewards[0],
      );
    });
  });
});
