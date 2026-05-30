"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFAB() {
  return (
    <motion.a
      href="https://wa.me/919286702253?text=Hi! I'd like to subscribe to Aaryas Spicy Kitchen tiffin service."
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl whatsapp-btn"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />

      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#25D366" }} />
      <span className="absolute -inset-2 rounded-full animate-ping opacity-10 animation-delay-500" style={{ background: "#25D366" }} />
    </motion.a>
  );
}
