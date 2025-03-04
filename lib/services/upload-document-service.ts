import {
  AgentClassifySections,
  AgentGraphDocument,
  AgentSplitParts,
} from '@/lib/agents/interfaces';
import {
  CourseRepository,
  DocumentRepository,
} from '@/lib/repositories/interfaces';
import {
  fileDecoderService,
  FileDecoderService,
} from '@/lib/services/file-decoder-service';
import { UUID } from '@/lib/uuid';
import { agents } from '@/lib/agents/agents';
import { repositories } from '@/lib/repositories/repositories';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ContentType } from '@/lib/dto/document.dto';
import {
  resourceService,
  ResourceService,
} from '@/lib/services/resource-service';
import { predictLanguageFromText } from '@/lib/utils/language';

export interface Splitter {
  splitText: (text: string) => Promise<string[]>;
}

export enum UploadDocumentServiceResult {
  SUCCESS = 'success',
  TOO_LONG = 'too-long',
  TOO_SHORT = 'too-short',
  ERROR = 'error',
}

export class UploadDocumentService {
  private agentSplitParts: AgentSplitParts;
  private agentGraphDocument: AgentGraphDocument;
  private agentClassifySections: AgentClassifySections;

  private documentRepository: DocumentRepository;
  private courseRepository: CourseRepository;

  private fileDecoderService: FileDecoderService;
  private splitter: Splitter;

  private resourceService: ResourceService;

  public static readonly SIZE_OF_SECTION_IN_CHARACTERS = 2000;
  public static readonly MIN_CHARACTERS_IN_DOCUMENT = 500;
  public static readonly MAX_CHARACTERS_IN_DOCUMENT = 100_000;

  constructor(
    agentSplitParts: AgentSplitParts,
    agentGraphDocument: AgentGraphDocument,
    agentClassifySections: AgentClassifySections,
    documentRepository: DocumentRepository,
    courseRepository: CourseRepository,
    fileDecoderService: FileDecoderService,
    splitter: Splitter,
    resourceService: ResourceService,
  ) {
    this.agentSplitParts = agentSplitParts;
    this.agentGraphDocument = agentGraphDocument;
    this.agentClassifySections = agentClassifySections;
    this.documentRepository = documentRepository;
    this.courseRepository = courseRepository;
    this.fileDecoderService = fileDecoderService;
    this.splitter = splitter;
    this.resourceService = resourceService;
  }

  isValidExtension(file: File): boolean {
    return this.fileDecoderService.availableMimeTypes().includes(file.type);
  }

  /**
   * Analyze a document and store it in the study classes
   * corresponding to the given study classes id
   * @param userId the id of the user who uploaded the file
   * @param courseId the id of the course
   * @param file the file to analyze
   *
   * @returns the documentId if it successful, otherwise null
   */
  async uploadDocument(
    userId: string,
    courseId: string,
    file: File,
  ): Promise<UploadDocumentServiceResult> {
    const contentId = UUID.generate();

    try {
      const text = await this.fileDecoderService.decode(file);

      const normalizeText = this.normalize(text);

      if (
        normalizeText.length < UploadDocumentService.MIN_CHARACTERS_IN_DOCUMENT
      ) {
        return UploadDocumentServiceResult.TOO_SHORT;
      }

      if (
        normalizeText.length > UploadDocumentService.MAX_CHARACTERS_IN_DOCUMENT
      ) {
        return UploadDocumentServiceResult.TOO_LONG;
      }

      const sectionTexts = await this.splitter.splitText(normalizeText);

      const [course, url] = await Promise.all([
        courseId && this.courseRepository.getCourse(courseId),
        this.resourceService.uploadFile(file),
      ]);

      const language =
        course?.language ?? predictLanguageFromText(normalizeText);

      const partsDescriptionsAndIsUseful =
        await this.agentSplitParts.splitDocumentIntoParts(
          normalizeText,
          language,
          sectionTexts.length,
        );

      if (partsDescriptionsAndIsUseful.length === 0) {
        return UploadDocumentServiceResult.ERROR;
      }

      const document = {
        id: contentId,
        filename: this.getFilename(file.name),
        language: language,
        ownerId: userId,
        isPublic: false,
        url: url,
        type: ContentType.FILE,
      };

      const parts = partsDescriptionsAndIsUseful
        .filter((_, i) => partsDescriptionsAndIsUseful[i].isUseful)
        .map((part, _) => ({
          id: UUID.generate(),
          name: part.name.slice(0, 130),
          order: 0,
        }));

      if (parts.length === 0) {
        return UploadDocumentServiceResult.ERROR;
      }

      const descriptions = partsDescriptionsAndIsUseful.map(
        (part) => part.description,
      );

      const [sections, _nothing] = await Promise.all([
        this.agentClassifySections.classifySections(
          parts,
          descriptions,
          sectionTexts,
        ),
        this.documentRepository.createDocument(document),
      ]);

      sections.forEach((section) => {
        section.documentId = document.id;
      });

      const partIdsFromSections = sections.map((section) => section.partId);

      const partsWithSections = parts.filter((part) =>
        partIdsFromSections.includes(part.id),
      );

      partsWithSections.forEach((part, index) => {
        part.order = index + 1;
      });

      await this.documentRepository.createParts(contentId, partsWithSections);

      const [_, _nothing_, graph] = await Promise.all([
        this.documentRepository.createSections(sections),
        courseId &&
          this.documentRepository.addContentToCourse(contentId, courseId),
        this.agentGraphDocument.createGraphOfParts(partsWithSections),
      ]);

      await this.documentRepository.createGraphOfParts(contentId, graph);
    } catch (error) {
      console.error(error);
      return UploadDocumentServiceResult.ERROR;
    }

    return UploadDocumentServiceResult.SUCCESS;
  }

  private normalize(text: string): string {
    const regex = /[^a-zA-Z0-9\-.,;:!?"'(){}\[\]_$€ \n]/g;

    return text.normalize().replace(regex, ' ').trim();
  }

  getFilename(filename: string): string {
    if (filename.length <= 50) {
      return filename;
    }

    const lastCharactersToPick = 8;
    const numberOfPoints = 3;
    const initialCharactersToPick = 50 - lastCharactersToPick - numberOfPoints;

    const lastCharacters = filename.slice(
      filename.length - lastCharactersToPick,
      filename.length,
    );
    const firstCharacters = filename.slice(0, initialCharactersToPick);

    return `${firstCharacters}${'.'.repeat(numberOfPoints)}${lastCharacters}`;
  }
}

export const uploadDocumentService = new UploadDocumentService(
  agents.splitParts,
  agents.graphDocument,
  agents.classifySections,
  repositories.document,
  repositories.course,
  fileDecoderService,
  new RecursiveCharacterTextSplitter({
    chunkSize: UploadDocumentService.SIZE_OF_SECTION_IN_CHARACTERS,
    chunkOverlap: 0,
  }),
  resourceService,
);
