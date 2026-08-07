"use client";

import { useSegment } from "@/lib/segment-context";

export default function Footer() {
  const { config } = useSegment();

  return (
    <footer className="border-t border-white/8 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}
              >
                🌶️
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-none gradient-text" style={{ fontFamily: "var(--font-display)" }}>
                  Aaryas Spicy Kitchen
                </div>
                <div className="text-xs text-white/30 tracking-[0.15em] uppercase">Cloud Kitchen · Bareilly</div>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Authentic homemade food delivered daily to students and working professionals in Bareilly with love.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs uppercase tracking-widest text-white/30 mb-4">Quick Links</div>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/#home" },
                { label: "Meal Plans", href: "/#plans" },
                { label: "Weekly Menu", href: "/#menu" },
                { label: "About", href: "/#about" },
                { label: "Contact", href: "/#contact" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs uppercase tracking-widest text-white/30 mb-4">Contact</div>
            <div className="space-y-3 text-sm text-white/50">
              <div>📞 <a href="tel:9286702253" className="hover:text-white transition-colors">92867-02253</a></div>
              <div>💬 <a href="https://wa.me/919286702253" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Us</a></div>
              <div>📍 Bareilly, Uttar Pradesh</div>
              <div className="pt-2">
                <div className="text-xs text-white/30 mb-1">Security Deposit</div>
                <div className="text-white/70">₹500 Fully Refundable</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <div>© {new Date().getFullYear()} Aaryas Spicy Kitchen. All rights reserved.</div>
          <div>Made with ❤️ in Bareilly · Currently active: <span style={{ color: "var(--primary)" }}>{config.label}</span></div>
        </div>
      </div>
    </footer>
  );
}
