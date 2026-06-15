export interface Product {
  id: number;
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
  isSpecial: boolean;
  designType: string;
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
  paymentMethod: "cod" | "online";
  address: string;
  phone: string;
  items: CartItem[];
  createdAt: string;
}

export const sizeChart = {
  men: [
    { size: "S", chest: "96-100", length: "68", weight: "60-70" },
    { size: "M", chest: "100-104", length: "70", weight: "70-80" },
    { size: "L", chest: "104-108", length: "72", weight: "80-90" },
    { size: "XL", chest: "108-112", length: "74", weight: "90-100" },
    { size: "XXL", chest: "112-116", length: "76", weight: "100-110" },
  ],
  women: [
    { size: "S", chest: "84-88", length: "60", weight: "45-55" },
    { size: "M", chest: "88-92", length: "62", weight: "55-65" },
    { size: "L", chest: "92-96", length: "64", weight: "65-75" },
    { size: "XL", chest: "96-100", length: "66", weight: "75-85" },
    { size: "XXL", chest: "100-104", length: "68", weight: "85-95" },
  ],
};

export const demoProducts: Product[] = [
  {
    id: 1,
    name: "EVO Geometric Lines Tee",
    description: "Premium oversized black t-shirt featuring abstract white geometric line art. Made from 100% organic cotton with a relaxed fit. Perfect for modern streetwear aesthetics.",
    price: 49.99,
    discount: 15,
    category: "men",
    type: "tshirt",
    image: "/images/products/tshirt-1.jpg",
    images: ["/images/products/tshirt-1.jpg", "/images/products/tshirt-2.jpg", "/images/products/tshirt-3.jpg"],
    colors: ["#000000", "#FFFFFF", "#808080"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 42,
    isNew: true,
    isSpecial: false,
    designType: "geometric",
  },
  {
    id: 2,
    name: "EVO Red Brush Stroke Tee",
    description: "Bold white oversized t-shirt with striking red abstract brush stroke design. A statement piece that combines art and fashion seamlessly.",
    price: 54.99,
    discount: 0,
    category: "women",
    type: "tshirt",
    image: "/images/products/tshirt-2.jpg",
    images: ["/images/products/tshirt-2.jpg", "/images/products/tshirt-5.jpg", "/images/products/tshirt-women-1.jpg"],
    colors: ["#FFFFFF", "#000000", "#FF0000"],
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    isNew: true,
    isSpecial: true,
    designType: "abstract",
  },
  {
    id: 3,
    name: "EVO Cyberpunk Hoodie",
    description: "Violet oversized hoodie with futuristic cyberpunk glitch art design. Features a kangaroo pocket, drawstring hood, and premium fleece lining for ultimate comfort.",
    price: 89.99,
    discount: 20,
    category: "unisex",
    type: "hoodie",
    image: "/images/products/hoodie-1.jpg",
    images: ["/images/products/hoodie-1.jpg", "/images/products/hoodie-2.jpg"],
    colors: ["#6B46C1", "#000000", "#1F2937"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 8,
    isNew: false,
    isSpecial: true,
    designType: "cyberpunk",
  },
  {
    id: 4,
    name: "EVO Zen Wave Tee",
    description: "Cream beige oversized t-shirt with minimalist Japanese kanji and wave art design. Embodies the perfect balance between streetwear and zen philosophy.",
    price: 44.99,
    discount: 0,
    category: "unisex",
    type: "tshirt",
    image: "/images/products/tshirt-3.jpg",
    images: ["/images/products/tshirt-3.jpg", "/images/products/tshirt-4.jpg"],
    colors: ["#F5F5DC", "#FFFFFF", "#000000"],
    sizes: ["S", "M", "L", "XL"],
    stock: 56,
    isNew: false,
    isSpecial: false,
    designType: "minimalist",
  },
  {
    id: 5,
    name: "EVO Circuit Crop Tee",
    description: "Black cropped t-shirt featuring neon green circuit board pattern. Designed for women who love tech-inspired streetwear with a modern edge.",
    price: 39.99,
    discount: 10,
    category: "women",
    type: "tshirt",
    image: "/images/products/tshirt-women-1.jpg",
    images: ["/images/products/tshirt-women-1.jpg", "/images/products/tshirt-women-2.jpg"],
    colors: ["#000000", "#111827", "#1F2937"],
    sizes: ["S", "M", "L", "XL"],
    stock: 23,
    isNew: true,
    isSpecial: false,
    designType: "tech",
  },
  {
    id: 6,
    name: "EVO Sacred Geometry Tee",
    description: "Navy blue oversized t-shirt with golden geometric sacred mandala design. A masterpiece of precision and artistry on premium cotton fabric.",
    price: 59.99,
    discount: 0,
    category: "men",
    type: "tshirt",
    image: "/images/products/tshirt-4.jpg",
    images: ["/images/products/tshirt-4.jpg", "/images/products/tshirt-1.jpg"],
    colors: ["#1E3A5F", "#000000", "#FFFFFF"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 34,
    isNew: false,
    isSpecial: true,
    designType: "geometric",
  },
  {
    id: 7,
    name: "EVO Classic Logo Hoodie",
    description: "Dark grey hoodie with minimalist white EVO text logo. The essential piece for every streetwear wardrobe. Premium heavyweight cotton blend.",
    price: 79.99,
    discount: 25,
    category: "unisex",
    type: "hoodie",
    image: "/images/products/hoodie-2.jpg",
    images: ["/images/products/hoodie-2.jpg", "/images/products/hoodie-1.jpg"],
    colors: ["#374151", "#000000", "#1F2937"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 67,
    isNew: false,
    isSpecial: false,
    designType: "logo",
  },
  {
    id: 8,
    name: "EVO Graffiti Splash Tee",
    description: "White oversized t-shirt with vibrant multicolor graffiti street art splash design. Each piece tells a unique story of urban creativity.",
    price: 54.99,
    discount: 0,
    category: "men",
    type: "tshirt",
    image: "/images/products/tshirt-5.jpg",
    images: ["/images/products/tshirt-5.jpg", "/images/products/tshirt-2.jpg"],
    colors: ["#FFFFFF", "#000000"],
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    isNew: true,
    isSpecial: false,
    designType: "graffiti",
  },
  {
    id: 9,
    name: "EVO Rose Line Art Tee",
    description: "Black oversized t-shirt with delicate white floral line art rose design. A perfect blend of feminine elegance and streetwear boldness.",
    price: 47.99,
    discount: 5,
    category: "women",
    type: "tshirt",
    image: "/images/products/tshirt-women-2.jpg",
    images: ["/images/products/tshirt-women-2.jpg", "/images/products/tshirt-women-3.jpg"],
    colors: ["#000000", "#FFFFFF", "#808080"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    isNew: false,
    isSpecial: true,
    designType: "floral",
  },
  {
    id: 10,
    name: "EVO Tactical Olive Tee",
    description: "Olive green oversized military-style t-shirt with tactical patch and camo accent. Built for durability with a fashion-forward military aesthetic.",
    price: 52.99,
    discount: 0,
    category: "men",
    type: "tshirt",
    image: "/images/products/tshirt-6.jpg",
    images: ["/images/products/tshirt-6.jpg", "/images/products/tshirt-4.jpg"],
    colors: ["#556B2F", "#000000", "#3D4A1E"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 29,
    isNew: false,
    isSpecial: false,
    designType: "military",
  },
  {
    id: 11,
    name: "EVO Vaporwave Sunset Tee",
    description: "Pastel pink oversized t-shirt with retro 80s synthwave sun and palm tree design. A nostalgic journey to the golden era of neon aesthetics.",
    price: 44.99,
    discount: 10,
    category: "women",
    type: "tshirt",
    image: "/images/products/tshirt-women-3.jpg",
    images: ["/images/products/tshirt-women-3.jpg", "/images/products/tshirt-3.jpg"],
    colors: ["#FFC0CB", "#FFFFFF", "#FFB6C1"],
    sizes: ["S", "M", "L", "XL"],
    stock: 37,
    isNew: true,
    isSpecial: false,
    designType: "retro",
  },
  {
    id: 12,
    name: "EVO Collection Bundle",
    description: "Special bundle featuring three signature EVO designs at an exclusive price. Includes Geometric Lines, Zen Wave, and Classic Logo pieces.",
    price: 129.99,
    discount: 30,
    category: "unisex",
    type: "tshirt",
    image: "/images/hero/collection-flatlay.jpg",
    images: ["/images/hero/collection-flatlay.jpg", "/images/products/tshirt-1.jpg", "/images/products/tshirt-3.jpg"],
    colors: ["#000000", "#FFFFFF", "#F5F5DC"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    isNew: false,
    isSpecial: true,
    designType: "bundle",
  },
];

export const categories = [
  { id: "all", label: "All Products" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "unisex", label: "Unisex" },
];

export const designTypes = [
  "geometric",
  "abstract",
  "cyberpunk",
  "minimalist",
  "tech",
  "graffiti",
  "floral",
  "military",
  "retro",
  "logo",
  "bundle",
];

export const colorOptions = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Grey", value: "#808080" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Red", value: "#FF0000" },
  { name: "Violet", value: "#6B46C1" },
  { name: "Olive", value: "#556B2F" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Cream", value: "#F5F5DC" },
];
