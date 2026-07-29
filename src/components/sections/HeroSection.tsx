"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star, MapPin, Clock } from "lucide-react";
import { useSegment } from "@/lib/segment-context";

const FLOATING_ELEMENTS = [
  { emoji: "🌶️", size: "text-4xl", x: "10%", y: "20%", delay: 0, duration: 5 },
  { emoji: "🍛", size: "text-5xl", x: "80%", y: "15%", delay: 1, duration: 6 },
  { emoji: "🧅", size: "text-3xl", x: "15%", y: "70%", delay: 2, duration: 4.5 },
  { emoji: "🌿", size: "text-2xl", x: "75%", y: "65%", delay: 0.5, duration: 5.5 },
  { emoji: "🫙", size: "text-3xl", x: "85%", y: "45%", delay: 1.5, duration: 4 },
  { emoji: "🍚", size: "text-4xl", x: "5%", y: "45%", delay: 2.5, duration: 6.5 },
  { emoji: "✨", size: "text-2xl", x: "50%", y: "10%", delay: 0.8, duration: 3.5 },
  { emoji: "🥗", size: "text-3xl", x: "90%", y: "80%", delay: 1.8, duration: 5 },
];

const segmentHeroContent = {
  gharSe: {
    badge: "🏠 Now Serving in Bareilly",
    hindi: "मां के हाथ का स्वाद",
    headline: "Taste the Comfort of\nHome, Delivered\nFresh Everyday",
    sub: "Freshly prepared meals made with love, delivered to students and working professionals.",
    cta1: "View Plans",
    cta2: "Order Now", 
  },
  zomato: {
    badge: "🛵 Coming Soon on Zomato",
    hindi: "जल्द आ रहा है",
    headline: "Order Anytime,\nAnywhere —\nFast & Fresh",
    sub: "Soon you'll be able to order Aaryas' signature meals directly through Zomato.",
    cta1: "Get Notified",
    cta2: "Learn More",
  },
  swiggy: {
    badge: "⚡ Coming Soon on Swiggy",
    hindi: "जल्द आ रहा है",
    headline: "Lightning Fast\nDelivery of\nHomemade Food",
    sub: "Aaryas Spicy Kitchen is coming to Swiggy with the same love and freshness.",
    cta1: "Get Notified",
    cta2: "Learn More",
  },
  catering: {
    badge: "🎉 Party & Corporate Orders",
    hindi: "खास मौकों के लिए",
    headline: "Grand Celebrations\nDeserve Royal\nHomemade Food",
    sub: "Corporate meal plans, party orders, and event catering — coming soon from Aaryas.",
    cta1: "Get Notified",
    cta2: "Enquire Now",
  },
};

export default function HeroSection() {
  const { activeSegment } = useSegment();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const content = segmentHeroContent[activeSegment];

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated mesh background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ y }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, var(--primary) 0%, transparent 50%),
                         radial-gradient(ellipse at 80% 20%, var(--accent) 0%, transparent 50%),
                         radial-gradient(ellipse at 60% 80%, var(--primary-dark) 0%, transparent 50%)`,
          }}
        />
      </motion.div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating food elements */}
      {FLOATING_ELEMENTS.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute ${el.size} select-none pointer-events-none`}
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [0, -20, -8, -20, 0],
            rotate: [0, 5, -3, 5, 0],
            opacity: [0.4, 0.7, 0.5, 0.7, 0.4],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
        style={{ opacity }}
      >
        {/* Badge */}
        <motion.div
          key={`badge-${activeSegment}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-warm px-4 py-2 rounded-full text-sm font-medium mb-8"
          style={{ color: "var(--primary)" }}
        >
          {content.badge}
        </motion.div>

        {/* Hindi tagline */}
        <motion.div
          key={`hindi-${activeSegment}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl mb-4 opacity-60"
          style={{ fontFamily: "var(--font-hindi)", color: "var(--accent)" }}
        >
          {content.hindi}
        </motion.div>

        {/* Main headline */}
        <motion.h1
          key={`headline-${activeSegment}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {content.headline.split("\n").map((line, i) => (
            <span key={i} className="block">
              {i === 1 ? (
                <span className="gradient-text glow-text">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </motion.h1>

        {/* Sub */}
        <motion.p
          key={`sub-${activeSegment}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12"
        >
          {content.sub}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#plans"
            className="group flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
              boxShadow: `0 8px 32px var(--glow-color)`,
            }}
          >
            {content.cta1}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold glass border border-white/20 text-white hover:border-white/40 transition-all hover:scale-105"
          >
            {content.cta2}
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { icon: <Star size={14} />, text: "100% Homemade" },
            { icon: <MapPin size={14} />, text: "Bareilly Delivery" },
            { icon: <Clock size={14} />, text: "Daily Fresh" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-white/50"
            >
              <span style={{ color: "var(--primary)" }}>{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--bg-main), transparent)`,
        }}
      />
    </section>
  );
}
