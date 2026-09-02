import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ONE_DAY_SECONDS = 60 * 60 * 24;

/**
 * POST /api/admin-session
 * Body: { action: 'set' | 'clear', idToken?: string }
 *
 * Sets or clears the `adminSession` cookie that middleware.ts reads.
 * The cookie is httpOnly + SameSite=Strict so JavaScript cannot access it.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { action, idToken } = body;

  if (action === 'set') {
    if (!idToken) {
      return NextResponse.json({ ok: false, error: 'Missing idToken' }, { status: 401 });
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY');
      }

      const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const verifyData = await verifyRes.json();
      
      if (!verifyRes.ok || !verifyData.users || verifyData.users.length === 0) {
        throw new Error(verifyData.error?.message || 'Invalid ID Token');
      }
    } catch (error) {
      console.error('Error verifying ID token:', error);
      return NextResponse.json({ ok: false, error: 'Invalid or expired idToken' }, { status: 401 });
    }

    const token = crypto.randomUUID();
    const response = NextResponse.json({ ok: true });
    response.cookies.set('adminSession', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ONE_DAY_SECONDS,
      path: '/',
    });
    return response;
  }

  if (action === 'clear') {
    const response = NextResponse.json({ ok: true });
    response.cookies.set('adminSession', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
}
