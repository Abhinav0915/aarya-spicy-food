"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSegment, SEGMENTS } from "@/lib/segment-context";

export default function SegmentShowcase() {
  const { activeSegment, setActiveSegment } = useSegment();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
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
            Our Ecosystem
          </div>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One Kitchen,{" "}
            <span className="gradient-text">Many Flavours</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto text-lg">
            We're building a full cloud kitchen ecosystem. Tap a segment to preview its experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SEGMENTS.map((seg, i) => {
            const isActive = activeSegment === seg.id;
            return (
              <motion.button
                key={seg.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActiveSegment(seg.id)}
                className={`group relative rounded-3xl p-7 text-left transition-all duration-500 overflow-hidden ${
                  isActive
                    ? "scale-[1.02] border"
                    : "glass border border-white/5 hover:-translate-y-2 hover:border-white/15"
                }`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${seg.colors.primary}18, ${seg.colors.accent}0d)`,
                        borderColor: `${seg.colors.primary}40`,
                        boxShadow: `0 20px 60px ${seg.colors.primary}20`,
                      }
                    : {}
                }
              >
                {/* Background glow on hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl ${isActive ? "opacity-100" : ""}`}
                  style={{
                    background: `radial-gradient(ellipse at top left, ${seg.colors.primary}15 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="text-5xl mb-5">{seg.emoji}</div>

                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="font-display text-xl font-bold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {seg.label}
                    </h3>
                    {seg.status === "active" ? (
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${seg.colors.primary}25`, color: seg.colors.primary }}
                      >
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/8 text-white/40">
                        SOON
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-white/40 leading-relaxed mb-4">{seg.description}</p>

                  <div
                    className="text-xs font-semibold italic"
                    style={{ color: isActive ? seg.colors.accent : "rgba(255,255,255,0.25)" }}
                  >
                    "{seg.tagline}"
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 text-xs font-semibold flex items-center gap-1"
                      style={{ color: seg.colors.primary }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: seg.colors.primary }} />
                      Currently viewing
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
