"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";

type BillingType = "single" | "both";

const economicItems = [
  "4 Tawa Roti",
  "Seasonal Dry Sabzi",
  "Dal Tadka / Yellow Dal Fry",
  "Steamed Rice",
  "Fresh Salad",
  "Pickle",
];

const premiumItems = [
  "4 Tawa Roti OR 2 Lachha Paratha",
  "Paneer Dish / Veg Curry",
  "Dal / Chole",
  "Veg Pulao",
  "Boondi Raita",
  "Salad & Pickle",
  "🍮 Sweet Dish",
];

const plans = [
  {
    name: "Economic",
    emoji: "🍱",
    tag: "Student Favourite",
    tagColor: "rgba(249,115,22,0.2)",
    tagText: "var(--primary)",
    singlePrice: 129,
    bothPrice: 199,
    monthSingle: 3099,
    monthBoth: 4599,
    items: economicItems,
    isPremium: false,
    desc: "Perfect for students and budget-conscious professionals who want wholesome meals.",
  },
  {
    name: "Premium",
    emoji: "👑",
    tag: "Most Popular",
    tagColor: "rgba(232,168,48,0.2)",
    tagText: "#E8A830",
    singlePrice: 179,
    bothPrice: 299,
    monthSingle: 3499,
    monthBoth: 7500,
    items: premiumItems,
    isPremium: true,
    desc: "An indulgent, restaurant-quality home meal — with a sweet finish every day.",
  },
];

function PricingCard({
  plan,
  billing,
  index,
}: {
  plan: typeof plans[0];
  billing: BillingType;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const price = billing === "single" ? plan.singlePrice : plan.bothPrice;
  const monthPrice = billing === "single" ? plan.monthSingle : plan.monthBoth;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
        plan.isPremium
          ? "premium-border"
          : "glass border border-white/10"
      }`}
      style={
        plan.isPremium
          ? {
              background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(232,168,48,0.05))",
            }
          : {}
      }
    >
      {/* Tag */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-4xl">{plan.emoji}</div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: plan.tagColor, color: plan.tagText }}
        >
          {plan.tag}
        </span>
      </div>

      <h3
        className="font-display text-2xl font-bold text-white mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {plan.name}
      </h3>
      <p className="text-sm text-white/40 mb-8 leading-relaxed">{plan.desc}</p>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-bold gradient-text">₹{price}</span>
          <span className="text-white/40 text-sm">/ meal</span>
        </div>
        <div className="text-sm text-white/40">
          or{" "}
          <span className="font-semibold" style={{ color: "var(--accent)" }}>
            ₹{monthPrice.toLocaleString("en-IN")}/month
          </span>{" "}
          subscription
        </div>
      </div>

      {/* Items */}
      <ul className="space-y-3 flex-1 mb-8">
        {plan.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-white/70">
            <Check
              size={14}
              className="mt-0.5 flex-shrink-0"
              style={{ color: "var(--primary)" }}
            />
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={`https://wa.me/919286702253?text=Hi! I'd like to subscribe to the ${plan.name} meal plan.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02]"
        style={
          plan.isPremium
            ? {
                background: `linear-gradient(135deg, var(--primary), var(--accent))`,
                color: "white",
                boxShadow: `0 8px 32px var(--glow-color)`,
              }
            : {
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)",
              }
        }
      >
        {plan.isPremium && <Sparkles size={14} />}
        Subscribe Now
      </a>
    </motion.div>
  );
}

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingType>("both");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="plans" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* BG glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 blur-3xl rounded-full"
        style={{ background: "var(--primary)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full glass-warm"
            style={{ color: "var(--primary)" }}
          >
            Meal Plans
          </div>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simple, <span className="gradient-text">Honest Pricing</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            No hidden charges. No confusion. Just good food at fair prices.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <div className="glass rounded-full p-1 flex gap-1">
            <button
              onClick={() => setBilling("single")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billing === "single"
                  ? "text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
              style={
                billing === "single"
                  ? { background: "var(--primary)" }
                  : {}
              }
            >
              Single Meal
            </button>
            <button
              onClick={() => setBilling("both")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billing === "both"
                  ? "text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
              style={
                billing === "both"
                  ? { background: "var(--primary)" }
                  : {}
              }
            >
              Lunch + Dinner
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <PricingCard key={i} plan={plan} billing={billing} index={i} />
          ))}
        </div>

        {/* Security deposit note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-3 glass rounded-2xl p-5 text-center"
        >
          <div className="text-2xl">🔒</div>
          <div>
            <div className="font-semibold text-white text-sm">
              ₹500 Fully Refundable Security Deposit
            </div>
            <div className="text-xs text-white/40 mt-0.5">
              No questions asked. Returned when you unsubscribe.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
