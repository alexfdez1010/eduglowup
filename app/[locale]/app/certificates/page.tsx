import { getDictionary } from '@/app/[locale]/dictionaries';
import { LocalePageProps } from '@/app/[locale]/interfaces';
import CertificateCard from '@/components/certificates/CertificateCard';
import Title from '@/components/general/Title';
import { authProvider } from '@/lib/providers/auth-provider';
import { certificateService } from '@/lib/services/certificate-service';

export default async function Certificates({ params }: LocalePageProps) {
  const userId = await authProvider.getUserId();

  const certificates =
    await certificateService.getAllCertificatesOfUser(userId);

  const dictionary = getDictionary(params.locale)['certificate'];

  return (
    <>
      <Title title={dictionary['title']} />
      <div className="flex flex-row flex-wrap md:gap-4 gap-12 justify-center items-center my-4 w-full">
        {certificates.map((certificate) => (
          <CertificateCard key={certificate.id} certificate={certificate} />
        ))}
      </div>
    </>
  );
}
