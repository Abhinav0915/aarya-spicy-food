"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

type MealType = "lunch" | "dinner";
type PlanType = "economic" | "premium";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DayMenu {
  lunch: { dal: string; sabzi: string };
  dinner: { dal: string; sabzi: string };
}

const economicMenu: Record<string, DayMenu> = {
  Mon: { lunch: { dal: "Dal Panchmel", sabzi: "Gobi Aloo" }, dinner: { dal: "Yellow Moong Dal Tadka", sabzi: "Aloo Jeera Beans" } },
  Tue: { lunch: { dal: "Mix Dal", sabzi: "Jeera Aloo" }, dinner: { dal: "Dhaba-Style Chana Dal", sabzi: "Tori (Ghiya) Masala" } },
  Wed: { lunch: { dal: "Arhar Dal", sabzi: "Bhindi Masala" }, dinner: { dal: "Panchmel Dal", sabzi: "Chatpata Aloo Baingan" } },
  Thu: { lunch: { dal: "Masala Lauki Gravy Wali", sabzi: "Masala Aloo" }, dinner: { dal: "Masoor Dal Bhaba Style", sabzi: "Sukha Patta Gobhi" } },
  Fri: { lunch: { dal: "Malka ki Dal", sabzi: "Capsicum Aloo" }, dinner: { dal: "Arhar Dal Fry", sabzi: "Bhindi Do Pyaza" } },
  Sat: { lunch: { dal: "Chole", sabzi: "Poori (Special)" }, dinner: { dal: "Aloo Tamatar", sabzi: "Jeera Aloo" } },
  Sun: { lunch: { dal: "Kadhi Pakora", sabzi: "Special Pakora" }, dinner: { dal: "Aloo Tamatar", sabzi: "Kaddu & Poori" } },
};

const premiumMenu: Record<string, DayMenu> = {
  Mon: { lunch: { dal: "Pind-Style Amritsari Chole", sabzi: "Yellow Moong Dal Tadka" }, dinner: { dal: "Masala Lauki Gravy Wali", sabzi: "Masala Aloo" } },
  Tue: { lunch: { dal: "Shahi Paneer Masala", sabzi: "Dal Makhani" }, dinner: { dal: "Malka ki Dal", sabzi: "Capsicum Aloo" } },
  Wed: { lunch: { dal: "Punjabi Rajma Masala", sabzi: "Dhaba-Style Chana Dal" }, dinner: { dal: "Kadhai Mushroom", sabzi: "Moong-Masoor Dal" } },
  Thu: { lunch: { dal: "Malka Ki Dal", sabzi: "Shahi Paneer" }, dinner: { dal: "Panchmel Dal", sabzi: "Chatpata Aloo Baingan" } },
  Fri: { lunch: { dal: "Mattar Paneer Gravy", sabzi: "Panchmel Dal" }, dinner: { dal: "Moong-Masoor Dal", sabzi: "Bhindi Do Pyaza" } },
  Sat: { lunch: { dal: "Mattar Paneer Gravy", sabzi: "Soya Chunks Aloo" }, dinner: { dal: "Rajma Masala", sabzi: "Jeera Aloo" } },
  Sun: { lunch: { dal: "Kadai Paneer", sabzi: "Dal Makhani" }, dinner: { dal: "Arhar Dal Fry", sabzi: "Bhindi Do Pyaza" } },
};

const economicIncludes = ["4 Tawa Roti", "Steamed Rice", "Fresh Salad", "Pickle"];
const premiumIncludes = [
  "4 Tawa Roti or 2 Lachha Paratha",
  "Veg Pulao / Peas Pulao",
  "Raita of the day",
  "1 Sweet (Phirni / Suji Halwa / Kheer)",
  "Fresh Salad & Pickle",
];

export default function MenuSection() {
  const [activeDay, setActiveDay] = useState("Mon");
  const [activeMeal, setActiveMeal] = useState<MealType>("lunch");
  const [activePlan, setActivePlan] = useState<PlanType>("economic");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const menuData = activePlan === "economic" ? economicMenu : premiumMenu;
  const includes = activePlan === "economic" ? economicIncludes : premiumIncludes;
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
                  {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][days.indexOf(activeDay)]}
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
