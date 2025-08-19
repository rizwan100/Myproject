"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "floating";
  size?: "sm" | "lg";
}

export default function WhatsAppButton({ 
  className = "", 
  variant = "default",
  size = "sm" 
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+917569319126", "_blank");
  };

  if (variant === "floating") {
    return (
      <button
        onClick={handleWhatsAppClick}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    );
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    lg: "h-6 w-6"
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant={variant === "default" ? "default" : variant}
      className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
      size={size}
    >
      <MessageCircle className={`${sizeClasses[size]} mr-2`} />
      WhatsApp
    </Button>
  );
}
