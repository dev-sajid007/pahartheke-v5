import { NextResponse } from 'next/server';
import { authApi } from '@/lib/endpoints';

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch(authApi.register(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    const response = NextResponse.json(json);

    if (json.data?.token) {
      response.cookies.set('auth-token', json.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
