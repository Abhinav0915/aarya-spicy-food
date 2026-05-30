"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { emoji: "📋", step: "01", title: "Choose Your Plan", desc: "Pick Economic or Premium — single meal or lunch + dinner combo." },
  { emoji: "✅", step: "02", title: "Subscribe", desc: "Pay the ₹500 refundable deposit and your first month's plan." },
  { emoji: "👨‍🍳", step: "03", title: "We Cook Daily", desc: "Our kitchen prepares fresh meals every morning with the best ingredients." },
  { emoji: "🛵", step: "04", title: "Delivered Fresh", desc: "Your hot meal arrives right at your door at the scheduled time." },
  { emoji: "😋", step: "05", title: "Enjoy Ghar Ka Khana", desc: "Taste the love in every bite — just like home." },
];

export default function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* BG */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, var(--primary) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
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
            How It Works
          </div>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Journey to{" "}
            <span className="gradient-text">Ghar Ka Khana</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-0 right-0 h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="h-full origin-left"
              style={{
                background: `linear-gradient(90deg, var(--primary), var(--accent), var(--primary))`,
                opacity: 0.3,
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div
                    className="w-28 h-28 rounded-full glass flex flex-col items-center justify-center border border-white/10 transition-all hover:scale-110 hover:border-white/20 cursor-default"
                    style={{
                      boxShadow: `0 0 0 1px var(--primary)20`,
                    }}
                  >
                    <span className="text-4xl mb-1">{step.emoji}</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {step.step}
                    </span>
                  </div>

                  {/* Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(ellipse, var(--glow-color) 0%, transparent 70%)`,
                    }}
                  />
                </div>

                <h3
                  className="font-display font-semibold text-white text-lg mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
