export interface InvitationDto {
  userId: string;
  invitationToken: string;
  invitationCount: number;
  validUntil: Date;
  invitationLink?: string;
}
