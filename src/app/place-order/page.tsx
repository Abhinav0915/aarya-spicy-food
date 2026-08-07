"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  UserRound,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";
import { API_PATHS, apiUrl, authHeaders } from "@/lib/api";
import {
  days,
  getIncludesForPlan,
  getMenuForPlan,
  mealLabels,
  planLabels,
  planPrices,
  type DayKey,
  type MealDishes,
  type MealType,
  type PlanType,
} from "@/lib/daily-menu";
import { SegmentProvider, useSegment } from "@/lib/segment-context";

type Category = "All" | "Lunch" | "Dinner" | "Add-ons";
type PlanFilter = "all" | PlanType;

const dayForDateIndex: DayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "All">;
  tag?: string;
  day?: DayKey;
  meal?: MealType;
  plan?: PlanType;
  dishes?: MealDishes;
  includes?: string[];
}

interface BasketItem extends MenuItem {
  quantity: number;
}

const addOnItems: MenuItem[] = [
  {
    id: 901,
    name: "Extra Roti Pack",
    description: "Soft tawa rotis, perfect for extra servings.",
    price: 18,
    category: "Add-ons",
  },
  {
    id: 902,
    name: "Extra Sabzi",
    description: "Add an extra helping of your favorite sabzi.",
    price: 39,
    category: "Add-ons",
  },
  {
    id: 903,
    name: "Sweet Dish",
    description: "A small dessert to finish your meal on a sweet note.",
    price: 25,
    category: "Add-ons",
  },
];

const dailyMenuItems: MenuItem[] = days.flatMap((day, dayIndex) =>
  (["economic", "premium"] as PlanType[]).flatMap((plan, planIndex) => {
    const menu = getMenuForPlan(plan);
    const includes = getIncludesForPlan(plan);

    return (["lunch", "dinner"] as MealType[]).map((meal, mealIndex) => {
      const dishes = menu[day][meal];
      const planLabel = planLabels[plan];
      const mealLabel = mealLabels[meal];

      return {
        id: dayIndex * 10 + planIndex * 2 + mealIndex + 1,
        name: `${planLabel} ${mealLabel}`,
        description: `${dishes.dal} with ${dishes.sabzi}. Includes ${includes.join(", ")}.`,
        price: planPrices[plan],
        category: mealLabel as "Lunch" | "Dinner",
        tag: plan === "premium" ? "Premium" : "Economic",
        day,
        meal,
        plan,
        dishes,
        includes,
      };
    });
  }),
);

const menuItems: MenuItem[] = [...dailyMenuItems, ...addOnItems];

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  token: string;
  isStaff?: boolean;
  isSuperuser?: boolean;
}

