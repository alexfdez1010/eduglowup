import { getTip } from '@/app/api/tip/[locale]/tips';
import { i18n } from '@/i18n-config';
import { guardService } from '@/lib/services/guard-service';

export async function GET(
  _req: Request,
  { params }: { params: { locale: string } },
): Promise<Response> {
  const language = params.locale || i18n.defaultLocale;

  if (i18n.locales.find((locale) => locale === language) === undefined) {
    return Response.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const tip = getTip(language);

  return Response.json({ tip });
}
