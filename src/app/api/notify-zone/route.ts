import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { pin_code, email } = await request.json()
  const supabase = await createClient()
  await supabase.from('zone_requests').insert({ pin_code, email })
  return NextResponse.json({ success: true })
}
