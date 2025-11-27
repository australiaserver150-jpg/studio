import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProducts } from '@/lib/firestore';
import ProductCard from '@/components/store/ProductCard';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          GameTopUp Zone
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Instantly top up your favorite games. Select a package below to get
          started and jump back into the action faster.
        </p>
      </section>

      <section>
        {products.length > 0 ? (
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
