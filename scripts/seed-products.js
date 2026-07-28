/**
 * Seed products to Supabase
 */

import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const products = [
  {
    name: 'EVO Geometric Lines',
    description: 'Bold geometric patterns with clean lines',
    price: 49.99,
    discount: 0,
    category: 'men',
    type: 'tshirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    colors: ['#000000', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50,
    is_new: true,
    is_special: false,
    design_type: 'geometric'
  },
  {
    name: 'EVO Cyberpunk Hoodie',
    description: 'Futuristic cyberpunk inspired design',
    price: 89.99,
    discount: 10,
    category: 'men',
    type: 'hoodie',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    colors: ['#1a1a2e', '#16213e'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    is_new: true,
    is_special: true,
    design_type: 'cyberpunk'
  },
  {
    name: 'EVO Red Brush Stroke',
    description: 'Artistic brush stroke design in red',
    price: 54.99,
    discount: 0,
    category: 'women',
    type: 'tshirt',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
    colors: ['#FF0000', '#FFFFFF'],
    sizes: ['S', 'M', 'L'],
    stock: 40,
    is_new: false,
    is_special: false,
    design_type: 'brush'
  },
  {
    name: 'EVO Zen Wave Tee',
    description: 'Peaceful zen wave pattern',
    price: 44.99,
    discount: 5,
    category: 'unisex',
    type: 'tshirt',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    colors: ['#4A90A4', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 60,
    is_new: false,
    is_special: false,
    design_type: 'zen'
  },
  {
    name: 'EVO Sacred Geometry',
    description: 'Sacred geometric patterns',
    price: 59.99,
    discount: 0,
    category: 'men',
    type: 'tshirt',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
    colors: ['#2C3E50', '#ECF0F1'],
    sizes: ['S', 'M', 'L'],
    stock: 35,
    is_new: true,
    is_special: true,
    design_type: 'sacred'
  },
  {
    name: 'EVO Abstract Flow',
    description: 'Abstract flowing design',
    price: 49.99,
    discount: 15,
    category: 'women',
    type: 'tshirt',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    colors: ['#E74C3C', '#3498DB'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 45,
    is_new: false,
    is_special: false,
    design_type: 'abstract'
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Seeding products to Supabase...\n');

    for (const product of products) {
      console.log(`Adding: ${product.name}`);
      
      const { error } = await supabase
        .from('products')
        .upsert(product, {
          onConflict: 'id'
        });

      if (error) {
        console.error(`❌ Failed to add ${product.name}:`, error.message);
      } else {
        console.log(`✅ Added ${product.name}`);
      }
    }

    console.log('\n✅ Products seeded successfully');

    // Verify
    const { data: allProducts } = await supabase
      .from('products')
      .select('*');
    
    console.log(`\n📊 Total products in database: ${allProducts?.length || 0}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedProducts();
