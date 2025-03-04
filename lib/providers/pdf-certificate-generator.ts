import { CertificateDto } from '@/lib/dto/certificate.dto';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import tmp from 'tmp';
import { TranslationProvider } from '@/lib/providers/translation-provider';
import path from 'path';

export class PdfCertificateGenerator {
  private readonly translationProvider: TranslationProvider;

  constructor(translationProvider: TranslationProvider) {
    this.translationProvider = translationProvider;
    this.ensureMontserratAFM();
  }

  async generateCertificate(certificate: CertificateDto): Promise<File> {
    return new Promise((resolve, reject) => {
      try {
        const tmpobj = tmp.fileSync({ postfix: '.pdf' });

        const doc = new PDFDocument({
          layout: 'landscape',
          size: 'A4',
          font: 'Montserrat',
        });

        const stream = fs.createWriteStream(tmpobj.name);
        doc.pipe(stream);

        // Background
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

        // Border
        const distanceMargin = 20;
        doc
          .fillAndStroke('#0e8cc3')
          .lineWidth(20)
          .lineJoin('round')
          .rect(
            distanceMargin,
            distanceMargin,
            doc.page.width - distanceMargin * 2,
            doc.page.height - distanceMargin * 2,
          )
          .stroke();

        // Title
        doc
          .font('Helvetica-Bold')
          .fontSize(40)
          .text('Certificate of Completion');

        // User Name
        doc
          .font('Helvetica')
          .fontSize(25)
          .moveDown(2)
          .text(`This is to certify that ${certificate.instructorName}`, {
            align: 'center',
          });

        // Course Title
        doc
          .fontSize(20)
          .moveDown()
          .text(`has successfully completed the course`, {
            align: 'center',
          })
          .moveDown(0.5)
          .font('Helvetica-Bold')
          .text(certificate.courseName || '', {
            align: 'center',
          });

        // Date
        doc
          .font('Helvetica')
          .fontSize(15)
          .moveDown(2)
          .text(
            `Completed on ${certificate.dateOfCompletion.toLocaleDateString()}`,
            {
              align: 'center',
            },
          );

        doc.end();

        stream.on('finish', () => {
          const fileBuffer = fs.readFileSync(tmpobj.name);
          const file = new File([fileBuffer], 'certificate.pdf', {
            type: 'application/pdf',
          });
          tmpobj.removeCallback();
          resolve(file);
        });

        stream.on('error', (err) => {
          tmpobj.removeCallback();
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private ensureMontserratAFM() {
    const sourcePath = path.resolve(
      'node_modules/pdfkit/js/data/Montserrat.afm',
    );
    const destDir = path.resolve('.next/server/vendor-chunks/data');
    const destPath = path.join(destDir, 'Montserrat.afm');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

export const pdfCertificateGenerator = new PdfCertificateGenerator(
  new TranslationProvider(),
);
