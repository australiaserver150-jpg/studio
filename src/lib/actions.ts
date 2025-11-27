'use server';

import { revalidatePath } from 'next/cache';
import { db } from './firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { Product, ProductSchema, Order, OrderSchema } from '@/types';

export async function addProductAction(productData: Omit<Product, 'id' | 'createdAt'>) {
  const validatedData = ProductSchema.omit({ id: true, createdAt: true }).parse(productData);

  await addDoc(collection(db, 'products'), {
    ...validatedData,
    createdAt: serverTimestamp(),
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateProductAction(
  productId: string,
  productData: Omit<Product, 'id' | 'createdAt'>
) {
  const validatedData = ProductSchema.omit({ id: true, createdAt: true }).parse(productData);
  const productRef = doc(db, 'products', productId);

  await updateDoc(productRef, validatedData);

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteProductAction(productId: string) {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createOrderAction(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) {
    const validatedData = OrderSchema.omit({ id: true, status: true, createdAt: true }).parse(orderData);

    await addDoc(collection(db, 'orders'), {
        ...validatedData,
        status: 'pending',
        createdAt: serverTimestamp(),
    });

    revalidatePath('/admin');
}

export async function updateOrderStatusAction(orderId: string, status: 'pending' | 'delivered') {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });

    revalidatePath('/admin');
}
