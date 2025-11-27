'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatusAction } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMarkAsDelivered = async (order: Order) => {
    if (order.status === 'delivered') return;

    setLoadingOrderId(order.id);
    try {
      await updateOrderStatusAction(order.id, 'delivered');
      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === order.id ? { ...o, status: 'delivered' } : o
        )
      );
      toast({
        title: 'Success',
        description: 'Order marked as delivered.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update order status.',
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">No orders yet.</TableCell>
              </TableRow>
            ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.userEmail}</TableCell>
                <TableCell>{order.productTitle}</TableCell>
                <TableCell className="text-right">${order.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                disabled={order.status === 'delivered' || loadingOrderId === order.id}
                            >
                                {loadingOrderId === order.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Mark Delivered
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will mark the order for "{order.productTitle}" as delivered. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleMarkAsDelivered(order)}>
                                Confirm
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
    </div>
  );
}
