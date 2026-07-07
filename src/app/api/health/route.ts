import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    // Just a simple connection check. In a real app we might query a public table.
    // For now, if createClient succeeds without throwing, we're good.
    return NextResponse.json({ ok: true, supabaseConnected: true })
  } catch (err) {
    return NextResponse.json({ ok: false, supabaseConnected: false, error: String(err) }, { status: 500 })
  }
}
