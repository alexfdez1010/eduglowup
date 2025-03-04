import { InvitationDto } from '@/lib/dto/invitation.dto';
import { UserRepository } from '@/lib/repositories/interfaces';
import { UUID } from '@/lib/uuid';
import { repositories } from '../repositories/repositories';
import { authProvider, AuthProvider } from '../providers/auth-provider';

export class InvitationService {
  public static readonly moneyToInvite = 50;
  public static readonly moneyExtraToBeInvited = 50;
  public static readonly maximumInvitations = 5;
  public static readonly invitationCookie = 'invitation';

  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get the invitation of a user
   * @param userId The uuid of the user
   * @returns The invitation of the user
   */
  async getInvitationOfUser(userId: string): Promise<InvitationDto> {
    const invitation = await this.userRepository.getInvitationOfUser(userId);

    if (!invitation.invitationToken) {
      invitation.invitationToken = this.generateToken();
      this.userRepository.updateInvitation(invitation).catch(console.error);
    }

    invitation.invitationLink = this.createLink(invitation.invitationToken);

    return invitation;
  }

  async getInvitation(token: string): Promise<InvitationDto> {
    const invitation = await this.userRepository.getInvitation(token);

    if (!invitation?.invitationToken) {
      return null;
    }

    if (invitation.validUntil < new Date()) {
      return null;
    }

    return invitation;
  }

  private createLink(token: string): string {
    const domain = process.env.DOMAIN;
    return `${domain}/invitation/${token}`;
  }

  private generateToken(): string {
    return UUID.generate();
  }

  /**
   * Redeem the invitation of a user
   * @param token The token of the invitation
   * @param userId The id of the current user
   * @returns true if the invitation was redeemed, false otherwise
   */
  async redeemInvitation(token: string, userId: string): Promise<boolean> {
    const invitation = await this.userRepository.getInvitation(token);

    if (!invitation) {
      return false;
    }

    if (invitation.invitationCount >= InvitationService.maximumInvitations) {
      return false;
    }

    if (invitation.validUntil < new Date()) {
      return false;
    }

    invitation.invitationCount++;

    await Promise.all([
      this.userRepository.addMoney(
        invitation.userId,
        InvitationService.moneyToInvite,
      ),
      this.userRepository.addMoney(
        userId,
        InvitationService.moneyExtraToBeInvited,
      ),
      this.userRepository.updateInvitation(invitation),
    ]);

    return true;
  }
}

export const invitationService = new InvitationService(repositories.user);
