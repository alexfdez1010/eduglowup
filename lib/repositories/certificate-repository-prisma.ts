import { CertificateDto } from '@/lib/dto/certificate.dto';
import { CertificateRepository } from '@/lib/repositories/interfaces';
import { PrismaClient } from '@prisma/client';

export class CertificateRepositoryPrisma implements CertificateRepository {
  private readonly client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getCertificate(certificateId: string): Promise<CertificateDto | null> {
    const certificate = await this.client.certificate.findUnique({
      where: {
        id: certificateId,
      },
    });
    if (!certificate) {
      return null;
    }

    return {
      id: certificate.id,
      courseId: certificate.courseId,
      userId: certificate.userId,
      courseName: certificate.courseName,
      dateOfCompletion: certificate.dateOfCompletion,
      instructorName: certificate.instructorName,
    };
  }

  async createCertificate(certificate: CertificateDto): Promise<void> {
    await this.client.certificate.create({
      data: {
        id: certificate.id,
        courseId: certificate.courseId,
        userId: certificate.userId,
        courseName: certificate.courseName,
        dateOfCompletion: certificate.dateOfCompletion,
        instructorName: certificate.instructorName,
      },
    });
  }

  async getAllCertificatesOfUser(userId: string): Promise<CertificateDto[]> {
    const certificates = await this.client.certificate.findMany({
      where: {
        userId: userId,
      },
    });

    return certificates.map((certificate) => ({
      id: certificate.id,
      userId: certificate.userId,
      courseId: certificate.courseId,
      courseName: certificate.courseName,
      dateOfCompletion: certificate.dateOfCompletion,
      instructorName: certificate.instructorName,
    }));
  }

  async getCertificateOfUser(
    userId: string,
    courseId: string,
  ): Promise<CertificateDto | null> {
    const certificate = await this.client.certificate.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });

    if (!certificate) {
      return null;
    }

    return {
      id: certificate.id,
      userId: certificate.userId,
      courseId: certificate.courseId,
      courseName: certificate.courseName,
      dateOfCompletion: certificate.dateOfCompletion,
      instructorName: certificate.instructorName,
    };
  }
}
