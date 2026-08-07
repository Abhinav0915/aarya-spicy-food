"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, CookingPot, X } from "lucide-react";
import {
  API_PATHS,
  ORDER_CANCEL_WINDOW_SECONDS,
  ORDER_REFRESH_INTERVAL_MS,
  apiUrl,
  authHeaders,
} from "@/lib/api";

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

interface StoredUser {
  token?: string;
}

const DISMISSED_ORDER_KEY = "aaryaDismissedLatestOrderId";

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

function getStatusProgress(status: OrderStatus) {
  if (status === "cancelled") return 0;
  const index = statusSteps.findIndex((step) => step.value === status);
  return index >= 0 ? index : 0;
}

function isActiveOrder(status: OrderStatus) {
  return status !== "completed" && status !== "cancelled";
}

function getCancelSecondsRemaining(order: CustomerOrder, now: number) {
  const cancelUntil =
    new Date(order.created_at).getTime() + ORDER_CANCEL_WINDOW_SECONDS * 1000;
  return Math.max(0, Math.ceil((cancelUntil - now) / 1000));
}

function readToken() {
  if (typeof window === "undefined") return "";

  const storedToken = window.localStorage.getItem("aaryaAuthToken");
  if (storedToken) return storedToken;

  const storedUser = window.localStorage.getItem("aaryaAuthUser");
  if (!storedUser) return "";

  try {
    return (JSON.parse(storedUser) as StoredUser).token || "";
  } catch {
    return "";
  }
}

