"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";
import { SegmentProvider, useSegment } from "@/lib/segment-context";

type Category = "All" | "Lunch" | "Dinner" | "Add-ons";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "All">;
  tag?: string;
}

interface BasketItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Economic Lunch",
    description:
      "Dal, sabzi, roti, rice and salad for a wholesome midday meal.",
    price: 129,
    category: "Lunch",
    tag: "Most Loved",
  },
  {
    id: 2,
    name: "Premium Lunch",
    description:
      "A richer lunch plate with paneer, special curry and a sweet finish.",
    price: 179,
    category: "Lunch",
    tag: "Chef Pick",
  },
  {
    id: 3,
    name: "Economic Dinner",
    description: "Comforting dinner with a fresh sabzi, dal and warm rotis.",
    price: 129,
    category: "Dinner",
  },
  {
    id: 4,
    name: "Premium Dinner",
    description:
      "Restaurant-style dinner featuring a premium curry and classic sides.",
    price: 179,
    category: "Dinner",
    tag: "Popular",
  },
  {
    id: 5,
    name: "Extra Roti Pack",
    description: "Soft tawa rotis, perfect for extra servings.",
    price: 18,
    category: "Add-ons",
  },
  {
    id: 6,
    name: "Extra Sabzi",
    description: "Add an extra helping of your favorite sabzi.",
    price: 39,
    category: "Add-ons",
  },
  {
    id: 7,
    name: "Sweet Dish",
    description: "A small dessert to finish your meal on a sweet note.",
    price: 25,
    category: "Add-ons",
  },
];

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function PlaceOrderPageContent() {
  const router = useRouter();
  const { activeSegment } = useSegment();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [basket, setBasket] = useState<BasketItem[]>([]);

  useEffect(() => {
    if (activeSegment !== "gharSe") {
      router.replace("/");
    }
  }, [activeSegment, router]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const subtotal = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = basket.reduce((sum, item) => sum + item.quantity, 0);

  const addToBasket = (item: MenuItem) => {
    setBasket((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setBasket((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const whatsappLink = `https://wa.me/919286702253?text=${encodeURIComponent(
    `Hi! I’d like to place an order for:${basket
      .map(
        (item) =>
          `\n- ${item.quantity}x ${item.name} (${formatPrice(item.price)} each)`,
      )
      .join("")}${
      basket.length ? `\n\nSubtotal: ${formatPrice(subtotal)}` : ""
    }`,
  )}`;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Navbar />

      <main className="pt-28 px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-8 md:p-10 shadow-2xl"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-sm font-medium text-[var(--primary)]">
                  <Sparkles size={14} />
                  Freshly prepared, ready to order
                </div>
                <h1
                  className="mt-4 font-display text-4xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Place your order in{" "}
                  <span className="gradient-text">just a few taps</span>
                </h1>
                <p className="mt-4 text-base text-white/60 md:text-lg">
                  Browse our menu, pick your favorites, and build a basket for
                  lunch, dinner, or extra sides.
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Back to home
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.section>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.7fr_0.9fr]">
            <section className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {(["All", "Lunch", "Dinner", "Add-ons"] as Category[]).map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeCategory === category
                          ? "text-white"
                          : "text-white/50 hover:text-white/80"
                      }`}
                      style={
                        activeCategory === category
                          ? {
                              background:
                                "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                            }
                          : { background: "rgba(255,255,255,0.05)" }
                      }
                    >
                      {category}
                    </button>
                  ),
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-white">
                            {item.name}
                          </h2>
                          {item.tag && (
                            <span className="rounded-full bg-[rgba(232,168,48,0.15)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => addToBasket(item)}
                      className="mt-5 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02]"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      }}
                    >
                      <Plus size={16} />
                      Add to basket
                    </button>
                  </motion.article>
                ))}
              </div>
            </section>

            <aside className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 md:p-6 h-fit sticky top-24">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                    Basket
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">
                    Your order
                  </h2>
                </div>
                <div className="rounded-full bg-[rgba(249,115,22,0.12)] p-3 text-[var(--primary)]">
                  <ShoppingBag size={20} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.15)] p-4">
                {basket.length === 0 ? (
                  <div className="text-center py-6 text-sm text-white/55">
                    Your basket is empty. Add a few dishes to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {basket.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {item.name}
                          </div>
                          <div className="text-xs text-white/45">
                            {formatPrice(item.price)} each
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="rounded-full border border-white/10 p-1.5 text-white/70 transition hover:bg-white/10"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="rounded-full border border-white/10 p-1.5 text-white/70 transition hover:bg-white/10"
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3 rounded-2xl bg-white/5 p-4 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{itemCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                }}
              >
                Order on WhatsApp
                <ArrowRight size={16} />
              </a>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

export default function PlaceOrderPage() {
  return (
    <SegmentProvider>
      <PlaceOrderPageContent />
    </SegmentProvider>
  );
}
