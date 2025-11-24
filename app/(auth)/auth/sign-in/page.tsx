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
import {
  ArrowRight,
  Mail,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Lock,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const LoginPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  const features = [
    { icon: Shield, text: "Enterprise-grade security" },
    { icon: Zap, text: "Lightning-fast AI search" },
    { icon: Heart, text: "Free forever" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

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
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-2/3 left-1/3 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col justify-between p-12 relative"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
            <Image src="/logo.png" alt="Pixn" fill className="object-contain" />
          </div>
          <span className="text-2xl font-bold">Pixn</span>
        </Link>

        <div className="space-y-8 max-w-md">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Your personal gallery</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold leading-tight"
            >
              Store & Search
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Your Memories
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground"
            >
              Secure, AI-powered image gallery that makes finding and organizing
              your photos effortless.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, i) =>
                  i === activeFeature && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur border border-border"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">
                        {feature.text}
                      </span>
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            <div className="flex gap-1.5 pt-2">
              {features.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeFeature
                      ? "w-12 bg-primary"
                      : "w-8 bg-primary/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 pt-6 border-t border-border"
          >
            {[
              "No credit card required",
              "Free forever",
              "Your data stays private",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-sm text-muted-foreground">
          © 2025 Pixn. All rights reserved.
        </p>
      </motion.div>

      {/* Right Side - Sign In Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo */}
          <Link
            href="/"
            className="flex lg:hidden items-center gap-3 justify-center"
          >
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
            <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to access your gallery
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={signInWithGoogle}
              variant="outline"
              size="lg"
              className="w-full gap-3 py-6 text-base font-medium group hover:bg-secondary hover:border-primary/50 transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <GoogleLogo />
              <span className="relative z-10">Continue with Google</span>
              <ArrowRight className="ml-auto w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Button>

            <div className="relative flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground px-2">OR</span>
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
                      <FormLabel className="text-sm font-medium">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-11 py-6 text-base bg-secondary/30 border-transparent focus-visible:bg-background focus-visible:border-primary/50 transition-all"
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
                  className="w-full py-6 text-base font-medium group relative overflow-hidden"
                  disabled={form.formState.isSubmitting}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {form.formState.isSubmitting ? (
                      "Sending magic link..."
                    ) : (
                      <>
                        Continue with Email
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground pt-4">
              <p>
                By signing in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline hover:text-foreground transition-colors"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            <div className="text-center text-sm lg:hidden">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <span className="text-foreground font-medium">
                  Sign up is automatic
                </span>
              </p>
            </div>
          </div>
        </motion.div>
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
