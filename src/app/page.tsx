"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSegment, SegmentProvider } from "@/lib/segment-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import SegmentShowcase from "@/components/sections/SegmentShowcase";
import BreakfastSection from "@/components/sections/BreakfastSection";
import PricingSection from "@/components/sections/PricingSection";
import MenuSection from "@/components/sections/MenuSection";
import JourneySection from "@/components/sections/JourneySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";

function PageContent() {
  const { isTransitioning, activeSegment } = useSegment();

  return (
    <div className="relative min-h-screen">
      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] pointer-events-none"
            style={{ background: "var(--bg-main)", opacity: 0.7 }}
          />
        )}
      </AnimatePresence>

      <Navbar />

      <main>
        <HeroSection />
        <WhyChooseSection />
        <SegmentShowcase />

        {/* Show Ghar Se specific content only on gharSe segment */}
        <AnimatePresence mode="wait">
          {activeSegment === "gharSe" && (
            <motion.div
              key="gharse-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <BreakfastSection />
              <PricingSection />
              <MenuSection />
              <JourneySection />
              <TestimonialsSection />
            </motion.div>
          )}

          {activeSegment !== "gharSe" && (
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="py-40 px-4 text-center"
            >
              <div className="text-8xl mb-6">🚀</div>
              <h2
                className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Coming{" "}
                <span className="gradient-text">Very Soon</span>
              </h2>
              <p className="text-white/50 text-lg max-w-md mx-auto mb-8">
                We're working hard on this segment. In the meantime, check out our{" "}
                <strong className="text-white">Ghar Se</strong> tiffin service — live now!
              </p>
              <a
                href="https://wa.me/919286702253?text=Hi! I'd like to be notified when this service launches."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  boxShadow: "0 8px 32px var(--glow-color)",
                }}
              >
                🔔 Notify Me When Live
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <ContactSection />
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

export default function Home() {
  return (
    <SegmentProvider>
      <PageContent />
    </SegmentProvider>
  );
}
