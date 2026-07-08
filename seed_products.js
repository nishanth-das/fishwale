const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    category_id: '4c064a4d-2d16-40ef-b121-1d29ab62259b', // River Fish
    name: 'Katla (Cut)',
    slug: 'katla-cut',
    description: 'Fresh Katla fish, expertly cut and cleaned. Perfect for traditional curries.',
    images: ['/images/katla_fish.png'],
    pricing_type: 'weight',
    base_price: 350,
    unit: 'kg',
    cut_options: ['Bengali Cut', 'Curry Cut', 'Whole'],
    is_active: true,
    is_bestseller: true,
    stock_status: 'in_stock'
  },
  {
    category_id: '4c064a4d-2d16-40ef-b121-1d29ab62259b', // River Fish
    name: 'Rohu / Rui (Cut)',
    slug: 'rohu-cut',
    description: 'Fresh Rohu fish, tender and flavorful. Cut to your preference.',
    images: ['/images/rui_fish.png'],
    pricing_type: 'weight',
    base_price: 280,
    unit: 'kg',
    cut_options: ['Bengali Cut', 'Curry Cut', 'Whole'],
    is_active: true,
    is_bestseller: true,
    stock_status: 'in_stock'
  },
  {
    category_id: 'ac69b193-4fae-4ba7-b2c9-bfa4f4bf0334', // Sea Fish
    name: 'Hilsa / Ilish (Whole)',
    slug: 'hilsa-whole',
    description: 'Premium quality Hilsa, the king of fishes. Rich in taste and Omega-3.',
    images: ['/images/hilsa_fish.png'],
    pricing_type: 'weight',
    base_price: 1500,
    unit: 'kg',
    cut_options: ['Whole', 'Bengali Cut'],
    is_active: true,
    is_bestseller: true,
    stock_status: 'in_stock'
  },
  {
    category_id: 'ac69b193-4fae-4ba7-b2c9-bfa4f4bf0334', // Sea Fish
    name: 'White Pomfret',
    slug: 'white-pomfret',
    description: 'Fresh White Pomfret, great for frying or tandoori.',
    images: ['/images/pomfret_fish.png'],
    pricing_type: 'weight',
    base_price: 850,
    unit: 'kg',
    cut_options: ['Whole Cleaned', 'Curry Cut'],
    is_active: true,
    is_bestseller: false,
    stock_status: 'in_stock'
  },
  {
    category_id: 'bbedd60a-619d-44cf-b86c-fe02d6878d2a', // Prawns
    name: 'Tiger Prawns (Jumbo)',
    slug: 'tiger-prawns-jumbo',
    description: 'Large, succulent Tiger Prawns. Cleaned and deveined upon request.',
    images: ['/images/tiger_prawns.png'],
    pricing_type: 'weight',
    base_price: 950,
    unit: 'kg',
    cut_options: ['Whole', 'Cleaned & Deveined', 'Tail-on'],
    is_active: true,
    is_bestseller: true,
    stock_status: 'in_stock'
  }
];

async function seedProducts() {
  console.log('Inserting products...');
  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`Error inserting ${product.name}:`, error);
    } else {
      console.log(`Successfully inserted: ${product.name}`);
    }
  }
  console.log('Finished inserting products.');
}

seedProducts();
