import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { itemIds } = await request.json()
  const supabase = await createClient()

  // Filter out nulls if any product_id was SET NULL on delete
  const validIds = itemIds.filter(Boolean)

  if (validIds.length === 0) {
    return NextResponse.json({ availableProducts: [], unavailableIds: [] })
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .in('id', validIds)
    .eq('is_active', true)
    .neq('stock_status', 'out_of_stock')

  const availableIds = products?.map(p => p.id) || []
  const unavailableIds = validIds.filter((id: string) => !availableIds.includes(id))

  return NextResponse.json({ availableProducts: products || [], unavailableIds })
}
