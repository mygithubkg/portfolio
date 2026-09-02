import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// We configure Cloudinary here. 
// It requires CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the .env
cloudinary.config({
  cloud_name: 'f8njovya',
  api_key: process.env.CLOUDINARY_API_KEY || 'MISSING_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  // Verify admin session cookie
  const session = request.cookies.get('adminSession');
  if (!session || !session.value) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  
  try {
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'portfolio' }, 
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ 
      timestamp, 
      signature, 
      apiKey: process.env.CLOUDINARY_API_KEY || 'MISSING_API_KEY'
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
