import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProducts, getOrders } from '@/lib/firestore';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage() {
  const products = await getProducts();
  const orders = await getOrders();

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
                    <OrdersTable orders={orders} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
