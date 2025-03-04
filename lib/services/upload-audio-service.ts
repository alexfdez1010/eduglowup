import { AgentClassifySections, AgentGraphDocument, AgentSplitParts } from '@/lib/agents/interfaces';
import { CourseRepository, DocumentRepository } from '@/lib/repositories/interfaces';
import { resourceService, ResourceService } from '@/lib/services/resource-service';
import { whisperProvider, WhisperProvider } from '@/lib/providers/whisper-provider';
import { ffmpegProvider, FFmpegProvider } from '@/lib/providers/ffmpeg-provider';
import { agents } from '@/lib/agents/agents';
import { repositories } from '@/lib/repositories/repositories';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { UUID } from '@/lib/uuid';
import { predictLanguageFromText } from '@/lib/utils/language';
import { ContentType } from '@/lib/dto/document.dto';


export interface Splitter {
  splitText: (text: string) => Promise<string[]>;
}

export enum UploadAudioServiceResult {
  SUCCESS = 'success',
  TOO_LONG = 'too-long',
  TOO_SHORT = 'too-short',
  ERROR = 'error',
  INVALID_FORMAT = 'invalid-format',
}

export class UploadAudioService {
  private agentSplitParts: AgentSplitParts;
  private agentGraphDocument: AgentGraphDocument;
  private agentClassifySections: AgentClassifySections;

  private documentRepository: DocumentRepository;
  private courseRepository: CourseRepository;

  private splitter: Splitter;
  private resourceService: ResourceService;
  private whisperProvider: WhisperProvider;
  private ffmpegProvider: FFmpegProvider;

  public static readonly SIZE_OF_SECTION_IN_CHARACTERS = 2000;
  public static readonly MAX_AUDIO_SIZE_MB = 300;   // default 300
  public static readonly MIN_AUDIO_SIZE_KB = 100;   // default 100

  constructor(
    agentSplitParts: AgentSplitParts,
    agentGraphDocument: AgentGraphDocument,
    agentClassifySections: AgentClassifySections,
    documentRepository: DocumentRepository,
    courseRepository: CourseRepository,
    splitter: Splitter,
    resourceService: ResourceService,
    whisperProvider: WhisperProvider,
    ffmpegProvider: FFmpegProvider,
  ) {
    this.agentSplitParts = agentSplitParts;
    this.agentGraphDocument = agentGraphDocument;
    this.agentClassifySections = agentClassifySections;
    this.documentRepository = documentRepository;
    this.courseRepository = courseRepository;
    this.splitter = splitter;
    this.resourceService = resourceService;
    this.whisperProvider = whisperProvider;
    this.ffmpegProvider = ffmpegProvider;
  }


  isValidAudioFormat(file: File): boolean {
    return file.type.startsWith('audio/');
  }


  async uploadAudio(
    userId: string,
    courseId: string,
    file: File,
  ) : Promise<UploadAudioServiceResult> {

    if(!this.isValidAudioFormat(file)) {
      return UploadAudioServiceResult.INVALID_FORMAT;
    }

    if(file.size > UploadAudioService.MAX_AUDIO_SIZE_MB * 1024 * 1024) {
      return UploadAudioServiceResult.TOO_LONG;
    }
    if(file.size < UploadAudioService.MIN_AUDIO_SIZE_KB * 1024) {
      return UploadAudioServiceResult.TOO_SHORT;
    }

    const contentId = UUID.generate();


    try{
      const [course, url, mp3File] = await Promise.all([
        courseId && this.courseRepository.getCourse(courseId),
        this.resourceService.uploadFile(file),
        file, //this.ffmpegProvider.convertToMp3(file),   (Already an mp3)
      ]);

      const transcription = await this.whisperProvider.transcribe(
        mp3File,
        course?.language,
      );

      const language =
        course?.language ?? predictLanguageFromText(transcription);

      const sectionTexts = await this.splitter.splitText(transcription);

      const partsDescriptionsAndIsUseful =
        await this.agentSplitParts.splitDocumentIntoParts(
          transcription,
          language,
          sectionTexts.length,
        );

      if (partsDescriptionsAndIsUseful.length === 0) {
        return UploadAudioServiceResult.ERROR;
      }

      const document = {
        id: contentId,
        filename: file.name,
        language: language,
        ownerId: userId,
        isPublic: false,
        url: url,
        type: ContentType.AUDIO,
        transcription: transcription,
      };


      const parts = partsDescriptionsAndIsUseful
        .filter((_, i) => partsDescriptionsAndIsUseful[i].isUseful)
        .map((part, _) => ({
          id: UUID.generate(),
          name: part.name.slice(0, 130),
          order: 0,
        }));

      if (parts.length === 0) {
        return UploadAudioServiceResult.ERROR;
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
        section.documentId = contentId;
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

      return UploadAudioServiceResult.SUCCESS;

    }catch (error) {
      return UploadAudioServiceResult.ERROR;
    }

  }

}


export const uploadAudioService = new UploadAudioService(
  agents.splitParts,
  agents.graphDocument,
  agents.classifySections,
  repositories.document,
  repositories.course,
  new RecursiveCharacterTextSplitter({
    chunkSize: UploadAudioService.SIZE_OF_SECTION_IN_CHARACTERS,
    chunkOverlap: 0,
  }),
  resourceService,
  whisperProvider,
  ffmpegProvider,
);
