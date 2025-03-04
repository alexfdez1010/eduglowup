import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvitationService } from '@/lib/services/invitation-service';
import { UserRepository } from '@/lib/repositories/interfaces';
import { fakeDate, fakeInt, fakeUuid } from '../fake';
import { InvitationMother, UserMother } from '../object-mothers';

describe('InvitationService', () => {
  let invitationService: InvitationService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = {
      getInvitationOfUser: vi.fn(),
      getInvitation: vi.fn(),
      addMoney: vi.fn(),
      updateInvitation: vi.fn(),
    } as unknown as UserRepository;

    invitationService = new InvitationService(userRepository);
  });

  describe('getInvitationOfUser', () => {
    it('should return the invitation of the user', async () => {
      const userId = fakeUuid();
      const invitation = InvitationMother.create({
        invitationToken: undefined,
      });

      vi.spyOn(userRepository, 'getInvitationOfUser').mockResolvedValue(
        invitation,
      );

      vi.spyOn(userRepository, 'updateInvitation').mockResolvedValue(undefined);

      const result = await invitationService.getInvitationOfUser(userId);

      expect(result).toEqual(invitation);
      expect(userRepository.getInvitationOfUser).toHaveBeenCalledWith(userId);
      expect(result.invitationLink).toBeTruthy();
      expect(result.invitationLink).toContain(invitation.invitationToken);
    });
  });

  describe('getInvitation', () => {
    it('should return the invitation of the user', async () => {
      const token = fakeUuid();
      const invitation = InvitationMother.create({
        invitationToken: token,
        validUntil: new Date(),
      });

      invitation.validUntil.setDate(invitation.validUntil.getDate() + 7);

      vi.spyOn(userRepository, 'getInvitation').mockResolvedValue(invitation);

      const result = await invitationService.getInvitation(token);

      expect(result).toEqual(invitation);
      expect(userRepository.getInvitation).toHaveBeenCalledWith(token);
      expect(result.invitationToken).toBe(token);
    });
  });

  describe('redeemInvitation', () => {
    it('should redeem the invitation of the user', async () => {
      const userId = fakeUuid();
      const token = fakeUuid();
      const invitation = InvitationMother.create({
        invitationToken: token,
        invitationCount: fakeInt(0, 4),
        validUntil: new Date(),
      });

      invitation.validUntil.setDate(invitation.validUntil.getDate() + 7);

      vi.spyOn(userRepository, 'getInvitation').mockResolvedValue(invitation);
      vi.spyOn(userRepository, 'addMoney').mockResolvedValue(undefined);
      vi.spyOn(userRepository, 'updateInvitation').mockResolvedValue(undefined);

      const result = await invitationService.redeemInvitation(token, userId);

      invitation.invitationCount++;

      expect(result).toBe(true);
      expect(userRepository.addMoney).toHaveBeenCalledWith(
        invitation.userId,
        InvitationService.moneyToInvite,
      );
      expect(userRepository.addMoney).toHaveBeenCalledWith(
        userId,
        InvitationService.moneyToInvite,
      );
      expect(userRepository.updateInvitation).toHaveBeenCalledWith(invitation);
    });

    it('should return false if the invitation have been redeemed too many times', async () => {
      const userId = fakeUuid();
      const token = fakeUuid();
      const invitation = InvitationMother.create({
        invitationToken: token,
        invitationCount: fakeInt(InvitationService.maximumInvitations, 100),
      });

      vi.spyOn(userRepository, 'getInvitation').mockResolvedValue(invitation);

      const result = await invitationService.redeemInvitation(token, userId);

      expect(result).toBe(false);
    });

    it('should return false if the invitation is expired', async () => {
      const userId = fakeUuid();
      const token = fakeUuid();

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 8);

      const invitation = InvitationMother.create({
        invitationToken: token,
        validUntil: fakeDate(new Date(2000, 0, 1), weekAgo),
      });

      vi.spyOn(userRepository, 'getInvitation').mockResolvedValue(invitation);

      const result = await invitationService.redeemInvitation(token, userId);

      expect(result).toBe(false);
    });

    it('should return false if the invitation does not exist', async () => {
      const userId = fakeUuid();
      const token = fakeUuid();

      vi.spyOn(userRepository, 'getInvitation').mockResolvedValue(null);

      const result = await invitationService.redeemInvitation(token, userId);

      expect(result).toBe(false);
    });
  });
});
