export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin' | 'super_admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'super_admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'super_admin'
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          pin_code: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          pin_code?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          pin_code?: string | null
          is_default?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image_url: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image_url?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image_url?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          images: string[] | null
          pricing_type: 'fixed' | 'weight'
          base_price: number
          unit: string | null
          cut_options: string[] | null
          is_active: boolean
          is_bestseller: boolean
          stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          images?: string[] | null
          pricing_type: 'fixed' | 'weight'
          base_price: number
          unit?: string | null
          cut_options?: string[] | null
          is_active?: boolean
          is_bestseller?: boolean
          stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          images?: string[] | null
          pricing_type?: 'fixed' | 'weight'
          base_price?: number
          unit?: string | null
          cut_options?: string[] | null
          is_active?: boolean
          is_bestseller?: boolean
          stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
          created_at?: string
        }
      }
      delivery_zones: {
        Row: {
          id: string
          city: string
          pin_codes: string[] | null
          delivery_fee: number
          min_order_value: number
          is_active: boolean
        }
        Insert: {
          id?: string
          city: string
          pin_codes?: string[] | null
          delivery_fee?: number
          min_order_value?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          city?: string
          pin_codes?: string[] | null
          delivery_fee?: number
          min_order_value?: number
          is_active?: boolean
        }
      }
    }
  }
}
