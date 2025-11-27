'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/types';
import { addProductAction, updateProductAction, generateDescriptionAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

const FormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  game: z.string().min(2, 'Game title must be at least 2 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  desc: z.string().min(10, 'Description must be at least 10 characters.'),
  imageId: z.string().min(1, 'Please select an image.'),
});

type ProductFormValues = z.infer<typeof FormSchema>;

interface ProductFormProps {
  product?: Product;
  onOpenChange: (open: boolean) => void;
}

export function ProductForm({ product, onOpenChange }: ProductFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: product?.title || '',
      game: product?.game || '',
      price: product?.price || 0,
      desc: product?.desc || '',
      imageId: PlaceHolderImages.find(p => p.imageUrl === product?.imageUrl)?.id || '',
    },
  });

  const handleGenerateDescription = async () => {
    const { title, game } = form.getValues();
    if (!title || !game) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a Product Title and Game Title first.',
      });
      return;
    }

    setIsGenerating(true);
    const result = await generateDescriptionAction(title, game);
    if (result.description) {
      form.setValue('desc', result.description);
      toast({
        title: 'Description Generated!',
        description: 'The AI-powered description has been added.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Could not generate description.',
      });
    }
    setIsGenerating(false);
  };


  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    const selectedImage = PlaceHolderImages.find(p => p.id === data.imageId);

    if (!selectedImage) {
        toast({ variant: 'destructive', title: 'Error', description: 'Invalid image selected.' });
        setIsSubmitting(false);
        return;
    }

    const productData = {
        title: data.title,
        game: data.game,
        price: data.price,
        desc: data.desc,
        imageUrl: selectedImage.imageUrl,
        imageHint: selectedImage.imageHint,
    };

    try {
      if (product) {
        await updateProductAction(product.id, productData);
        toast({ title: 'Success', description: 'Product updated successfully.' });
      } else {
        await addProductAction(productData);
        toast({ title: 'Success', description: 'Product added successfully.' });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1000 Cosmic Crystals" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="game"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Galaxy Warriors" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Description</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                  )}
                  Generate with AI
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="A brief, engaging description of the product."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an image" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {PlaceHolderImages.map((image) => (
                        <SelectItem key={image.id} value={image.id}>
                            <div className="flex items-center gap-2">
                                <Image src={image.imageUrl} alt={image.description} width={24} height={24} className="rounded-sm" />
                                <span>{image.description}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
