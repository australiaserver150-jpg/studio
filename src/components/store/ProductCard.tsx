'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { createOrderAction } from '@/lib/actions';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleBuy = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You need to be logged in to make a purchase.',
      });
      router.push('/login');
      return;
    }

    setIsOrdering(true);
    try {
        await createOrderAction({
            productId: product.id,
            productTitle: product.title,
            userId: user.uid,
            userEmail: user.email!,
            price: product.price,
        });
        toast({
            title: 'Order Placed!',
            description: `Your order for ${product.title} has been received.`,
        });
    } catch(error) {
        toast({
            variant: 'destructive',
            title: 'Order Failed',
            description: 'There was a problem placing your order. Please try again.',
        });
    } finally {
        setIsOrdering(false);
    }
  };

  return (
    <Card className="flex flex-col bg-secondary/30 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader className="p-0">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover rounded-t-lg"
            data-ai-hint={product.imageHint}
          />
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-1 text-primary-foreground">{product.title}</CardTitle>
        <p className="text-sm font-semibold text-primary mb-2">{product.game}</p>
        <CardDescription>{product.desc}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <p className="text-2xl font-bold text-accent">${product.price.toFixed(2)}</p>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={authLoading || isOrdering} className="animate-neon-glow">
                    {isOrdering ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    Buy Now
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to purchase "{product.title}" for ${product.price.toFixed(2)}. Do you want to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBuy}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
