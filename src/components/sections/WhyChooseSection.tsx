"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Wallet, ShieldCheck, RefreshCw, Flame } from "lucide-react";

const features = [
  {
    icon: <Heart size={24} />,
    emoji: "❤️",
    title: "Home-Cooked Goodness",
    desc: "Freshly prepared every single day with love — just like Maa's kitchen.",
  },
  {
    icon: <Wallet size={24} />,
    emoji: "💰",
    title: "Affordable Plans",
    desc: "Student-friendly pricing designed so no one has to compromise on good food.",
  },
  {
    icon: <ShieldCheck size={24} />,
    emoji: "🧼",
    title: "Hygienic Preparation",
    desc: "Prepared in a spotless, certified kitchen with the freshest ingredients daily.",
  },
  {
    icon: <RefreshCw size={24} />,
    emoji: "🔄",
    title: "Daily Menu Rotation",
    desc: "No boring repetitive meals — a different delicious menu every single day.",
  },
  {
    icon: <Flame size={24} />,
    emoji: "🔥",
    title: "Fresh & Hot Delivery",
    desc: "Meals delivered piping hot, right to your doorstep at the perfect time.",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative glass rounded-2xl p-6 hover:border-white/20 border border-white/5 transition-all duration-500 hover:-translate-y-2 cursor-default overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, var(--glow-color) 0%, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="text-4xl mb-4">{feature.emoji}</div>
        <h3
          className="font-semibold text-lg mb-2 text-white group-hover:gradient-text transition-all"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {feature.title}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
      </div>

      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 opacity-10 rounded-tl-full transition-all duration-500 group-hover:opacity-20 group-hover:w-28 group-hover:h-28"
        style={{ background: "var(--primary)" }}
      />
    </motion.div>
  );
}

function StatCounter({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="font-display text-4xl md:text-5xl font-bold gradient-text"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {inView ? value : 0}{suffix}
      </motion.div>
      <div className="text-sm text-white/40 mt-1">{label}</div>
    </div>
  );
}

export default function WhyChooseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, var(--primary) 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full glass-warm"
            style={{ color: "var(--primary)" }}
          >
            Why Aaryas?
          </div>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Food Made With{" "}
            <span className="gradient-text">Love & Care</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            We're not just a food service. We're your home away from home.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-8 mb-20 max-w-lg mx-auto">
          <StatCounter value={500} label="Happy Customers" suffix="+" />
          <StatCounter value={7} label="Days a Week" />
          <StatCounter value={99} label="Freshness Guarantee" suffix="%" />
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
