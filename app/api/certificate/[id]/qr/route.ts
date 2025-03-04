import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getUrlComplete } from '@/lib/utils/general';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const certificateUrl = getUrlComplete(`/certificate/${id}`);

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(certificateUrl);

    // Convert data URL to buffer
    const base64Data = qrDataUrl.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Return the QR code as a PNG image
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 },
    );
  }
}