function PlaceOrderPageContent() {
  const router = useRouter();
  const { activeSegment } = useSegment();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [orderDay, setOrderDay] = useState<DayKey>("Mon");
  const [activePlanFilter, setActivePlanFilter] = useState<PlanFilter>("all");
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const [customerNote, setCustomerNote] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderStatus, setOrderStatus] = useState<"success" | "error">(
    "success",
  );
  const [addToOrderId, setAddToOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (activeSegment !== "gharSe") {
      router.replace("/");
    }
  }, [activeSegment, router]);

  useEffect(() => {
    setOrderDay(dayForDateIndex[new Date().getDay()]);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const orderId = Number(
      new URLSearchParams(window.location.search).get("addToOrder"),
    );
    if (Number.isInteger(orderId) && orderId > 0) {
      setAddToOrderId(orderId);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedUser = window.localStorage.getItem("aaryaAuthUser");
      const storedToken = window.localStorage.getItem("aaryaAuthToken");

      if (storedUser && storedToken) {
        setAuthUser(JSON.parse(storedUser) as AuthUser);
      }
    } catch {
      window.localStorage.removeItem("aaryaAuthUser");
      window.localStorage.removeItem("aaryaAuthToken");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const persistAuthSession = (user: AuthUser) => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem("aaryaAuthUser", JSON.stringify(user));
    window.localStorage.setItem("aaryaAuthToken", user.token);
    window.dispatchEvent(new Event("aaryaAuthChanged"));
    setAuthUser(user);
  };

  const clearAuthSession = () => {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem("aaryaAuthUser");
    window.localStorage.removeItem("aaryaAuthToken");
    window.dispatchEvent(new Event("aaryaAuthChanged"));
    setAuthUser(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoginIdentifier("");
    setFirstName("");
    setLastName("");
    setUsername("");
    setShowSigninPassword(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
  };

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("aaryaAuthToken")
        : "";

    return authHeaders(token);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const response = await fetch(apiUrl(API_PATHS.login), {
        method: "POST",
        headers: getAuthHeaders(),
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

      const user: AuthUser = {
        firstName: userData.first_name || userData.firstName || "",
        lastName: userData.last_name || userData.lastName || "",
        email: userData.email || email.trim(),
        username: userData.username || loginIdentifier.trim(),
        token,
        isStaff: Boolean(userData.is_staff || userData.isStaff),
        isSuperuser: Boolean(userData.is_superuser || userData.isSuperuser),
      };

      if (!user.token) {
        throw new Error("The server did not return a JWT token.");
      }

      persistAuthSession(user);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const validateUsername = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setUsernameAvailable(null);
      return;
    }

    if (trimmed.length < 3) {
      setUsernameAvailable(false);
      setAuthError("Username must be at least 3 characters long.");
      return;
    }

    setUsernameAvailable(true);
    setAuthError("");
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");

    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      setAuthError("Username is required.");
      return;
    }

    if (normalizedUsername.length < 3) {
      setAuthError("Username must be at least 3 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch(apiUrl(API_PATHS.signup), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username: normalizedUsername,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
          password_confirm: confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.detail ||
            data?.message ||
            data?.errors?.[0] ||
            "Unable to create your account.",
        );
      }

      const token = data.access || data.token || data.access_token || "";
      const userData = data.user || data.profile || {};

      const user: AuthUser = {
        firstName: userData.first_name || firstName.trim(),
        lastName: userData.last_name || lastName.trim(),
        email: userData.email || email.trim(),
        username: userData.username || username.trim() || email.split("@")[0],
        token,
        isStaff: Boolean(userData.is_staff || userData.isStaff),
        isSuperuser: Boolean(userData.is_superuser || userData.isSuperuser),
      };

      if (!user.token) {
        throw new Error("The server did not return a JWT token.");
      }

      persistAuthSession(user);
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory !== "All" && item.category !== activeCategory) {
        return false;
      }

      if (item.day && item.day !== orderDay) {
        return false;
      }

      if (
        activePlanFilter !== "all" &&
        item.plan &&
        item.plan !== activePlanFilter
      ) {
        return false;
      }

      return true;
    });
  }, [activeCategory, activePlanFilter, orderDay]);

  const subtotal = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = basket.reduce((sum, item) => sum + item.quantity, 0);

  const addToBasket = (item: MenuItem) => {
    setBasket((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setBasket((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const submitOrder = async () => {
    if (!basket.length) {
      setOrderStatus("error");
      setOrderMessage("Please add at least one item before placing an order.");
      return;
    }

    setOrderLoading(true);
    setOrderMessage("");

    try {
      const response = await fetch(
        apiUrl(
          addToOrderId
            ? API_PATHS.customerOrder(addToOrderId)
            : API_PATHS.customerOrders,
        ),
        {
          method: addToOrderId ? "PATCH" : "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...(addToOrderId ? { action: "add_items" } : {}),
            customer_note: customerNote.trim(),
            items: basket.map((item) => ({
              menu_item_id: item.id,
              name: item.name,
              category: item.category,
              unit_price: item.price,
              quantity: item.quantity,
            })),
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Unable to place your order.",
        );
      }

      setBasket([]);
      setCustomerNote("");
      setOrderStatus("success");
      window.dispatchEvent(new Event("aaryaOrdersUpdated"));
      setOrderMessage(
        addToOrderId
          ? `Items added to order #${data.order?.id || addToOrderId}. You can add more until Preparing starts.`
          : `Order #${data.order?.id || ""} received. Our kitchen team can see it now.`,
      );
    } catch (error) {
      setOrderStatus("error");
      setOrderMessage(
        error instanceof Error ? error.message : "Unable to place your order.",
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const whatsappLink = `https://wa.me/919286702253?text=${encodeURIComponent(
    `Hi! I’d like to place an order for:${basket
      .map(
        (item) =>
          `\n- ${item.quantity}x ${item.name} (${formatPrice(item.price)} each)`,
      )
      .join("")}${
      basket.length ? `\n\nSubtotal: ${formatPrice(subtotal)}` : ""
    }`,
  )}`;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex items-center justify-center px-4">
        <div className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-8 py-10 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(249,115,22,0.15)] text-[var(--primary)]">
            <Lock size={24} />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">
            Checking your access...
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Please wait while we verify your login.
          </p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
        <Navbar />

        <main className="pt-28 px-4 sm:px-6 pb-20">
          <div className="mx-auto flex max-w-5xl items-center justify-center">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 shadow-2xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-sm font-medium text-[var(--primary)]">
                <Lock size={14} />
                Secure access required
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-white">
                {authMode === "signin"
                  ? "Sign in to place your order"
                  : "Create your account"}
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/60">
                {authMode === "signin"
                  ? "Please log in with your username and password before you can view the menu and build your basket."
                  : "Create an account to start ordering from Aaryas Spicy Kitchen."}
              </p>

              <div className="mt-6 flex rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setAuthError("");
                  }}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    authMode === "signin"
                      ? "bg-[var(--primary)] text-white"
                      : "text-white/60"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                  }}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    authMode === "signup"
                      ? "bg-[var(--primary)] text-white"
                      : "text-white/60"
                  }`}
                >
                  Sign up
                </button>
              </div>

              {authMode === "signin" ? (
                <form onSubmit={handleLogin} className="mt-8 space-y-4">
                  <label className="block text-sm font-medium text-white/70">
                    <span className="mb-2 block">Username or email</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                      <UserRound size={16} className="text-white/50" />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(event) =>
                          setLoginIdentifier(event.target.value)
                        }
                        placeholder="Enter your username or email"
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
                        type={showSigninPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSigninPassword((value) => !value)}
                        className="text-white/60 transition hover:text-white"
                        aria-label={
                          showSigninPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showSigninPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </label>

                  {authError && (
                    <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {authError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                    }}
                  >
                    {authLoading ? "Signing in..." : "Sign in"}
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="mt-8 space-y-4">
                  <label className="block text-sm font-medium text-white/70">
                    <span className="mb-2 block">Username</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                      <UserRound size={16} className="text-white/50" />
                      <input
                        type="text"
                        value={username}
                        onChange={(event) => {
                          setUsername(event.target.value);
                          validateUsername(event.target.value);
                        }}
                        placeholder="Choose a username"
                        required
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                      />
                    </div>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-white/70">
                      <span className="mb-2 block">First name</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                        <UserRound size={16} className="text-white/50" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          placeholder="First name"
                          required
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                        />
                      </div>
                    </label>

                    <label className="block text-sm font-medium text-white/70">
                      <span className="mb-2 block">Last name</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                        <UserRound size={16} className="text-white/50" />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          placeholder="Last name"
                          required
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-white/70">
                    <span className="mb-2 block">Email address</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                      <Mail size={16} className="text-white/50" />
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
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
                        type={showSignupPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        required
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((value) => !value)}
                        className="text-white/60 transition hover:text-white"
                        aria-label={
                          showSignupPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showSignupPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </label>

                  <label className="block text-sm font-medium text-white/70">
                    <span className="mb-2 block">Confirm password</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3">
                      <Lock size={16} className="text-white/50" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm your password"
                        required
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
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

                  {authError && (
                    <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {authError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                    }}
                  >
                    {authLoading ? "Creating account..." : "Create account"}
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </motion.section>
          </div>
        </main>

        <Footer />
        <WhatsAppFAB />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Navbar />

      <main className="pt-28 px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-8 md:p-10 shadow-2xl"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/25 bg-[rgba(249,115,22,0.08)] px-3 py-1 text-sm font-medium text-[var(--primary)]">
                  <Sparkles size={14} />
                  Freshly prepared, ready to order
                </div>
                <h1
                  className="mt-4 font-display text-4xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Fresh Menu,{" "}
                  <span className="gradient-text">Every Day</span>
                </h1>
                <p className="mt-4 text-base text-white/60 md:text-lg">
                  {addToOrderId
                    ? `Add more items to order #${addToOrderId}. You can keep adding items until the kitchen moves it to Preparing.`
                    : "Compare lunch and dinner across Economic and Premium plans, then add the exact meal you want to your basket."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={clearAuthSession}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  Log out
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  Back to home
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.section>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.7fr_0.9fr]">
            <section className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All Plans" },
                  { value: "economic", label: "Economic" },
                  { value: "premium", label: "Premium" },
                ].map((plan) => (
                  <button
                    key={plan.value}
                    type="button"
                    onClick={() => setActivePlanFilter(plan.value as PlanFilter)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activePlanFilter === plan.value
                        ? "text-white"
                        : "text-white/50 hover:text-white/80"
                    }`}
                    style={
                      activePlanFilter === plan.value
                        ? {
                            background:
                              "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                          }
                        : { background: "rgba(255,255,255,0.05)" }
                    }
                  >
                    {plan.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {(["All", "Lunch", "Dinner", "Add-ons"] as Category[]).map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeCategory === category
                          ? "text-white"
                          : "text-white/50 hover:text-white/80"
                      }`}
                      style={
                        activeCategory === category
                          ? {
                              background:
                                "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                            }
                          : { background: "rgba(255,255,255,0.05)" }
                      }
                    >
                      {category}
                    </button>
                  ),
                )}
              </div>

              <div className="rounded-2xl border border-[var(--primary)]/15 bg-[rgba(249,115,22,0.08)] px-4 py-3 text-sm text-white/65">
                {addToOrderId
                  ? "Adding to an existing order is available only before the Preparing phase starts."
                  : "Freshly prepared and delivered hot. Menu items are subject to seasonal availability."}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-white">
                            {item.name}
                          </h2>
                          {item.tag && (
                            <span className="rounded-full bg-[rgba(232,168,48,0.15)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>

                    {item.dishes && (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Dal / Main Curry
                          </div>
                          <div className="mt-2 text-sm font-semibold text-white">
                            {item.dishes.dal}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Sabzi
                          </div>
                          <div className="mt-2 text-sm font-semibold text-white">
                            {item.dishes.sabzi}
                          </div>
                        </div>
                      </div>
                    )}

                    {item.includes && (
                      <div className="mt-5">
                        <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Always included
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.includes.map((include) => (
                            <span
                              key={include}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65"
                            >
                              {include}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => addToBasket(item)}
                      className="mt-5 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02]"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      }}
                    >
                      <Plus size={16} />
                      Add to basket
                    </button>
                  </motion.article>
                ))}
              </div>
            </section>

            <aside className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 md:p-6 h-fit sticky top-24">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                    Basket
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">
                    Your order
                  </h2>
                </div>
                <div className="rounded-full bg-[rgba(249,115,22,0.12)] p-3 text-[var(--primary)]">
                  <ShoppingBag size={20} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.15)] p-4">
                {basket.length === 0 ? (
                  <div className="text-center py-6 text-sm text-white/55">
                    Your basket is empty. Add a few dishes to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {basket.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {item.name}
                          </div>
                          <div className="text-xs text-white/45">
                            {formatPrice(item.price)} each
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="rounded-full border border-white/10 p-1.5 text-white/70 transition hover:bg-white/10"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="rounded-full border border-white/10 p-1.5 text-white/70 transition hover:bg-white/10"
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3 rounded-2xl bg-white/5 p-4 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{itemCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
              </div>

              <label className="mt-5 block text-sm font-medium text-white/70">
                <span className="mb-2 block">Kitchen note</span>
                <textarea
                  value={customerNote}
                  onChange={(event) => setCustomerNote(event.target.value)}
                  placeholder="Less spicy, delivery timing, or any request..."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>

              {orderMessage && (
                <p
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                    orderStatus === "success"
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                      : "border-red-400/30 bg-red-500/10 text-red-200"
                  }`}
                >
                  {orderMessage}
                </p>
              )}

              <button
                type="button"
                onClick={submitOrder}
                disabled={orderLoading || basket.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                }}
              >
                {orderLoading
                  ? "Sending to kitchen..."
                  : addToOrderId
                    ? "Add items to order"
                    : "Place order"}
                <ArrowRight size={16} />
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Share on WhatsApp
                <ArrowRight size={16} />
              </a>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

export default function PlaceOrderPage() {
  return (
    <SegmentProvider>
      <PlaceOrderPageContent />
    </SegmentProvider>
  );
}
