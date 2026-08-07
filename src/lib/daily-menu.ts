export type MealType = "lunch" | "dinner";
export type PlanType = "economic" | "premium";
export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface MealDishes {
  dal: string;
  sabzi: string;
}

export interface DayMenu {
  lunch: MealDishes;
  dinner: MealDishes;
}

export const days: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const dayNames: Record<DayKey, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export const mealLabels: Record<MealType, string> = {
  lunch: "Lunch",
  dinner: "Dinner",
};

export const planLabels: Record<PlanType, string> = {
  economic: "Economic",
  premium: "Premium",
};

export const planPrices: Record<PlanType, number> = {
  economic: 129,
  premium: 179,
};

export const economicMenu: Record<DayKey, DayMenu> = {
  Mon: { lunch: { dal: "Dal Panchmel", sabzi: "Gobi Aloo" }, dinner: { dal: "Yellow Moong Dal Tadka", sabzi: "Aloo Jeera Beans" } },
  Tue: { lunch: { dal: "Mix Dal", sabzi: "Jeera Aloo" }, dinner: { dal: "Dhaba-Style Chana Dal", sabzi: "Tori (Ghiya) Masala" } },
  Wed: { lunch: { dal: "Arhar Dal", sabzi: "Bhindi Masala" }, dinner: { dal: "Panchmel Dal", sabzi: "Chatpata Aloo Baingan" } },
  Thu: { lunch: { dal: "Masala Lauki Gravy Wali", sabzi: "Masala Aloo" }, dinner: { dal: "Masoor Dal Bhaba Style", sabzi: "Sukha Patta Gobhi" } },
  Fri: { lunch: { dal: "Malka ki Dal", sabzi: "Capsicum Aloo" }, dinner: { dal: "Arhar Dal Fry", sabzi: "Bhindi Do Pyaza" } },
  Sat: { lunch: { dal: "Chole", sabzi: "Poori (Special)" }, dinner: { dal: "Aloo Tamatar", sabzi: "Jeera Aloo" } },
  Sun: { lunch: { dal: "Kadhi Pakora", sabzi: "Special Pakora" }, dinner: { dal: "Aloo Tamatar", sabzi: "Kaddu & Poori" } },
};

export const premiumMenu: Record<DayKey, DayMenu> = {
  Mon: { lunch: { dal: "Pind-Style Amritsari Chole", sabzi: "Yellow Moong Dal Tadka" }, dinner: { dal: "Masala Lauki Gravy Wali", sabzi: "Masala Aloo" } },
  Tue: { lunch: { dal: "Shahi Paneer Masala", sabzi: "Dal Makhani" }, dinner: { dal: "Malka ki Dal", sabzi: "Capsicum Aloo" } },
  Wed: { lunch: { dal: "Punjabi Rajma Masala", sabzi: "Dhaba-Style Chana Dal" }, dinner: { dal: "Kadhai Mushroom", sabzi: "Moong-Masoor Dal" } },
  Thu: { lunch: { dal: "Malka Ki Dal", sabzi: "Shahi Paneer" }, dinner: { dal: "Panchmel Dal", sabzi: "Chatpata Aloo Baingan" } },
  Fri: { lunch: { dal: "Mattar Paneer Gravy", sabzi: "Panchmel Dal" }, dinner: { dal: "Moong-Masoor Dal", sabzi: "Bhindi Do Pyaza" } },
  Sat: { lunch: { dal: "Mattar Paneer Gravy", sabzi: "Soya Chunks Aloo" }, dinner: { dal: "Rajma Masala", sabzi: "Jeera Aloo" } },
  Sun: { lunch: { dal: "Kadai Paneer", sabzi: "Dal Makhani" }, dinner: { dal: "Arhar Dal Fry", sabzi: "Bhindi Do Pyaza" } },
};

export const economicIncludes = ["4 Tawa Roti", "Steamed Rice", "Fresh Salad", "Pickle"];

export const premiumIncludes = [
  "4 Tawa Roti or 2 Lachha Paratha",
  "Veg Pulao / Peas Pulao",
  "Raita of the day",
  "1 Sweet (Phirni / Suji Halwa / Kheer)",
  "Fresh Salad & Pickle",
];

export function getMenuForPlan(plan: PlanType) {
  return plan === "economic" ? economicMenu : premiumMenu;
}

export function getIncludesForPlan(plan: PlanType) {
  return plan === "economic" ? economicIncludes : premiumIncludes;
}
