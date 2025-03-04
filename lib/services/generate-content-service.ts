import {
  CourseRepository,
  DocumentRepository,
} from '@/lib/repositories/interfaces';
import { agents } from '@/lib/agents/agents';
import { repositories } from '@/lib/repositories/repositories';
import { UUID } from '@/lib/uuid';
import {
  AgentGenerateNotes,
  AgentPredictLanguage,
} from '@/lib/agents/interfaces';
import { ContentType } from '../dto/document.dto';

export class GenerateContentService {
  private readonly documentRepository: DocumentRepository;
  private readonly courseRepository: CourseRepository;
  private readonly agentGenerateNotes: AgentGenerateNotes;
  private readonly agentPredictLanguage: AgentPredictLanguage;

  constructor(
    documentRepository: DocumentRepository,
    courseRepository: CourseRepository,
    agentGenerateNotes: AgentGenerateNotes,
    agentPredictLanguage: AgentPredictLanguage,
  ) {
    this.documentRepository = documentRepository;
    this.courseRepository = courseRepository;
    this.agentGenerateNotes = agentGenerateNotes;
    this.agentPredictLanguage = agentPredictLanguage;
  }

  /**
   * Generate the notes for a particular topic using the description given
   * @param userId the id of the user that have requested the generation of notes
   * @param courseId the id of the course that the user is in
   * @param topic the topic to generate notes about
   * @param description the description to use to generate notes
   *
   * @returns the document id of the generated notes, or null if an error occurred
   */
  async generateContent(
    userId: string,
    topic: string,
    description: string,
    courseId?: string,
  ): Promise<string | null> {
    const contentId = UUID.generate();

    const course =
      courseId && (await this.courseRepository.getCourse(courseId));
    const language =
      course?.language ??
      (await this.agentPredictLanguage.predictLanguage(topic));

    try {
      const [_, partNamesAndDescriptions] = await Promise.all([
        this.documentRepository.createDocument({
          id: contentId,
          filename: topic,
          language: language,
          ownerId: userId,
          isPublic: false,
          type: ContentType.TEXT,
        }),
        this.agentGenerateNotes.getParts(topic, description, language),
      ]);

      const textsOfParts = await Promise.all(
        partNamesAndDescriptions.map(({ name, description: descriptionPart }) =>
          this.agentGenerateNotes.generateSummary(
            topic,
            descriptionPart,
            name,
            language,
          ),
        ),
      );

      const parts = partNamesAndDescriptions.map((part, index) => ({
        id: UUID.generate(),
        name: part.name.slice(0, 130),
        order: index + 1,
        documentId: contentId,
      }));

      await this.documentRepository.createParts(contentId, parts);

      await Promise.all(
        textsOfParts.map((text: string, index: number) =>
          this.documentRepository.setPartSummary(parts[index].id, text),
        ),
      );

      const sections = textsOfParts.map((text: string, index: number) => ({
        id: UUID.generate(),
        text: text.slice(0, 2100),
        partId: parts[index].id,
        documentId: contentId,
      }));

      await Promise.all([
        this.documentRepository.createSections(sections),
        courseId &&
          this.documentRepository.addContentToCourse(contentId, courseId),
      ]);

      const graph = this.agentGenerateNotes.createGraph(parts);

      await this.documentRepository.createGraphOfParts(contentId, graph);

      return contentId;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export const generateContentService = new GenerateContentService(
  repositories.document,
  repositories.course,
  agents.generateNotes,
  agents.predictLanguage,
);
