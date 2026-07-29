"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { useSegment, SEGMENTS } from "@/lib/segment-context";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Plans", href: "#plans" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const orderLink = "/place-order";

export default function Navbar() {
  const { activeSegment, setActiveSegment, config } = useSegment();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [segmentOpen, setSegmentOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, var(--primary), var(--accent))`,
            }}
          >
            🌶️
          </div>
          <div>
            <div
              className="font-display font-bold text-lg leading-none gradient-text"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Aaryas
            </div>
            <div className="text-xs text-white/40 tracking-[0.2em] uppercase">
              Spicy Kitchen
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: "var(--primary)" }}
              />
            </a>
          ))}
        </div>

        {/* Segment Switcher */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setSegmentOpen(!segmentOpen)}
              className="flex items-center gap-2 glass-warm px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ color: "var(--primary)" }}
            >
              <span>{config.emoji}</span>
              <span>{config.label}</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${segmentOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {segmentOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-56 glass rounded-2xl p-2 border border-white/10"
                >
                  {SEGMENTS.map((seg) => (
                    <button
                      key={seg.id}
                      onClick={() => {
                        setActiveSegment(seg.id);
                        setSegmentOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        activeSegment === seg.id
                          ? "text-white"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                      style={
                        activeSegment === seg.id
                          ? {
                              background: `${seg.colors.primary}20`,
                              color: seg.colors.primary,
                            }
                          : {}
                      }
                    >
                      <span className="text-lg">{seg.emoji}</span>
                      <div className="text-left">
                        <div className="font-semibold">{seg.label}</div>
                        <div className="text-xs opacity-60">
                          {seg.description}
                        </div>
                      </div>
                      {seg.status === "coming-soon" && (
                        <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
                          Soon
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="tel:9286702253"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
            }}
          >
            <Phone size={14} />
            Call Now
          </a>
        </div>
        {/* Place a order */}
        {activeSegment === "gharSe" && (
          <a
            href={orderLink}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
            }}
          >
            <span>Place Order</span>
          </a>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white/70 hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2">
                Switch Segment
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SEGMENTS.map((seg) => (
                  <button
                    key={seg.id}
                    onClick={() => {
                      setActiveSegment(seg.id);
                      setMobileOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSegment === seg.id ? "text-white" : "text-white/50"
                    }`}
                    style={
                      activeSegment === seg.id
                        ? {
                            background: `${seg.colors.primary}20`,
                            color: seg.colors.primary,
                          }
                        : { background: "rgba(255,255,255,0.04)" }
                    }
                  >
                    <span>{seg.emoji}</span>
                    <span>{seg.label}</span>
                  </button>
                ))}
              </div>
              {activeSegment === "gharSe" && (
                <a
                  href={orderLink}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-white mt-2"
                  style={{
                    background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
                  }}
                >
                  <span>Place Order</span>
                </a>
              )}
              <a
                href="tel:9286702253"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-white mt-2"
                style={{
                  background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
                }}
              >
                <Phone size={14} />
                92867-02253
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
