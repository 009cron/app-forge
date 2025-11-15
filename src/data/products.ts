export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'espresso' | 'manual-brew' | 'pastries' | 'signature';
  featured?: boolean;
  popular?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Caramel Macchiato',
    description: 'Espresso with vanilla & caramel',
    price: 4.50,
    image: '/coffee-1.jpg',
    category: 'espresso',
    featured: true,
  },
  {
    id: '2',
    name: 'Caffè Latte',
    description: 'Rich espresso, steamed milk, and a light layer of foam.',
    price: 4.50,
    image: '/coffee-2.jpg',
    category: 'espresso',
  },
  {
    id: '3',
    name: 'Americano',
    description: 'Espresso shots topped with hot water, creating a light layer of crema.',
    price: 3.75,
    image: '/coffee-3.jpg',
    category: 'espresso',
  },
  {
    id: '4',
    name: 'Cappuccino',
    description: 'A perfect balance of espresso, steamed milk, and foam.',
    price: 4.50,
    image: '/coffee-4.jpg',
    category: 'espresso',
  },
  {
    id: '5',
    name: 'Kopi Susu Gula Aren',
    description: 'Our signature iced coffee with creamy milk and palm sugar.',
    price: 5.00,
    image: '/coffee-5.jpg',
    category: 'signature',
    featured: true,
  },
  {
    id: '6',
    name: 'Signature Aren Latte',
    description: 'Rich espresso, steamed milk, and sweet palm sugar.',
    price: 3.50,
    image: '/coffee-6.jpg',
    category: 'signature',
    featured: true,
  },
  {
    id: '7',
    name: 'V60 Pour Over',
    description: 'Single origin coffee brewed to perfection.',
    price: 5.00,
    image: '/coffee-7.jpg',
    category: 'manual-brew',
  },
  {
    id: '8',
    name: 'Almond Croissant',
    description: 'Flaky, buttery, and fresh',
    price: 3.00,
    image: '/pastry-1.jpg',
    category: 'pastries',
    popular: true,
  },
  {
    id: '9',
    name: 'Cinnamon Roll',
    description: 'Sweet, fluffy & warm',
    price: 3.75,
    image: '/pastry-2.jpg',
    category: 'pastries',
  },
  {
    id: '10',
    name: 'Croissant',
    description: 'Flaky, buttery, and fresh',
    price: 3.00,
    image: '/pastry-3.jpg',
    category: 'pastries',
  },
  {
    id: '11',
    name: 'Triple Choc Muffin',
    description: 'Rich and moist chocolate',
    price: 2.50,
    image: '/pastry-4.jpg',
    category: 'pastries',
    popular: true,
  },
  {
    id: '12',
    name: 'Choco Muffin',
    description: 'Rich and moist chocolate',
    price: 3.25,
    image: '/pastry-5.jpg',
    category: 'pastries',
  },
];

export const addOns: AddOn[] = [
  { id: 'extra-shot', name: 'Extra Espresso Shot', price: 1.00 },
  { id: 'oat-milk', name: 'Oat Milk', price: 0.75 },
  { id: 'vanilla', name: 'Vanilla Syrup', price: 0.50 },
  { id: 'caramel', name: 'Caramel Drizzle', price: 0.50 },
];
