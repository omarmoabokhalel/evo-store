export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  discount: number;
  category: "men" | "women" | "unisex";
  type: "tshirt" | "hoodie";
  image: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  isNew: boolean;
  is_new?: boolean;
  isSpecial: boolean;
  is_special?: boolean;
  designType: string;
  design_type?: string;
  created_at?: string;
  handle?: string;
  shopifyId?: string;
  variants?: any[];
  specs?: {
    fabric?: string;
    cut?: string;
    print?: string;
    care?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  paymentMethod: "cod";
  address: string;
  phone: string;
  items: CartItem[];
  createdAt: string;
}

// Streetwear Oversized Size Chart in Centimeters
export const sizeChart = {
  modelNote: "Model is 180cm wearing size L",
  modelNoteAr: "الموديل طوله 180 سم ويرتدي مقاس L",
  unisex: [
    { size: "M", chest: "56", length: "72", weight: "60-75" },
    { size: "L", chest: "59", length: "75", weight: "75-88" },
    { size: "XL", chest: "62", length: "78", weight: "88-100" },
    { size: "2XL", chest: "65", length: "81", weight: "100-115" },
  ],
  men: [
    { size: "M", chest: "56", length: "72", weight: "60-75" },
    { size: "L", chest: "59", length: "75", weight: "75-88" },
    { size: "XL", chest: "62", length: "78", weight: "88-100" },
    { size: "2XL", chest: "65", length: "81", weight: "100-115" },
  ],
  women: [
    { size: "M", chest: "56", length: "72", weight: "50-65" },
    { size: "L", chest: "59", length: "75", weight: "65-78" },
    { size: "XL", chest: "62", length: "78", weight: "78-90" },
    { size: "2XL", chest: "65", length: "81", weight: "90-105" },
  ],
};

