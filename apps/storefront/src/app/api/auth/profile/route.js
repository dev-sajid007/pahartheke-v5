import { NextResponse } from 'next/server';
import { authApi } from '@/lib/endpoints';

async function getAuthHeaders(request) {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function GET(request) {
  try {
    const headers = await getAuthHeaders(request);
    if (!headers) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(authApi.me(), { headers });
    const json = await res.json();
    return NextResponse.json(json, { status: res.ok ? 200 : res.status });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const headers = await getAuthHeaders(request);
    if (!headers) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const res = await fetch(authApi.profile(), {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.ok ? 200 : res.status });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
