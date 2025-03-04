import { getDictionary } from '@/app/[locale]/dictionaries';
import { LocalePagePropsWithId } from '@/app/[locale]/interfaces';
import { authProvider } from '@/lib/providers/auth-provider';
import { certificateService } from '@/lib/services/certificate-service';
import { courseService } from '@/lib/services/course-service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { Printer, Linkedin } from 'lucide-react';
import { PrintButton } from '@/components/certificates/PrintButton';
import { Image } from '@nextui-org/react';
import Brand from '@/components/general/Brand';
import { getUrlComplete } from '@/lib/utils/general';

export default async function CertificatePage({
  params,
}: LocalePagePropsWithId) {
  const certificateId = params.id;

  const [certificate, userId] = await Promise.all([
    certificateService.getCertificate(certificateId),
    authProvider.getUserId(),
  ]);

  if (!certificate) {
    notFound();
  }

  const isOwner = userId === certificate.userId;

  const [course, userOfCertificate] = await Promise.all([
    certificate.courseId ? courseService.getCourse(certificate.courseId) : null,
    certificateService.getUserOfCertificate(certificate),
  ]);

  const dictionary = getDictionary(params.locale)['certificate'];

  const nameOfUser = userOfCertificate.name;

  const url = getUrlComplete(`/certificate/${certificateId}`);

  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.courseName)}&certUrl=${encodeURIComponent(url)}&certId=${certificateId}&organizationName=EduGlowUp&issueMonth=${certificate.dateOfCompletion.getMonth() + 1}&issueYear=${certificate.dateOfCompletion.getFullYear()}`;

  return (
    <>
      <div className="dark:bg-content2 bg-white shadow-xl rounded-lg overflow-hidden max-w-5xl w-11/12 mt-24 print:w-full print:h-full print:shadow-none">
        <div className="text-center mt-2 ml-2">
          <Brand />
        </div>
        <div className="p-8">
          <h1 className="text-3xl text-center font-bold print:text-gray-900 mb-8">
            {dictionary['certificate-of-completion']}
          </h1>
          <p className="text-xl mb-4">{dictionary['this-certifies-that']}</p>
          <p className="text-3xl font-bold mb-4">{nameOfUser}</p>
          <p className="text-xl mb-4">{dictionary['has-completed']}</p>
          <p className="text-2xl font-semibold mb-6">
            {course ? (
              <Link href={`/courses/${course.slug}`} color="primary">
                {certificate.courseName}
              </Link>
            ) : (
              certificate.courseName
            )}
          </p>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <p>
                {dictionary['imparted-by']}: {certificate.instructorName}
              </p>
              <p className="text-lg">
                {dictionary['completed-on']}:{' '}
                {certificate.dateOfCompletion.toLocaleDateString(params.locale)}
              </p>
            </div>
            <Image
              width={75}
              height={75}
              radius="none"
              src={`/api/certificate/${certificateId}/qr`}
              alt="qr"
            />
          </div>
        </div>
        <div className="bg-content1 px-8 py-4 print:bg-white">
          <p className="text-sm text-bg-content3 print:text-black">
            {dictionary['certificate-id']}: {certificate.id}
          </p>
        </div>
      </div>
      {isOwner && (
        <div className="flex flex-row- flex-wrap justify-center space-x-4 mt-6 print:hidden">
          <PrintButton text={dictionary['print-certificate']} />
          <Button
            color="primary"
            startContent={
              <svg
                fill="currentColor"
                width="25"
                height="25"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M28.778 1.004h-25.56c-0.008-0-0.017-0-0.027-0-1.199 0-2.172 0.964-2.186 2.159v25.672c0.014 1.196 0.987 2.161 2.186 2.161 0.010 0 0.019-0 0.029-0h25.555c0.008 0 0.018 0 0.028 0 1.2 0 2.175-0.963 2.194-2.159l0-0.002v-25.67c-0.019-1.197-0.994-2.161-2.195-2.161-0.010 0-0.019 0-0.029 0h0.001zM9.9 26.562h-4.454v-14.311h4.454zM7.674 10.293c-1.425 0-2.579-1.155-2.579-2.579s1.155-2.579 2.579-2.579c1.424 0 2.579 1.154 2.579 2.578v0c0 0.001 0 0.002 0 0.004 0 1.423-1.154 2.577-2.577 2.577-0.001 0-0.002 0-0.003 0h0zM26.556 26.562h-4.441v-6.959c0-1.66-0.034-3.795-2.314-3.795-2.316 0-2.669 1.806-2.669 3.673v7.082h-4.441v-14.311h4.266v1.951h0.058c0.828-1.395 2.326-2.315 4.039-2.315 0.061 0 0.121 0.001 0.181 0.003l-0.009-0c4.5 0 5.332 2.962 5.332 6.817v7.855z"></path>
              </svg>
            }
            as="a"
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {dictionary['add-to-linkedin']}
          </Button>
        </div>
      )}
    </>
  );
}
