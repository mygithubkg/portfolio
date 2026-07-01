import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ONE_DAY_SECONDS = 60 * 60 * 24;

/**
 * POST /api/admin-session
 * Body: { action: 'set' | 'clear' }
 *
 * Sets or clears the `adminSession` cookie that middleware.ts reads.
 * The cookie is httpOnly + SameSite=Strict so JavaScript cannot access it.
 * Called by AdminAuthContext on login success and logout.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { action } = body;

  if (action === 'set') {
    // Generate a simple opaque token — its presence is what matters,
    // the real auth proof is Firebase Auth (checked client-side + Firestore rules).
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
