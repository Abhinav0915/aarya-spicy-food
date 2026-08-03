"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  User,
  LogOut,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SegmentProvider } from "@/lib/segment-context";

interface ProfileUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  token: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = window.localStorage.getItem("aaryaAuthUser");
    const storedToken = window.localStorage.getItem("aaryaAuthToken");

    if (!storedUser || !storedToken) {
      router.replace("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser) as ProfileUser;
    setUser(parsedUser);
    setFirstName(parsedUser.firstName || "");
    setLastName(parsedUser.lastName || "");
    setEmail(parsedUser.email || "");
  }, [router]);

  const handleLogout = () => {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem("aaryaAuthUser");
    window.localStorage.removeItem("aaryaAuthToken");
    router.push("/");
  };

  const persistUser = (updatedUser: ProfileUser) => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem("aaryaAuthUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("aaryaAuthToken")
        : "";

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleProfileUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Unable to update profile.",
        );
      }

      const updatedUser = {
        ...(user as ProfileUser),
        firstName: data.user?.first_name || firstName.trim(),
        lastName: data.user?.last_name || lastName.trim(),
        email: data.user?.email || email.trim(),
      };

      persistUser(updatedUser);
      setStatusType("success");
      setStatusMessage("Profile updated successfully.");
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSaving(true);

    if (newPassword !== confirmPassword) {
      setStatusType("error");
      setStatusMessage("New passwords do not match.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/change-password/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirm: confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Unable to change password.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setStatusType("success");
      setStatusMessage("Password changed successfully.");
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to change password.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (typeof window === "undefined") return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    setStatusMessage("");
    setIsDeleting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/delete-user/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Unable to delete account.",
        );
      }

      window.localStorage.removeItem("aaryaAuthUser");
      window.localStorage.removeItem("aaryaAuthToken");
      router.push("/");
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to delete account.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SegmentProvider>
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
        <Navbar />

        <main className="px-4 pb-20 pt-28 sm:px-6">
          <div className="mx-auto flex max-w-4xl items-center justify-center">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  <ArrowLeft size={16} />
                  Back home
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>

              <div className="mt-8 flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/20 text-[var(--primary)]">
                  <User size={32} />
                </div>
                <h1 className="mt-5 text-3xl font-semibold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="mt-2 text-sm text-white/60">
                  Welcome back to your account.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                    <User size={16} />
                    Username
                  </div>
                  <p className="mt-2 text-base text-white">@{user.username}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                    <Mail size={16} />
                    Email
                  </div>
                  <p className="mt-2 text-base text-white">{user.email}</p>
                </div>
              </div>

              {statusMessage && (
                <div
                  className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                    statusType === "success"
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                      : "border-red-400/30 bg-red-500/10 text-red-200"
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <form
                  onSubmit={handleProfileUpdate}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <h2 className="text-lg font-semibold text-white">
                    Update profile
                  </h2>
                  <div className="mt-4 space-y-4">
                    <label className="block text-sm font-medium text-white/70">
                      <span className="mb-2 block">First name</span>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                        placeholder="First name"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/70">
                      <span className="mb-2 block">Last name</span>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                        placeholder="Last name"
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/70">
                      <span className="mb-2 block">Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="mt-5 w-full rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : "Save profile"}
                  </button>
                </form>

                <form
                  onSubmit={handlePasswordChange}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <h2 className="text-lg font-semibold text-white">
                    Change password
                  </h2>
                  <div className="mt-4 space-y-4">
                    <label className="block text-sm font-medium text-white/70">
                      <span className="mb-2 block">Current password</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                        <Lock size={16} className="text-white/50" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(event) =>
                            setCurrentPassword(event.target.value)
                          }
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                          placeholder="Current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword((value) => !value)
                          }
                          className="text-white/60 transition hover:text-white"
                          aria-label={
                            showCurrentPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </label>

                    <label className="block text-sm font-medium text-white/70">
                      <span className="mb-2 block">New password</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                        <ShieldCheck size={16} className="text-white/50" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                          placeholder="New password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((value) => !value)}
                          className="text-white/60 transition hover:text-white"
                          aria-label={
                            showNewPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showNewPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </label>

                    <label className="block text-sm font-medium text-white/70">
                      <span className="mb-2 block">Confirm new password</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                        <ShieldCheck size={16} className="text-white/50" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((value) => !value)
                          }
                          className="text-white/60 transition hover:text-white"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="mt-5 w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? "Updating..." : "Change password"}
                  </button>
                </form>
              </div>

              <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-500/10 p-5">
                <h2 className="text-lg font-semibold text-red-200">
                  Delete account
                </h2>
                <p className="mt-2 text-sm text-red-100/80">
                  This will permanently remove your account and all related
                  session data.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="mt-4 rounded-full border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDeleting ? "Deleting..." : "Delete account"}
                </button>
              </div>
            </motion.section>
          </div>
        </main>

        <Footer />
      </div>
    </SegmentProvider>
  );
}
