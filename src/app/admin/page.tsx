'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProducts, getOrders } from '@/lib/firestore';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Order, Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

function AdminPageSkeleton() {
    return (
        <div className="space-y-6">
             <div>
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-4 w-96 mt-2" />
            </div>
            <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="products">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Management</CardTitle>
                            <CardDescription>Add, edit, or remove top-up packages.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                           </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}


export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        try {
            const [productData, orderData] = await Promise.all([
                getProducts(),
                getOrders()
            ]);
            setProducts(productData);
            setOrders(orderData);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [])


  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage products and process customer orders.
        </p>
      </div>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
            <Card>
                <CardHeader>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Add, edit, or remove top-up packages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductsTable products={products} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="orders">
            <Card>
                <CardHeader>
                    <CardTitle>Order Processing</CardTitle>
                    <CardDescription>View and manage incoming top-up orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrdersTable initialOrders={orders} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
