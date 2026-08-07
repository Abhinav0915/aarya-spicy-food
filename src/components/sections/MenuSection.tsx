"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  dayNames,
  days,
  getIncludesForPlan,
  getMenuForPlan,
  type DayKey,
  type MealType,
  type PlanType,
} from "@/lib/daily-menu";

export default function MenuSection() {
  const [activeDay, setActiveDay] = useState<DayKey>("Mon");
  const [activeMeal, setActiveMeal] = useState<MealType>("lunch");
  const [activePlan, setActivePlan] = useState<PlanType>("economic");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const menuData = getMenuForPlan(activePlan);
  const includes = getIncludesForPlan(activePlan);
  const meal = menuData[activeDay][activeMeal];

  return (
    <section id="menu" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
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
            Weekly Menu
          </div>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fresh Menu,{" "}
            <span className="gradient-text">Every Day</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            A rotating menu that keeps things exciting — never the same meal twice in a week.
          </p>
        </motion.div>

        {/* Plan toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="glass rounded-full p-1 flex gap-1">
            {(["economic", "premium"] as PlanType[]).map((plan) => (
              <button
                key={plan}
                onClick={() => setActivePlan(plan)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                  activePlan === plan ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
                style={activePlan === plan ? { background: "var(--primary)" } : {}}
              >
                {plan === "premium" ? "👑 " : "🍱 "}
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Day tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-2 flex gap-1 mb-6 overflow-x-auto"
        >
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 min-w-[52px] py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeDay === day ? "text-white scale-[1.02]" : "text-white/40 hover:text-white/60"
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

        {/* Meal toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-3 mb-8"
        >
          {(["lunch", "dinner"] as MealType[]).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMeal(m)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeMeal === m ? "text-white" : "glass text-white/50 hover:text-white/70"
              }`}
              style={activeMeal === m ? { background: "var(--primary)" } : {}}
            >
              {m === "lunch" ? "☀️" : "🌙"}{" "}
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Menu card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeDay}-${activeMeal}-${activePlan}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass rounded-3xl p-8"
          >
            {/* Header row */}
            <div className="flex items-center gap-3 mb-8">
              <div className="text-3xl">{activeMeal === "lunch" ? "☀️" : "🌙"}</div>
              <div>
                <div className="font-semibold text-white text-lg">
                  {activeMeal === "lunch" ? "Lunch" : "Dinner"} —{" "}
                  {dayNames[activeDay]}
                </div>
                <div className="text-xs text-white/40 mt-0.5">
                  {activePlan === "premium" ? "👑 Premium Plan" : "🍱 Economic Plan"} · Freshly prepared · Delivered hot
                </div>
              </div>
            </div>

            {/* Main dishes */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="glass rounded-2xl p-5">
                <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Dal / Main Curry</div>
                <div className="text-base font-semibold text-white">{meal.dal}</div>
              </div>
              <div className="glass rounded-2xl p-5">
                <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Sabzi</div>
                <div className="text-base font-semibold text-white">{meal.sabzi}</div>
              </div>
            </div>

            {/* Always includes */}
            <div>
              <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Always Included</div>
              <div className="flex flex-wrap gap-2">
                {includes.map((item, i) => (
                  <span
                    key={i}
                    className="text-sm px-3 py-1.5 rounded-full glass border border-white/10 text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Extra note */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/35">
              <span>Extra Roti: ₹9 for 2</span>
              <span>·</span>
              <span>Extra Sabzi: ₹39</span>
              <span>·</span>
              <span>Subject to seasonal availability</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
