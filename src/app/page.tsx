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
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const productsRef = useRef<HTMLDivElement>(null);

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
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
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
            <CardContent>
              <p className="text-muted-foreground">
                The administrator has not added any products yet. Please check
                back later.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
