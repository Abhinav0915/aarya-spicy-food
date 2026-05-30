"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Real data from DAILY_ROTATION_MENU.pdf — two breakfast options per day
const breakfastMenu: Record<string, { option1: string; option2: string }> = {
  Mon: {
    option1: "Idli with Coconut Chutney",
    option2: "Vegetable Upma with Mint Chutney",
  },
  Tue: {
    option1: "Homestyle Aloo Paratha (2 pcs) with Fresh Curd",
    option2: "Homestyle Aloo Pyaaz Paratha (2 pcs) with Fresh Curd",
  },
  Wed: {
    option1: "Indori Poha with Mustard Seeds & Curry Leaves",
    option2: "Grilled Aloo Sandwich (2 pcs) with Green Chutney",
  },
  Thu: {
    option1: "Bedmi Poori (4 pcs) with Jeera Aloo Sabzi",
    option2: "Grilled Paneer Sandwich (2 pcs) with Green Chutney",
  },
  Fri: {
    option1: "Soft Vegetable Rava Upma with Mint-Coriander Chutney",
    option2: "Grilled Vegetable Sandwich (2 pcs) with Green Chutney",
  },
  Sat: {
    option1: "Aloo Poori (4 pcs) with Suji Halwa",
    option2: "Vegetable Poha with Sweet-Tangy Imli Chutney",
  },
  Sun: {
    option1: "Paneer Paratha (2 pcs) with Fresh Sweet Lassi",
    option2: "Grilled Cheese & Corn Sandwich (2 pcs)",
  },
};

export default function BreakfastSection() {
  const [activeDay, setActiveDay] = useState("Mon");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const menu = breakfastMenu[activeDay];

  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <div
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full glass-warm"
            style={{ color: "var(--primary)" }}
          >
            Breakfast
          </div>
          <h2
            className="font-display text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Morning Fuel,{" "}
            <span className="gradient-text">Every Day</span>
          </h2>
          <p className="text-white/40 mt-3 text-sm">
            Everything at ₹99 · Extra Paratha ₹20 · Extra Sabzi ₹29
          </p>
        </motion.div>

        {/* Day tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-2 flex gap-1 mb-6"
        >
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeDay === day ? "text-white" : "text-white/40 hover:text-white/60"
              }`}
              style={
                activeDay === day
                  ? { background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }
                  : {}
              }
            >
              {day}
            </button>
          ))}
        </motion.div>

        {/* Breakfast options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4"
          >
            {[
              { label: "Option A", icon: "🌅", value: menu.option1 },
              { label: "Option B", icon: "✨", value: menu.option2 },
            ].map((opt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 flex items-start gap-4 border border-white/8 hover:border-white/15 transition-all"
              >
                <div className="text-3xl">{opt.icon}</div>
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: "var(--primary)" }}
                  >
                    {opt.label}
                  </div>
                  <div className="text-white font-medium">{opt.value}</div>
                </div>
                <div
                  className="ml-auto text-lg font-bold flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                >
                  ₹99
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
