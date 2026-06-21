import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-red-500/30">
      {/* Ambient background — spans the whole page */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-[100%] bg-red-900/20 opacity-60 blur-[130px]" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[800px] rounded-[100%] bg-red-900/10 opacity-40 blur-[110px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="landing-noise absolute inset-0 opacity-[0.025]" />
      </div>

      <LandingNav />

      <main>
        <Hero />
        <HowItWorks />
        <Features />
      </main>

      <Footer />
    </div>
  );
}
