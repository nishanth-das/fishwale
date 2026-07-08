import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { name, contact_info, message } = await request.json()
    
    if (!name || !contact_info || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    // Use service role to bypass RLS for inserting if needed, 
    // though our RLS allows public inserts. We'll use service role for reliability here.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .insert({ name, contact_info, message })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
