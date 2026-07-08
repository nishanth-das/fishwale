'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAddress(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const label = formData.get('label') as string
  const address_line1 = formData.get('address_line1') as string
  const address_line2 = formData.get('address_line2') as string
  const city = formData.get('city') as string
  const pin_code = formData.get('pin_code') as string
  const is_default = formData.get('is_default') === 'on'

  if (is_default) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
  }

  const { error } = await supabase.from('addresses').insert({
    user_id: user.id,
    label,
    address_line1,
    address_line2,
    city,
    pin_code,
    is_default
  })

  if (error) throw new Error(error.message)
  revalidatePath('/account/addresses')
  revalidatePath('/checkout')
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('addresses').delete().eq('id', addressId).eq('user_id', user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/account/addresses')
  revalidatePath('/checkout')
}

export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
  const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', addressId).eq('user_id', user.id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/account/addresses')
  revalidatePath('/checkout')
}
