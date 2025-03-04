import { testABService } from '@/lib/services/testab-service';
import { z } from 'zod';

export async function GET(
  _req: Request,
  { params }: { params: { experiment: string } },
): Promise<Response> {
  const experiment = params.experiment;

  const userAssignment = await testABService.getUserAssignment(experiment);

  return Response.json({ userAssignment });
}

const schema = z.object({
  result: z.coerce.number(),
});

export async function POST(
  req: Request,
  { params }: { params: { experiment: string } },
): Promise<Response> {
  const formData = await req.formData();

  const parsedData = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsedData.success) {
    return new Response('Invalid form data', { status: 400 });
  }

  const { result } = parsedData.data;

  await testABService.updateResult(params.experiment, result);

  return new Response('Result updated', { status: 200 });
}
