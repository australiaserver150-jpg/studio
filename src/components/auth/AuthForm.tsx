'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { FirebaseError } from 'firebase/app';

const handleFirebaseError = (error: unknown, toast: any) => {
    let message = "An unexpected error occurred. Please try again.";
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                message = "Invalid email or password.";
                break;
            case 'auth/email-already-in-use':
                message = "This email is already in use.";
                break;
            case 'auth/weak-password':
                message = "Password should be at least 6 characters.";
                break;
            case 'auth/invalid-email':
                message = "Please enter a valid email address.";
                break;
            default:
                message = `An error occurred: ${error.message}`;
        }
    }
    toast({ variant: 'destructive', title: 'Authentication Error', description: message });
}


const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const resetSchema = z.object({
    email: z.string().email("Please enter a valid email to reset your password."),
});

export function AuthForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });


  async function onSignIn(values: z.infer<typeof signInSchema>) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Success', description: "You're now signed in." });
    } catch (error) {
      handleFirebaseError(error, toast);
    } finally {
      setLoading(false);
    }
  }
  
  async function onSignUp(values: z.infer<typeof signUpSchema>) {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Welcome!', description: 'Your account has been created.' });
    } catch (error) {
        handleFirebaseError(error, toast);
    } finally {
      setLoading(false);
    }
  }

  async function onReset(values: z.infer<typeof resetSchema>) {
    setLoading(true);
    try {
        await sendPasswordResetEmail(auth, values.email);
        toast({ title: 'Check your email', description: 'A password reset link has been sent to your email.' });
    } catch (error) {
        handleFirebaseError(error, toast);
    } finally {
        setLoading(false);
    }
  }

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <div className="space-y-4 pt-4">
            <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                <FormField control={signInForm.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={signInForm.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
            </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <GoogleSignInButton disabled={loading} />
        </div>
      </TabsContent>
      <TabsContent value="signup">
      <div className="space-y-4 pt-4">
            <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                <FormField control={signUpForm.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={signUpForm.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
            </form>
            </Form>
        </div>
      </TabsContent>
      <div className="mt-4 text-center text-sm">
        <Tabs defaultValue="main" className='w-full'>
            <TabsContent value="main">
                <TabsList className='bg-transparent p-0 h-auto'>
                    <TabsTrigger value="reset" className='text-muted-foreground hover:text-primary p-0 text-sm font-normal' >Forgot your password?</TabsTrigger>
                </TabsList>
            </TabsContent>
            <TabsContent value="reset">
                <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(onReset)} className='space-y-2'>
                        <FormField control={resetForm.control} name="email" render={({field}) => (
                            <FormItem>
                                <FormControl><Input placeholder="Enter your email to reset password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button variant="link" type="submit" className='w-full' disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Reset Link
                        </Button>
                    </form>
                </Form>
            </TabsContent>
        </Tabs>
      </div>
    </Tabs>
  );
}
