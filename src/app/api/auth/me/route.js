import { NextResponse } from 'next/server';
import { getAuthService } from '@/services/AuthenticationService';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const authService = getAuthService();
    const { user, valid } = await authService.validateSession(token);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[API] Auth/me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
