"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "B.Tech Student, Bareilly",
    emoji: "🎓",
    text: "Honestly the best decision I made after moving away from home. The food tastes exactly like maa banati thi. Dal Panchmel on Mondays is my absolute favourite!",
    rating: 5,
    plan: "Economic Plan",
  },
  {
    name: "Rahul Verma",
    role: "Software Engineer, Bareilly",
    emoji: "💼",
    text: "As a working professional, I don't have time to cook. Aaryas Spicy Kitchen has been a lifesaver. The Premium Plan is 100% worth it — the sweet dish every day is a bonus!",
    rating: 5,
    plan: "Premium Plan",
  },
  {
    name: "Anjali Gupta",
    role: "Hostel Resident, College Student",
    emoji: "🏠",
    text: "Mess food was terrible. Aaryas saved me! ₹3099/month for proper home food is a steal. The menu changes daily so I never get bored. Highly recommend to all hostel students.",
    rating: 5,
    plan: "Economic Plan",
  },
  {
    name: "Vikram Singh",
    role: "MBA Student, Bareilly",
    emoji: "📚",
    text: "The Shahi Paneer on Tuesdays in the premium plan is something I look forward to every week. Delivery is always on time and food arrives hot. 10/10.",
    rating: 5,
    plan: "Premium Plan",
  },
  {
    name: "Neha Agarwal",
    role: "Working Professional",
    emoji: "👩‍💻",
    text: "The ₹500 refundable deposit gave me the confidence to try it — no risk at all. And the food quality genuinely surprised me. Very hygienic, very tasty.",
    rating: 5,
    plan: "Economic Plan",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, [autoplay]);

  const prev = () => {
    setAutoplay(false);
    setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setAutoplay(false);
    setActive((p) => (p + 1) % testimonials.length);
  };

  const t = testimonials[active];

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{ background: `radial-gradient(ellipse at 50% 0%, var(--primary) 0%, transparent 60%)` }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full glass-warm"
            style={{ color: "var(--primary)" }}
          >
            Testimonials
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Loved by{" "}
            <span className="gradient-text">Students & Professionals</span>
          </h2>
        </motion.div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden"
          >
            {/* Quote mark */}
            <div
              className="absolute top-6 right-8 text-8xl leading-none font-display opacity-10 select-none"
              style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}
            >
              "
            </div>

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" style={{ color: "var(--accent)" }} />
                ))}
              </div>

              <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8 font-light">
                "{t.text}"
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: `linear-gradient(135deg, var(--primary)30, var(--accent)20)` }}
                  >
                    {t.emoji}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-white/40">{t.role}</div>
                  </div>
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "var(--primary)20", color: "var(--primary)" }}
                >
                  {t.plan}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAutoplay(false); setActive(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-8" : "w-1.5 bg-white/20"
                }`}
                style={i === active ? { background: "var(--primary)", width: "32px" } : {}}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
