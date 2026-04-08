// lib/products.ts
export interface Product {
  name: string;
  image: string;
}

export const products: Product[] = [
  { name: 'Black Handbag', image: '/products/product-1.jpg' },
  { name: 'Cream Handbag', image: '/products/product-2.jpg' },
  { name: 'Beige Heels', image: '/products/product-3.jpg' },
  { name: 'Black Heels', image: '/products/product-4.jpg' },
  { name: 'Gold Necklace', image: '/products/product-5.jpg' },
  { name: 'Gold Bangle', image: '/products/product-6.jpg' },
  { name: 'Pearl Necklace', image: '/products/product-7.jpg' },
  { name: 'Black Dress', image: '/products/product-8.jpg' },
  { name: 'Cream Pumps', image: '/products/product-9.jpg' },
  { name: 'Black Bag', image: '/products/product-10.jpg' },
  { name: 'Tan Heels', image: '/products/product-11.jpg' },
  { name: 'Black Pumps', image: '/products/product-12.jpg' },
];