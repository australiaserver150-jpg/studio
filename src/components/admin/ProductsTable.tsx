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
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
import { ProductForm } from './ProductForm';
import type { Product } from '@/types';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { deleteProductAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const { toast } = useToast();

  const handleAddClick = () => {
    setEditingProduct(undefined);
    setIsSheetOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsSheetOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
        await deleteProductAction(productId);
        setProducts(products.filter(p => p.id !== productId));
        toast({
            title: "Success",
            description: "Product deleted successfully."
        });
    } catch(e) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete product."
        });
    }
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddClick}><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Game</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No products found.</TableCell>
                </TableRow>
            ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="rounded-sm"
                      data-ai-hint={product.imageHint}
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>{product.game}</TableCell>
                <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)} className="group" aria-label={`Edit ${product.title}`}>
                    <Edit className="h-4 w-4 transition-transform duration-200 group-hover:scale-125" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive group" aria-label={`Delete ${product.title}`}>
                            <Trash2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-125" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product "{product.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
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

      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</SheetTitle>
          <SheetDescription>
            {editingProduct
              ? "Update the details of the existing product."
              : "Fill out the form to add a new product to the store."}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
            <ProductForm product={editingProduct} onOpenChange={setIsSheetOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
