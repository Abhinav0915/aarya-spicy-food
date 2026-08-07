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
  ShoppingBag,
  Clock3,
  RefreshCcw,
  CheckCircle2,
  PlusCircle,
  XCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  API_PATHS,
  ORDER_CANCEL_WINDOW_SECONDS,
  ORDER_REFRESH_INTERVAL_MS,
  apiUrl,
  authHeaders,
} from "@/lib/api";
import { SegmentProvider } from "@/lib/segment-context";

interface ProfileUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  token: string;
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

interface OrderItem {
  id: number;
  name: string;
  category: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface CustomerOrder {
  id: number;
  status: OrderStatus;
  total: number;
  customer_note: string;
  created_at: string;
  updated_at: string;
  can_cancel?: boolean;
  cancel_seconds_remaining?: number;
  can_add_items?: boolean;
  items: OrderItem[];
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "Received",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusSteps: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Received" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "On the way" },
  { value: "completed", label: "Completed" },
];

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusProgress(status: OrderStatus) {
  if (status === "cancelled") return 0;
  const index = statusSteps.findIndex((step) => step.value === status);
  return index >= 0 ? index : 0;
}

function getCancelSecondsRemaining(order: CustomerOrder, now: number) {
  const cancelUntil =
    new Date(order.created_at).getTime() + ORDER_CANCEL_WINDOW_SECONDS * 1000;
  return Math.max(0, Math.ceil((cancelUntil - now) / 1000));
}

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
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [actionOrderId, setActionOrderId] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

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
    window.dispatchEvent(new Event("aaryaAuthChanged"));
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