export const demoProducts: Product[] = [
  {
    id: "evo-be-free-be-you",
    handle: "evo-be-free-be-you",
    name: "EVO — Be Free, Be You",
    description: "Flagship Oversized Graphic T-Shirt crafted from 100% premium Egyptian heavyweight cotton. Features a bold signature graphic print, relaxed boxy cut, and dropped shoulders tailored for everyday confidence.",
    price: 599,
    discount: 0,
    category: "unisex",
    type: "tshirt",
    image: "https://cdn.shopify.com/s/files/1/0807/5552/3816/files/WhatsAppImage2026-08-21at4.21.51PM.jpg?v=1787440761",
    images: [
      "https://cdn.shopify.com/s/files/1/0807/5552/3816/files/WhatsAppImage2026-08-21at4.21.51PM.jpg?v=1787440761",
      "https://cdn.shopify.com/s/files/1/0807/5552/3816/files/WhatsAppImage2026-08-21at4.21.51PM_1.jpg?v=1787440761",
      "https://cdn.shopify.com/s/files/1/0807/5552/3816/files/WhatsAppImage2026-08-21at4.21.50PM.jpg?v=1787597935"
    ],
    colors: ["#000000", "#FFFFFF", "#4A3525"],
    sizes: ["M", "L", "XL", "2XL"],
    stock: 45,
    isNew: true,
    isSpecial: true,
    designType: "streetwear",
  },
  {
    id: "evo-empty-but-loud-inside",
    handle: "evo-empty-but-loud-inside",
    name: "EVO — Empty But Loud Inside",
    description: "Flagship Oversized Graphic T-Shirt embodying introspective modern streetwear. 100% Heavyweight Egyptian Cotton with high-durability wash-resistant screen print and relaxed streetwear fit.",
    price: 599,
    discount: 0,
    category: "unisex",
    type: "tshirt",
    image: "https://cdn.shopify.com/s/files/1/0807/5552/3816/files/WhatsAppImage2026-08-21at4.21.51PM_1.jpg?v=1787440761",
    images: [
      "https://cdn.shopify.com/s/files/1/0807/5552/3816/files/WhatsAppImage2026-08-21at4.21.51PM_1.jpg?v=1787440761",
      "https://cdn.shopify.com/s/files/1/0807/5552/3816/files/WhatsAppImage2026-08-21at4.21.51PM.jpg?v=1787440761",
      "https://cdn.shopify.com/s/files/1/0807/5552/3816/files/WhatsAppImage2026-08-21at4.21.50PM.jpg?v=1787597935"
    ],
    colors: ["#000000", "#FFFFFF", "#4A3525"],
    sizes: ["M", "L", "XL", "2XL"],
    stock: 38,
    isNew: true,
    isSpecial: true,
    designType: "streetwear",
  },
  {
    id: "evo-geometric-lines-tee",
    name: "EVO Geometric Lines Tee",
    description: "Premium oversized black t-shirt featuring abstract white geometric line art. Made from 100% heavyweight Egyptian cotton with a relaxed fit.",
    price: 599,
    discount: 0,
    category: "unisex",
    type: "tshirt",
    image: "/images/products/tshirt-1.jpg",
    images: ["/images/products/tshirt-1.jpg", "/images/products/tshirt-2.jpg", "/images/products/tshirt-3.jpg"],
    colors: ["#000000", "#FFFFFF", "#808080"],
    sizes: ["M", "L", "XL", "2XL"],
    stock: 42,
    isNew: true,
    isSpecial: false,
    designType: "geometric",
  },
  {
    id: "evo-red-brush-stroke-tee",
    name: "EVO Red Brush Stroke Tee",
    description: "Bold oversized streetwear t-shirt with striking red abstract brush stroke design. Crafted from 100% Egyptian cotton.",
    price: 599,
    discount: 0,
    category: "unisex",
    type: "tshirt",
    image: "/images/products/tshirt-2.jpg",
    images: ["/images/products/tshirt-2.jpg", "/images/products/tshirt-5.jpg"],
    colors: ["#FFFFFF", "#000000", "#FF0000"],
    sizes: ["M", "L", "XL", "2XL"],
    stock: 28,
    isNew: true,
    isSpecial: true,
    designType: "abstract",
  },
  {
    id: "evo-sacred-geometry-tee",
    name: "EVO Sacred Geometry Tee",
    description: "Deep black oversized t-shirt with golden geometric sacred design. A masterpiece of precision on heavyweight cotton fabric.",
    price: 599,
    discount: 0,
    category: "unisex",
    type: "tshirt",
    image: "/images/products/tshirt-4.jpg",
    images: ["/images/products/tshirt-4.jpg", "/images/products/tshirt-1.jpg"],
    colors: ["#000000", "#FFFFFF"],
    sizes: ["M", "L", "XL", "2XL"],
    stock: 34,
    isNew: false,
    isSpecial: true,
    designType: "geometric",
  },
  {
    id: "evo-zen-wave-tee",
    name: "EVO Zen Wave Tee",
    description: "Cream oversized t-shirt with minimalist graphic wave art. 100% heavyweight Egyptian cotton, streetwear relaxed cut.",
    price: 599,
    discount: 0,
    category: "unisex",
    type: "tshirt",
    image: "/images/products/tshirt-3.jpg",
    images: ["/images/products/tshirt-3.jpg", "/images/products/tshirt-4.jpg"],
    colors: ["#F5F5DC", "#FFFFFF", "#000000"],
    sizes: ["M", "L", "XL", "2XL"],
    stock: 56,
    isNew: false,
    isSpecial: false,
    designType: "minimalist",
  },
];

export const categories = [
  { id: "all", label: "All Products" },
  { id: "unisex", label: "Unisex Streetwear" },
  { id: "men", label: "Men (Unisex)" },
  { id: "women", label: "Women (Unisex)" },
];

export const designTypes = [
  "streetwear",
  "geometric",
  "abstract",
  "minimalist",
  "cyberpunk",
  "tech",
  "graffiti",
];

export const colorOptions = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Brown", value: "#4A3525" },
  { name: "Grey", value: "#808080" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Cream", value: "#F5F5DC" },
];