export default function LatestOrderBanner() {
  const pathname = usePathname();
  const [latestOrder, setLatestOrder] = useState<CustomerOrder | null>(null);
  const [token, setToken] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedOrderId, setDismissedOrderId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const isProfilePage = pathname === "/profile";
  const isDismissed =
    latestOrder !== null && dismissedOrderId === latestOrder.id;
  const cancelSecondsRemaining = latestOrder
    ? getCancelSecondsRemaining(latestOrder, now)
    : 0;
  const canCancel =
    latestOrder !== null &&
    latestOrder.status !== "cancelled" &&
    latestOrder.status !== "completed" &&
    (latestOrder.can_cancel ?? true) &&
    cancelSecondsRemaining > 0;
  const canAddItems =
    latestOrder !== null &&
    (latestOrder.can_add_items ??
      ["pending", "confirmed"].includes(latestOrder.status));

  const dismissBanner = () => {
    if (!latestOrder || typeof window === "undefined") return;

    window.localStorage.setItem(DISMISSED_ORDER_KEY, String(latestOrder.id));
    setDismissedOrderId(latestOrder.id);
  };

  const reopenBanner = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DISMISSED_ORDER_KEY);
    }
    setDismissedOrderId(null);
  };

  const refreshToken = useCallback(() => {
    const nextToken = readToken();
    setToken(nextToken);
    if (!nextToken) {
      setLatestOrder(null);
    }
  }, []);

  const fetchLatestOrder = useCallback(async () => {
    if (!token || isProfilePage) return;

    setIsRefreshing(true);
    try {
      const response = await fetch(apiUrl(API_PATHS.customerOrders), {
        headers: authHeaders(token),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const activeOrder =
          data.orders?.find((order: CustomerOrder) =>
            isActiveOrder(order.status),
          ) || null;
        setLatestOrder(activeOrder);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [isProfilePage, token]);

  const cancelLatestOrder = async () => {
    if (!latestOrder || !token) return;

    setIsCancelling(true);
    setActionMessage("");

    try {
      const response = await fetch(apiUrl(API_PATHS.customerOrder(latestOrder.id)), {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Unable to cancel this order.",
        );
      }

      setLatestOrder(data.order);
      setActionMessage("Order cancelled successfully.");
      window.dispatchEvent(new Event("aaryaOrdersUpdated"));
    } catch (error) {
      setActionMessage(
        error instanceof Error ? error.message : "Unable to cancel this order.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    refreshToken();

    const storedDismissedOrderId = window.localStorage.getItem(
      DISMISSED_ORDER_KEY,
    );
    setDismissedOrderId(
      storedDismissedOrderId ? Number(storedDismissedOrderId) : null,
    );

    const handleAuthChange = () => refreshToken();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("aaryaAuthChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("aaryaAuthChanged", handleAuthChange);
    };
  }, [refreshToken]);

  useEffect(() => {
    if (!token || isProfilePage) return;

    fetchLatestOrder();
    const interval = window.setInterval(
      fetchLatestOrder,
      ORDER_REFRESH_INTERVAL_MS,
    );

    const handleOrdersUpdated = () => fetchLatestOrder();
    window.addEventListener("aaryaOrdersUpdated", handleOrdersUpdated);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("aaryaOrdersUpdated", handleOrdersUpdated);
    };
  }, [fetchLatestOrder, isProfilePage, token]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isProfilePage && latestOrder && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-5xl rounded-[24px] border border-white/10 bg-[rgba(15,23,42,0.94)] p-4 pr-12 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-24"
        >
          <button
            type="button"
            onClick={dismissBanner}
            className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/5 p-2 text-white/65 transition hover:bg-white/10 hover:text-white"
            aria-label="Close order status"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  <Clock3 size={14} />
                  Latest order
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  #{latestOrder.id}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  {formatPrice(latestOrder.total)}
                </span>
              </div>
              <h2 className="mt-2 truncate text-lg font-semibold text-white">
                {statusLabels[latestOrder.status]}
                {isRefreshing ? " · refreshing..." : ""}
              </h2>
            </div>

            <div className="grid gap-2 sm:grid-cols-5 lg:min-w-[520px]">
              {statusSteps.map((step, index) => {
                const active =
                  latestOrder.status !== "cancelled" &&
                  index <= getStatusProgress(latestOrder.status);

                return (
                  <div
                    key={step.value}
                    className={`rounded-2xl border px-3 py-2 text-xs transition ${
                      active
                        ? "border-[var(--primary)]/30 bg-[rgba(249,115,22,0.12)] text-white"
                        : "border-white/10 bg-white/5 text-white/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      <span>{step.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Details
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                canCancel
                  ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              <div className="font-semibold">
                {canCancel
                  ? `Cancel window: ${cancelSecondsRemaining}s left`
                  : "Cancel window closed"}
              </div>
              <p className="mt-1 text-xs opacity-75">
                Orders can be cancelled within 60 seconds of placing them.
              </p>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                canAddItems
                  ? "border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] text-white"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              <div className="font-semibold">
                {canAddItems ? "Add items available" : "Adding items is closed"}
              </div>
              <p className="mt-1 text-xs opacity-75">
                You can add more items until the order reaches Preparing.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canCancel && (
                <button
                  type="button"
                  onClick={cancelLatestOrder}
                  disabled={isCancelling}
                  className="inline-flex items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCancelling ? "Cancelling..." : "Cancel"}
                </button>
              )}

              {canAddItems && (
                <Link
                  href={`/place-order?addToOrder=${latestOrder.id}`}
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  }}
                >
                  Add items
                </Link>
              )}
            </div>
          </div>

          {actionMessage && (
            <p className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
              {actionMessage}
            </p>
          )}

          {latestOrder.status === "cancelled" && (
            <p className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              This order was cancelled. Please contact the kitchen if this looks wrong.
            </p>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {!isProfilePage && latestOrder && isDismissed && (
          <motion.button
            type="button"
            onClick={reopenBanner}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="fixed bottom-24 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(15,23,42,0.94)] px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl transition hover:bg-[rgba(15,23,42,0.98)] sm:bottom-6 sm:left-6"
            aria-label="Reopen order status"
          >
            <CookingPot size={16} className="text-[var(--primary)]" />
            Order #{latestOrder.id}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
