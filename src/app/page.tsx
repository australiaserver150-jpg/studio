'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/firestore';
import ProductCard from '@/components/store/ProductCard';
import { useEffect, useState, useRef } from 'react';
import type { Product } from '@/types';
import { Loader2, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const productsRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productList = await getProducts();
        setProducts(productList);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleScrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      <section className="text-center py-10 md:py-20">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          GameTopUp Zone
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Instantly top up your favorite games. Select a package below to get
          started and jump back into the action faster.
        </p>
        <Button size="lg" onClick={handleScrollToProducts} className="animate-neon-glow">
            Start Top-up
        </Button>
      </section>

      <section ref={productsRef}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 rounded-lg border border-primary/20 p-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                     <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-10 w-2/5" />
                    </div>
                </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No Products Available</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <p className="text-muted-foreground mb-4">
                It looks like the store is currently empty.
              </p>
              {isAdmin && (
                <Button asChild>
                  <Link href="/admin">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add a New Product
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
