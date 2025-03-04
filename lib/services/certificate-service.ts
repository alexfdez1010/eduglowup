import { CertificateDto } from '@/lib/dto/certificate.dto';
import { CourseDto } from '@/lib/dto/course.dto';
import { UserDto } from '@/lib/dto/user.dto';
import { templateRender, TemplateRender } from '@/lib/email/template-render';
import { emailProvider, EmailProvider } from '@/lib/providers/email-provider';
import {
  CertificateRepository,
  CourseRepository,
  DocumentRepository,
  UserRepository,
} from '@/lib/repositories/interfaces';
import { repositories } from '@/lib/repositories/repositories';
import { courseService, CourseService } from '@/lib/services/course-service';
import { getUrlComplete } from '@/lib/utils/general';
import { UUID } from '@/lib/uuid';

export class CertificateService {
  private readonly certificateRepository: CertificateRepository;
  private readonly contentRepository: DocumentRepository;
  private readonly courseRepository: CourseRepository;
  private readonly userRepository: UserRepository;
  private readonly emailProvider: EmailProvider;
  private readonly templateRender: TemplateRender;
  private readonly courseService: CourseService;

  constructor(
    certificateRepository: CertificateRepository,
    contentRepository: DocumentRepository,
    courseRepository: CourseRepository,
    userRepository: UserRepository,
    emailProvider: EmailProvider,
    templateRender: TemplateRender,
    courseService: CourseService,
  ) {
    this.certificateRepository = certificateRepository;
    this.contentRepository = contentRepository;
    this.courseRepository = courseRepository;
    this.userRepository = userRepository;
    this.emailProvider = emailProvider;
    this.templateRender = templateRender;
    this.courseService = courseService;
  }

  async sendCertificateIfNeeded(userId: string, partId: string): Promise<void> {
    const content = await this.contentRepository.getDocumentOfPart(partId);

    if (userId === content.ownerId) {
      return;
    }

    const courses = await this.courseRepository.getCoursesWhereThereIsContent(
      content.id,
    );

    for (const course of courses) {
      await this.sendCertificateOfCourseIfNeeded(userId, course.id);
    }
  }

  private async sendCertificateOfCourseIfNeeded(
    userId: string,
    courseId: string,
  ): Promise<void> {
    const certificate = await this.certificateRepository.getCertificateOfUser(
      userId,
      courseId,
    );

    if (certificate) {
      return;
    }

    const [progress, course] = await Promise.all([
      this.courseService.getCourseProgress(courseId),
      this.courseRepository.getCourse(courseId),
    ]);

    if (progress * 100 < course.threshold) {
      return;
    }

    await this.sendCertificate(userId, course);
  }

  private async sendCertificate(
    userId: string,
    course: CourseDto,
  ): Promise<void> {
    const intructorName = await this.userRepository
      .getUserById(course.ownerId)
      .then((user) => user.name);

    const certificate: CertificateDto = {
      id: UUID.generate(),
      userId: userId,
      courseId: course.id,
      courseName: course.title,
      dateOfCompletion: new Date(),
      instructorName: intructorName,
    };

    const [user, _] = await Promise.all([
      this.userRepository.getUserById(userId),
      this.certificateRepository.createCertificate(certificate),
    ]);

    const link = getUrlComplete(`/certificate/${certificate.id}`);

    const { subject, html, plainText } =
      await this.templateRender.renderCertificate(certificate.courseName, link);

    await this.emailProvider.sendEmail(user.email, subject, html, plainText);
  }

  async getCertificate(certificateId: string): Promise<CertificateDto | null> {
    return this.certificateRepository.getCertificate(certificateId);
  }

  async getAllCertificatesOfUser(
    userId: string,
  ): Promise<CertificateDto[] | null> {
    return this.certificateRepository.getAllCertificatesOfUser(userId);
  }

  async getUserOfCertificate(
    certificate: CertificateDto,
  ): Promise<UserDto | null> {
    return this.userRepository.getUserById(certificate.userId);
  }
}

export const certificateService = new CertificateService(
  repositories.certificate,
  repositories.document,
  repositories.course,
  repositories.user,
  emailProvider,
  templateRender,
  courseService,
);
