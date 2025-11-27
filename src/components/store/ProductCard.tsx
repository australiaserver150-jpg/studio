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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import confetti from 'canvas-confetti';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isOrdering, setIsOrdering] = useState(false);
  const [gameUid, setGameUid] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchase = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You need to be logged in to make a purchase.',
      });
      router.push('/login');
      return;
    }

    if (!gameUid.trim()) {
      toast({
        variant: 'destructive',
        title: 'Game UID Required',
        description: 'Please enter your Game User ID to proceed.',
      });
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
        gameUid: gameUid,
      });

      toast({
        title: 'Order Placed!',
        description: `Your order for ${product.title} has been received.`,
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsModalOpen(false);
      setGameUid('');
    } catch (error) {
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
        <CardTitle className="font-headline text-xl mb-1 text-primary-foreground">
          {product.title}
        </CardTitle>
        <p className="text-sm font-semibold text-primary mb-2">
          {product.game}
        </p>
        <CardDescription>{product.desc}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <p className="text-2xl font-bold text-accent">${product.price.toFixed(2)}</p>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button disabled={authLoading} className="animate-neon-glow">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                Enter your Game User ID to complete the purchase for{' '}
                <span className="font-semibold text-primary">{product.title}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gameUid" className="text-right">
                  Game UID
                </Label>
                <Input
                  id="gameUid"
                  value={gameUid}
                  onChange={(e) => setGameUid(e.target.value)}
                  placeholder="Your in-game user ID"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handlePurchase} disabled={isOrdering}>
                {isOrdering && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm for ${product.price.toFixed(2)}
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
