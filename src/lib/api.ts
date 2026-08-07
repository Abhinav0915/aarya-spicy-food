const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://aarya-spicy-food-backend.onrender.com"
    : "http://127.0.0.1:8000";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_DJANGO_API_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export const ORDER_REFRESH_INTERVAL_MS = 5000;
export const ORDER_CANCEL_WINDOW_SECONDS = 60;

export const API_PATHS = {
  signup: "/signup/",
  login: "/login/",
  adminLogin: "/api/admin/login/",
  profile: "/profile/",
  changePassword: "/change-password/",
  deleteUser: "/delete-user/",
  customerOrders: "/orders/",
  customerOrder: (orderId: number) => `/orders/${orderId}/`,
  adminOrders: (status?: string) =>
    status && status !== "all"
      ? `/api/admin/orders/?status=${encodeURIComponent(status)}`
      : "/api/admin/orders/",
  adminOrder: (orderId: number) => `/api/admin/orders/${orderId}/`,
};

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export function authHeaders(token?: string | null) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
