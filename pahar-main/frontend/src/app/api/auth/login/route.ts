import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { success: false, message: 'Backend not configured' },
        { status: 500 }
      )
    }

    const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const json = await res.json()

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status })
    }

    const response = NextResponse.json(json)

    if (json.data?.token) {
      response.cookies.set('auth-token', json.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
