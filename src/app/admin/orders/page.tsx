"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Mail,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import {
  API_PATHS,
  ORDER_REFRESH_INTERVAL_MS,
  apiUrl,
  authHeaders,
} from "@/lib/api";
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

interface OrderUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface OrderItem {
  id: number;
  name: string;
  category: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface Order {
  id: number;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  customer_note: string;
  created_at: string;
  updated_at: string;
  user: OrderUser;
  items: OrderItem[];
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
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

function AdminOrdersContent() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null);

  const getAuthHeaders = useCallback(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("aaryaAuthToken")
        : "";

    return authHeaders(token);
  }, []);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError("");

    try {
      const response = await fetch(apiUrl(API_PATHS.adminOrders(statusFilter)), {
        headers: getAuthHeaders(),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.localStorage.removeItem("aaryaAuthUser");
          window.localStorage.removeItem("aaryaAuthToken");
          window.dispatchEvent(new Event("aaryaAuthChanged"));
          router.replace("/admin/login");
          return;
        }

        throw new Error(
          data?.error || data?.message || "Unable to load admin orders.",
        );
      }

      setOrders(data.orders || []);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load admin orders.",
      );
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [getAuthHeaders, router, statusFilter]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = window.localStorage.getItem("aaryaAuthUser");
    const storedToken = window.localStorage.getItem("aaryaAuthToken");

    if (!storedUser || !storedToken) {
      setLoading(false);
      setError("Please sign in with an admin account to view orders.");
      router.replace("/admin/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as AdminUser;
      if (!parsedUser.isStaff && !parsedUser.isSuperuser) {
        window.localStorage.removeItem("aaryaAuthUser");
        window.localStorage.removeItem("aaryaAuthToken");
        window.dispatchEvent(new Event("aaryaAuthChanged"));
        setLoading(false);
        setError("This account does not have admin access.");
        router.replace("/admin/login");
        return;
      }

      setAdminUser(parsedUser);
    } catch {
      window.localStorage.removeItem("aaryaAuthUser");
      window.localStorage.removeItem("aaryaAuthToken");
      window.dispatchEvent(new Event("aaryaAuthChanged"));
      setLoading(false);
      setError("Please sign in with an admin account to view orders.");
      router.replace("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    if (!adminUser) return;
    fetchOrders();

    const interval = window.setInterval(
      () => fetchOrders(true),
      ORDER_REFRESH_INTERVAL_MS,
    );

    return () => window.clearInterval(interval);
  }, [adminUser, fetchOrders]);

  const dashboardStats = useMemo(() => {
    const activeOrders = orders.filter(
      (order) => !["completed", "cancelled"].includes(order.status),
    ).length;
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((order) => order.status === "pending").length;

    return { activeOrders, revenue, pendingOrders };
  }, [orders]);

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    setSavingOrderId(orderId);
    setError("");

    try {
      const response = await fetch(apiUrl(API_PATHS.adminOrder(orderId)), {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Unable to update order status.",
        );
      }

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data.order : order)),
      );
      window.dispatchEvent(new Event("aaryaOrdersUpdated"));
      fetchOrders(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update order status.",
      );
    } finally {
      setSavingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-8 shadow-2xl md:p-10"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-sm font-medium text-[var(--primary)]">
                  <ShieldCheck size={14} />
                  Admin kitchen dashboard
                </div>
                <h1
                  className="mt-4 font-display text-4xl font-bold text-white md:text-5xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Ghar Se <span className="gradient-text">orders</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
                  Track what was ordered, who ordered it, and keep every order status current for the kitchen team.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchOrders()}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-60"
                >
                  <RefreshCcw size={16} />
                  Refresh
                </button>
              </div>
            </div>
          </motion.section>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Active orders",
                value: dashboardStats.activeOrders,
                icon: <ShoppingBag size={20} />,
              },
              {
                label: "Pending",
                value: dashboardStats.pendingOrders,
                icon: <Clock3 size={20} />,
              },
              {
                label: "Order value",
                value: formatPrice(dashboardStats.revenue),
                icon: <CheckCircle2 size={20} />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.22em] text-white/40">
                    {stat.label}
                  </p>
                  <div className="rounded-full bg-[rgba(249,115,22,0.12)] p-3 text-[var(--primary)]">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 text-3xl font-semibold text-white">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              ...statusOptions,
            ].map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => setStatusFilter(status.value as "all" | OrderStatus)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === status.value
                    ? "text-white"
                    : "bg-white/5 text-white/55 hover:text-white"
                }`}
                style={
                  statusFilter === status.value
                    ? {
                        background:
                          "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      }
                    : {}
                }
              >
                {status.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-4 text-sm text-red-200">
              <div>{error}</div>
            </div>
          )}

          <section className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 text-center text-white/60">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 text-center text-white/60">
                No orders found for this view.
              </div>
            ) : (
              orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 md:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-white">
                          Order #{order.id}
                        </h2>
                        <span className="rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                          {statusOptions.find((status) => status.value === order.status)?.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/45">
                        Received {formatDate(order.created_at)}
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <UserRound size={15} />
                            {[order.user.first_name, order.user.last_name]
                              .filter(Boolean)
                              .join(" ") || order.user.username}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-white/55">
                            <Mail size={13} />
                            {order.user.email || `@${order.user.username}`}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                            Total
                          </p>
                          <div className="mt-2 text-2xl font-semibold text-white">
                            {formatPrice(order.total)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <label className="block min-w-[220px] text-sm font-medium text-white/70">
                      <span className="mb-2 block">Status</span>
                      <select
                        value={order.status}
                        disabled={savingOrderId === order.id}
                        onChange={(event) =>
                          updateOrderStatus(order.id, event.target.value as OrderStatus)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#17100a] px-4 py-3 text-sm text-white outline-none"
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid gap-2 border-b border-white/10 bg-black/10 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1fr_auto_auto]"
                      >
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="mt-1 text-xs text-white/45">{item.category}</p>
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
                    <div className="mt-4 rounded-2xl border border-[var(--primary)]/15 bg-[rgba(249,115,22,0.08)] px-4 py-3 text-sm text-white/75">
                      <span className="font-semibold text-white">Note:</span>{" "}
                      {order.customer_note}
                    </div>
                  )}
                </article>
              ))
            )}
          </section>
        </div>
      </main>

    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <SegmentProvider>
      <AdminOrdersContent />
    </SegmentProvider>
  );
}
