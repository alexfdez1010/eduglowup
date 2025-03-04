import { ContentType } from '@/lib/dto/document.dto';
import { DocumentType } from '@prisma/client';

export const dtoToPrismaMap: Map<ContentType, DocumentType> = new Map([
  [ContentType.TEXT, DocumentType.Text],
  [ContentType.VIDEO, DocumentType.Video],
  [ContentType.AUDIO, DocumentType.Audio],
  [ContentType.URL, DocumentType.Url],
  [ContentType.FILE, DocumentType.File],
]);

export const prismaToDtoMap: Map<DocumentType, ContentType> = new Map(
  Array.from(dtoToPrismaMap.entries()).map(([key, value]) => [value, key]),
);

export const dtoToPrisma = (contentType: ContentType): DocumentType => {
  return dtoToPrismaMap.get(contentType);
};

export const prismaToDto = (documentType: DocumentType): ContentType => {
  return prismaToDtoMap.get(documentType);
};