    return authHeaders(token);
  };

  const fetchOrderHistory = async (silent = false) => {
    if (!silent) {
      setOrdersLoading(true);
    }
    setOrdersError("");

    try {
      const response = await fetch(apiUrl(API_PATHS.customerOrders), {
        headers: getAuthHeaders(),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Unable to load your orders.",
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      setOrdersError(
        error instanceof Error ? error.message : "Unable to load your orders.",
      );
    } finally {
      if (!silent) {
        setOrdersLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchOrderHistory();
    const interval = window.setInterval(
      () => fetchOrderHistory(true),
      ORDER_REFRESH_INTERVAL_MS,
    );
    return () => window.clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    setActionOrderId(orderId);
    setOrdersError("");

    try {
      const response = await fetch(apiUrl(API_PATHS.customerOrder(orderId)), {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Unable to cancel this order.",
        );
      }

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data.order : order)),
      );
      window.dispatchEvent(new Event("aaryaOrdersUpdated"));
    } catch (error) {
      setOrdersError(
        error instanceof Error ? error.message : "Unable to cancel this order.",
      );
    } finally {
      setActionOrderId(null);
    }
  };

  const handleProfileUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(apiUrl(API_PATHS.profile), {
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
      const response = await fetch(apiUrl(API_PATHS.changePassword), {
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
      const response = await fetch(apiUrl(API_PATHS.deleteUser), {
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
      window.dispatchEvent(new Event("aaryaAuthChanged"));
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
          <div className="mx-auto flex max-w-6xl items-center justify-center">
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

              <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-sm font-medium text-[var(--primary)]">
                      <ShoppingBag size={14} />
                      Order history
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      Your Ghar Se orders
                    </h2>
                    <p className="mt-2 text-sm text-white/55">
                      Track current orders and revisit what you ordered before.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchOrderHistory()}
                    disabled={ordersLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-60"
                  >
                    <RefreshCcw size={16} />
                    {ordersLoading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

                {ordersError && (
                  <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {ordersError}
                  </p>
                )}

                <div className="mt-5 space-y-4">
                  {ordersLoading && orders.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-6 text-center text-sm text-white/55">
                      Loading your orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-6 text-center">
                      <Clock3 className="mx-auto text-white/35" size={24} />
                      <p className="mt-3 text-sm text-white/55">
                        No orders yet. Your first order will appear here.
                      </p>
                      <Link
                        href="/place-order"
                        className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                        }}
                      >
                        Place an order
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => {
                      const cancelSecondsRemaining = getCancelSecondsRemaining(
                        order,
                        now,
                      );
                      const canCancel =
                        order.status !== "cancelled" &&
                        order.status !== "completed" &&
                        (order.can_cancel ?? true) &&
                        cancelSecondsRemaining > 0;
                      const canAddItems =
                        order.can_add_items ??
                        ["pending", "confirmed"].includes(order.status);

                      return (
                      <article
                        key={order.id}
                        className="rounded-[28px] border border-white/10 bg-[rgba(0,0,0,0.14)] p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-semibold text-white">
                                Order #{order.id}
                              </h3>
                              <span className="rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                                {statusLabels[order.status]}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-white/45">
                              Placed {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-left lg:text-right">
                            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
                              Total
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-white">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 lg:grid-cols-2">
                          <div
                            className={`rounded-2xl border px-4 py-3 text-sm ${
                              canCancel
                                ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
                                : "border-white/10 bg-white/5 text-white/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 font-semibold">
                              <Clock3 size={15} />
                              {canCancel
                                ? `Cancel window: ${cancelSecondsRemaining}s left`
                                : "Cancel window closed"}
                            </div>
                            <p className="mt-1 text-xs opacity-75">
                              Orders can be cancelled only within 60 seconds of placing them.
                            </p>
                          </div>

                          <div
                            className={`rounded-2xl border px-4 py-3 text-sm ${
                              canAddItems
                                ? "border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] text-white"
                                : "border-white/10 bg-white/5 text-white/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 font-semibold">
                              <PlusCircle size={15} />
                              {canAddItems
                                ? "You can add items now"
                                : "Adding items is closed"}
                            </div>
                            <p className="mt-1 text-xs opacity-75">
                              You can add more items until the kitchen moves this order to Preparing.
                            </p>
                          </div>
                        </div>

                        {(canCancel || canAddItems) && (
                          <div className="mt-4 flex flex-wrap gap-3">
                            {canCancel && (
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={actionOrderId === order.id}
                                className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <XCircle size={16} />
                                {actionOrderId === order.id
                                  ? "Cancelling..."
                                  : "Cancel order"}
                              </button>
                            )}

                            {canAddItems && (
                              <Link
                                href={`/place-order?addToOrder=${order.id}`}
                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
                                style={{
                                  background:
                                    "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                                }}
                              >
                                <PlusCircle size={16} />
                                Add items
                              </Link>
                            )}
                          </div>
                        )}

                        <div className="mt-5 grid gap-2 md:grid-cols-5">
                          {statusSteps.map((step, index) => {
                            const active =
                              order.status !== "cancelled" &&
                              index <= getStatusProgress(order.status);

                            return (
                              <div
                                key={step.value}
                                className={`rounded-2xl border px-3 py-3 text-sm transition ${
                                  active
                                    ? "border-[var(--primary)]/30 bg-[rgba(249,115,22,0.12)] text-white"
                                    : "border-white/10 bg-white/5 text-white/40"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 size={15} />
                                  <span>{step.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {order.status === "cancelled" && (
                          <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            This order was cancelled.
                          </p>
                        )}

                        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="grid gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1fr_auto_auto]"
                            >
                              <div>
                                <p className="font-semibold text-white">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-xs text-white/45">
                                  {item.category}
                                </p>
                              </div>
                              <div className="text-white/65">
                                {item.quantity} x {formatPrice(item.unit_price)}
                              </div>
                              <div className="font-semibold text-white">
                                {formatPrice(item.line_total)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.customer_note && (
                          <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
                            <span className="font-semibold text-white">
                              Note:
                            </span>{" "}
                            {order.customer_note}
                          </p>
                        )}
                      </article>
                      );
                    })
                  )}
                </div>
              </section>

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
