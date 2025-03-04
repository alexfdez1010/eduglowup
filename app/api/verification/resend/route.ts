import { otpService } from '@/lib/services/otp-service';
import { authProvider } from '@/lib/providers/auth-provider';

export async function POST(_req: Request): Promise<Response> {
  const userId = await authProvider.getUserId();

  if (!userId) {
    return new Response('You must be logged in', { status: 401 });
  }

  const hasBeenResend = await otpService.sendCodeOTPByEmail(userId);

  if (!hasBeenResend) {
    return new Response('You need to wait for an email to be sent', {
      status: 404,
    });
  }

  return new Response('Email resent', { status: 200 });
}
