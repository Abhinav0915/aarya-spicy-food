"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Segment = "gharSe" | "zomato" | "swiggy" | "catering";

interface SegmentConfig {
  id: Segment;
  label: string;
  tagline: string;
  description: string;
  status: "active" | "coming-soon";
  emoji: string;
  dataAttr: string;
  colors: {
    primary: string;
    accent: string;
  };
}

export const SEGMENTS: SegmentConfig[] = [
  {
    id: "gharSe",
    label: "Ghar Se",
    tagline: "Maa ke haath ka swaad",
    description: "Home-cooked daily tiffin service",
    status: "active",
    emoji: "🍱",
    dataAttr: "gharSe",
    colors: { primary: "#f97316", accent: "#E8A830" },
  },
  {
    id: "zomato",
    label: "Zomato",
    tagline: "Order anytime, anywhere",
    description: "Fast delivery via Zomato",
    status: "coming-soon",
    emoji: "🛵",
    dataAttr: "zomato",
    colors: { primary: "#E23744", accent: "#FF6B6B" },
  },
  {
    id: "swiggy",
    label: "Swiggy",
    tagline: "Lightning fast delivery",
    description: "Quick delivery via Swiggy",
    status: "coming-soon",
    emoji: "⚡",
    dataAttr: "swiggy",
    colors: { primary: "#FC8019", accent: "#FBBE42" },
  },
  {
    id: "catering",
    label: "Catering",
    tagline: "Grand celebrations, royal food",
    description: "Party orders & corporate catering",
    status: "coming-soon",
    emoji: "🎉",
    dataAttr: "catering",
    colors: { primary: "#9B59B6", accent: "#F1C40F" },
  },
];

interface SegmentContextType {
  activeSegment: Segment;
  setActiveSegment: (segment: Segment) => void;
  config: SegmentConfig;
  isTransitioning: boolean;
}

const defaultSegmentContext: SegmentContextType = {
  activeSegment: "gharSe",
  setActiveSegment: () => {},
  config: SEGMENTS[0],
  isTransitioning: false,
};

const SegmentContext = createContext<SegmentContextType>(defaultSegmentContext);

export function SegmentProvider({ children }: { children: React.ReactNode }) {
  const [activeSegment, setActiveSegmentState] = useState<Segment>(() => {
    if (typeof window === "undefined") return "gharSe";

    const storedSegment = window.localStorage.getItem("aaryas-active-segment");
    if (
      storedSegment === "gharSe" ||
      storedSegment === "zomato" ||
      storedSegment === "swiggy" ||
      storedSegment === "catering"
    ) {
      return storedSegment;
    }

    return "gharSe";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setActiveSegment = (segment: Segment) => {
    if (segment === activeSegment) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSegmentState(segment);
      setIsTransitioning(false);
    }, 400);
  };

  const config = SEGMENTS.find((s) => s.id === activeSegment)!;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aaryas-active-segment", activeSegment);
    }
  }, [activeSegment]);

  useEffect(() => {
    const dataAttrMap: Record<Segment, string> = {
      gharSe: "gharSe",
      zomato: "zomato",
      swiggy: "swiggy",
      catering: "catering",
    };
    document.documentElement.setAttribute(
      "data-segment",
      dataAttrMap[activeSegment],
    );
  }, [activeSegment]);

  return (
    <SegmentContext.Provider
      value={{ activeSegment, setActiveSegment, config, isTransitioning }}
    >
      {children}
    </SegmentContext.Provider>
  );
}

export function useSegment() {
  return useContext(SegmentContext);
}
