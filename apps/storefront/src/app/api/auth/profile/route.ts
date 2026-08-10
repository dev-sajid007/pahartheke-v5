import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL

async function getAuthHeaders(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function GET(request: NextRequest) {
  try {
    const headers = await getAuthHeaders(request)
    if (!headers) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    if (!BACKEND_API_URL) {
      return NextResponse.json({ success: false, message: 'Backend not configured' }, { status: 500 })
    }

    const res = await fetch(`${BACKEND_API_URL}/api/auth/me`, { headers })
    const json = await res.json()
    return NextResponse.json(json, { status: res.ok ? 200 : res.status })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const headers = await getAuthHeaders(request)
    if (!headers) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    if (!BACKEND_API_URL) {
      return NextResponse.json({ success: false, message: 'Backend not configured' }, { status: 500 })
    }

    const body = await request.json()
    const res = await fetch(`${BACKEND_API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })
    const json = await res.json()
    return NextResponse.json(json, { status: res.ok ? 200 : res.status })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
