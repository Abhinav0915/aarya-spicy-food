"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown, User, Mail, AtSign, Moon, Sun } from "lucide-react";
import { useSegment, SEGMENTS } from "@/lib/segment-context";
import { useTheme } from "@/lib/theme-context";
import LatestOrderBanner from "@/components/ui/LatestOrderBanner";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Plans", href: "/#plans" },
  { label: "Menu", href: "/#menu" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const orderLink = "/place-order";

interface NavbarUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  token: string;
  isStaff?: boolean;
  isSuperuser?: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeSegment, setActiveSegment, config } = useSegment();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [segmentOpen, setSegmentOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authUser, setAuthUser] = useState<NavbarUser | null>(null);
  const isAdmin = Boolean(authUser?.isStaff || authUser?.isSuperuser);
  const isAdminArea = pathname?.startsWith("/admin") ?? false;
  const isAdminShell = isAdmin || isAdminArea;
  const logoHref = isAdminShell ? "/admin/orders" : "/#home";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadAuthUser = () => {
      const storedUser = window.localStorage.getItem("aaryaAuthUser");
      const storedToken = window.localStorage.getItem("aaryaAuthToken");

      if (!storedUser || !storedToken) {
        setAuthUser(null);
        return;
      }

      try {
        setAuthUser(JSON.parse(storedUser) as NavbarUser);
      } catch {
        window.localStorage.removeItem("aaryaAuthUser");
        window.localStorage.removeItem("aaryaAuthToken");
        setAuthUser(null);
      }
    };

    loadAuthUser();
    window.addEventListener("storage", loadAuthUser);
    window.addEventListener("aaryaAuthChanged", loadAuthUser);

    return () => {
      window.removeEventListener("storage", loadAuthUser);
      window.removeEventListener("aaryaAuthChanged", loadAuthUser);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem("aaryaAuthUser");
    window.localStorage.removeItem("aaryaAuthToken");
    window.dispatchEvent(new Event("aaryaAuthChanged"));
    setAuthUser(null);
    setProfileOpen(false);
    router.push("/");
  };

  const handleViewProfile = () => {
    setProfileOpen(false);
    router.push("/profile");
  };

  const handleViewAdminOrders = () => {
    setProfileOpen(false);
    router.push("/admin/orders");
  };

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );

  return (
    <>
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
        <a href={logoHref} className="flex items-center gap-3 group">
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
        {!isAdminShell && (
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
        )}

        {/* Segment Switcher */}
        {!isAdminShell && (
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
        )}
        {/* Place a order */}
        <div className="hidden lg:flex items-center gap-3">
          {themeToggle}

          {!isAdminShell && activeSegment === "gharSe" && (
            <a
              href={orderLink}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
              }}
            >
              <span>Place Order</span>
            </a>
          )}

          {authUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2.5 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/20 text-[var(--primary)]">
                  <User size={16} />
                </div>
                <span>{authUser.username || authUser.firstName}</span>
                <ChevronDown
                  size={14}
                  className={`transition ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.95)] p-2 shadow-xl"
                  >
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/20 text-[var(--primary)]">
                        <User size={18} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-white">
                        {authUser.firstName} {authUser.lastName}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                        <Mail size={12} />
                        <span>{authUser.email}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                        <AtSign size={12} />
                        <span>@{authUser.username}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleViewProfile}
                      className={`mt-2 w-full items-center rounded-xl px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 ${
                        isAdminShell ? "hidden" : "flex"
                      }`}
                    >
                      View Profile
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={handleViewAdminOrders}
                        className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10"
                      >
                        Admin Orders
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {themeToggle}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`text-white/70 hover:text-white transition-colors ${
              isAdminShell && !authUser ? "hidden" : ""
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
              {isAdminShell ? (
                <>
                  {authUser && (
                    <>
                      <a
                        href="/admin/orders"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white"
                        style={{
                          background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
                        }}
                      >
                        <span>Admin Orders</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    {!isAdminShell && <LatestOrderBanner />}
    </>
  );
}
