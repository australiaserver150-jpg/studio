import { z } from 'zod';

// Zod Schema for Product
export const ProductSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  game: z.string().min(2, 'Game title must be at least 2 characters'),
  price: z.number().positive('Price must be a positive number'),
  desc: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url().optional(),
  imageHint: z.string().optional(),
  createdAt: z.any(),
});

export type Product = z.infer<typeof ProductSchema>;

// Zod Schema for Order
export const OrderSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productTitle: z.string(),
  userId: z.string(),
  userEmail: z.string().email(),
  price: z.number(),
  gameUid: z.string().min(1, 'Game UID is required'),
  status: z.enum(['pending', 'delivered']),
  createdAt: z.any(),
});

export type Order = z.infer<typeof OrderSchema> & {
    createdAt: Date; // Overriding 'any' for client-side use
};


// Zod Schema for GameUser
export const GameUserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  role: z.string().optional(),
  createdAt: z.any(),
});

export type GameUser = z.infer<typeof GameUserSchema>;
