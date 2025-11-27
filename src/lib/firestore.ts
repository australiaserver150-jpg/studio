import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Product, Order } from '@/types';

export async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const q = query(productsCol, orderBy('createdAt', 'desc'));
  const productSnapshot = await getDocs(q);
  const productList = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
  return productList;
}

export async function getOrders(): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, orderBy('createdAt', 'desc'));
  const orderSnapshot = await getDocs(q);
  const orderList = orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() // Convert Timestamp to Date
  })) as Order[];
  return orderList;
}
