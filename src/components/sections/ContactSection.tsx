"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, MessageCircle, MapPin, Clock, Instagram } from "lucide-react";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* BG */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, var(--primary) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, var(--accent) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
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
            Get In Touch
          </div>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Taste{" "}
            <span className="gradient-text">Ghar Ka Khana?</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            Subscribe today, or just say hello — we'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* WhatsApp CTA */}
          <motion.a
            href="https://wa.me/919286702253?text=Hi! I'm interested in subscribing to Aaryas Spicy Kitchen tiffin service."
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group flex flex-col items-center justify-center gap-4 p-10 rounded-3xl text-center transition-all hover:scale-[1.02] hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #25D36620, #128C7E15)",
              border: "1px solid #25D36630",
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
            >
              <MessageCircle size={36} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Order on WhatsApp
              </div>
              <div className="text-white/50 text-sm">
                Chat with us to subscribe or ask anything
              </div>
              <div className="mt-3 text-lg font-semibold" style={{ color: "#25D366" }}>
                92867-02253
              </div>
            </div>
          </motion.a>

          {/* Phone CTA */}
          <motion.a
            href="tel:9286702253"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group flex flex-col items-center justify-center gap-4 p-10 rounded-3xl text-center glass border border-white/10 transition-all hover:scale-[1.02] hover:-translate-y-1 hover:border-white/20"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}
            >
              <Phone size={36} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Call Us Directly
              </div>
              <div className="text-white/50 text-sm">
                We're available daily for queries
              </div>
              <div className="mt-3 text-lg font-semibold gradient-text">
                92867-02253
              </div>
            </div>
          </motion.a>
        </div>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { icon: <MapPin size={20} />, label: "Serving Area", value: "Bareilly, UP" },
            { icon: <Clock size={20} />, label: "Delivery Timings", value: "Lunch 12–2 PM · Dinner 7–9 PM" },
            { icon: <Phone size={20} />, label: "Contact", value: "92867-02253" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div style={{ color: "var(--primary)" }}>{item.icon}</div>
              <div className="text-xs text-white/40 uppercase tracking-widest">{item.label}</div>
              <div className="text-sm font-medium text-white">{item.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
