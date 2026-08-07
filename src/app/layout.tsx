import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aaryas Spicy Kitchen | Ghar Ka Khana, Delivered Fresh",
  description:
    "Authentic homemade food delivered to students and working professionals in Bareilly. Subscribe to daily tiffin service – economic & premium meal plans.",
  keywords: [
    "tiffin service Bareilly",
    "homemade food delivery",
    "Ghar Se tiffin",
    "cloud kitchen Bareilly",
    "Aaryas Spicy Kitchen",
  ],
  
  openGraph: {
    title: "Aaryas Spicy Kitchen | Ghar Ka Khana, Delivered Fresh",
    description: "Authentic homemade food delivered daily in Bareilly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
