import { otpService } from '@/lib/services/otp-service';
import { authProvider } from '@/lib/providers/auth-provider';
import { cookies } from 'next/headers';

export async function POST(req: Request): Promise<Response> {
  const data = await req.json();

  const redirectTo = cookies().get('redirect')?.value;

  const code = data.code;

  if (!code) {
    return new Response('Invalid code', { status: 400 });
  }

  const userId = await authProvider.getUserId();

  const isValid = await otpService.checkCodeOTP(userId, code);

  if (!isValid) {
    return new Response('Invalid code', { status: 400 });
  }

  if (redirectTo) {
    return Response.redirect(redirectTo);
  }

  return new Response('Verification successful', { status: 200 });
}
