"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const LoginPage = () => {
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          redirectTo: `${window.location.origin}/auth/confirm`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sign in");
      }

      toast.success("Check your email for a confirmation link.", {
        position: "top-right",
      });
      form.reset();
    } catch (error) {
      toast.error("An error occurred while signing in - try again later.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10">
      {/* Animated background - shared across both sides */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative">{/* Removed duplicate background classes */}

        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="Pixn"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-bold">Pixn</span>
        </Link>

        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <div className="inline-block p-2 rounded-xl bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Welcome back to your creative space
            </h2>
            <p className="text-lg text-muted-foreground">
              Sign in to access your beautiful image gallery and continue showcasing your best work.
            </p>
          </div>

          <div className="pt-6 space-y-4">
            {[
              "Securely store your images",
              "Organize with favorites",
              "Access anytime, anywhere",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          © 2025 Pixn. All rights reserved.
        </p>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 justify-center">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Pixn"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold">Pixn</span>
          </Link>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Sign in to Pixn</h1>
            <p className="text-muted-foreground">
              Choose your preferred sign-in method
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={signInWithGoogle}
              variant="outline"
              size="lg"
              className="w-full gap-3 py-6 text-base font-medium group hover:bg-secondary transition-all"
            >
              <GoogleLogo />
              Continue with Google
              <ArrowRight className="ml-auto w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="relative flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground px-2 bg-background">OR</span>
              <Separator className="flex-1" />
            </div>

            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-11 py-6 text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full py-6 text-base font-medium group"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    "Sending magic link..."
                  ) : (
                    <>
                      Continue with Email
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-6 border-t">
            <p>
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">
                Sign up is automatic
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoogleLogo = () => (
  <svg
    width="1.2em"
    height="1.2em"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M15.6823 8.18368C15.6823 7.63986 15.6382 7.0931 15.5442 6.55811H7.99829V9.63876H12.3194C12.1401 10.6323 11.564 11.5113 10.7203 12.0698V14.0687H13.2983C14.8122 12.6753 15.6823 10.6176 15.6823 8.18368Z"
        fill="#4285F4"
      />
      <path
        d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
        fill="#34A853"
      />
      <path
        d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
        fill="#FBBC04"
      />
      <path
        d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="15.6825" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default LoginPage;
