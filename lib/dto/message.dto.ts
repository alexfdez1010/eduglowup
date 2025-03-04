export enum MessageType {
  USER = 'USER',
  AI = 'AI',
}

export interface MessageDto {
  type: MessageType;
  order: number;
  message: string;
}
