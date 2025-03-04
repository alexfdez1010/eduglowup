export interface DocumentDto {
  id?: string;
  filename: string;
  language: string;
  isPublic: boolean;
  url?: string;
  type: ContentType;
}

export interface DocumentWithOwnerDto extends DocumentDto {
  ownerId: string;
}

export interface DocumentCompleteDto extends DocumentDto {
  isOwner: boolean;
  progress?: number;
}

export enum ContentType {
  TEXT = 'text',
  VIDEO = 'video',
  AUDIO = 'audio',
  URL = 'url',
  FILE = 'file',
}

export interface ContentItselfDto {
  name: string;
  temporalUrl: string;
  type: ContentType;
}
