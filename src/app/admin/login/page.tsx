"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { API_PATHS, apiUrl } from "@/lib/api";
import { SegmentProvider } from "@/lib/segment-context";

interface AdminUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  token: string;
  isStaff?: boolean;
  isSuperuser?: boolean;
}

function AdminLoginContent() {
  const router = useRouter();
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = window.localStorage.getItem("aaryaAuthUser");
    const storedToken = window.localStorage.getItem("aaryaAuthToken");

    if (!storedUser || !storedToken) return;

    try {
      const parsedUser = JSON.parse(storedUser) as AdminUser;
      if (parsedUser.isStaff || parsedUser.isSuperuser) {
        router.replace("/admin/orders");
      }
    } catch {
      window.localStorage.removeItem("aaryaAuthUser");
      window.localStorage.removeItem("aaryaAuthToken");
    }
  }, [router]);

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl(API_PATHS.adminLogin), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginIdentifier.trim(),
          email: loginIdentifier.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.detail || data?.message || "Unable to sign in.",
        );
      }

      const token = data.access || data.token || data.access_token || "";
      const userData = data.user || data.profile || {};
      const isAdmin = Boolean(
        userData.is_staff ||
          userData.isStaff ||
          userData.is_superuser ||
          userData.isSuperuser,
      );

      if (!token) {
        throw new Error("The server did not return a JWT token.");
      }

      if (!isAdmin) {
        throw new Error("This account does not have admin access.");
      }

      const user: AdminUser = {
        firstName: userData.first_name || userData.firstName || "",
        lastName: userData.last_name || userData.lastName || "",
        email: userData.email || "",
        username: userData.username || loginIdentifier.trim(),
        token,
        isStaff: Boolean(userData.is_staff || userData.isStaff),
        isSuperuser: Boolean(userData.is_superuser || userData.isSuperuser),
      };

      window.localStorage.setItem("aaryaAuthUser", JSON.stringify(user));
      window.localStorage.setItem("aaryaAuthToken", token);
      window.dispatchEvent(new Event("aaryaAuthChanged"));
      router.push("/admin/orders");
    } catch (requestError) {
      window.localStorage.removeItem("aaryaAuthUser");
      window.localStorage.removeItem("aaryaAuthToken");
      window.dispatchEvent(new Event("aaryaAuthChanged"));
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to sign in.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-center">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-sm font-medium text-[var(--primary)]">
              <ShieldCheck size={14} />
              Admin access
            </div>
            <h1
              className="mt-4 font-display text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Kitchen dashboard <span className="gradient-text">login</span>
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Sign in with a Django staff or superuser account to view and manage Ghar Se orders.
            </p>

            <form onSubmit={handleAdminLogin} className="mt-8 space-y-4">
              <label className="block text-sm font-medium text-white/70">
                <span className="mb-2 block">Username or email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                  <UserRound size={16} className="text-white/50" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(event) => setLoginIdentifier(event.target.value)}
                    placeholder="Enter admin username or email"
                    required
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-white/70">
                <span className="mb-2 block">Password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                  <Lock size={16} className="text-white/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-white/60 transition hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {error && (
                <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                }}
              >
                {isLoading ? "Checking access..." : "Open admin orders"}
                <ArrowRight size={16} />
              </button>
            </form>

            <Link
              href="/"
              className="mt-5 inline-flex text-sm font-semibold text-white/55 transition hover:text-white"
            >
              Back to home
            </Link>
          </motion.section>
        </div>
      </main>

    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <SegmentProvider>
      <AdminLoginContent />
    </SegmentProvider>
  );
}
