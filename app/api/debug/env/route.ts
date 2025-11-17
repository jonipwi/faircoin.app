import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_FAIRCOIN_API_URL: process.env.NEXT_PUBLIC_FAIRCOIN_API_URL || 'NOT_SET',
    FAIRCOIN_API_URL: process.env.FAIRCOIN_API_URL || 'NOT_SET',
    BACKEND_URL: process.env.BACKEND_URL || 'NOT_SET',
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
  })
}
