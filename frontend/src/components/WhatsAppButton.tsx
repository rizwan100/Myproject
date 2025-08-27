"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  className?: string;
  variant?: "default" | "outline" | "floating";
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
        className={cn("fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110", className)}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    );
  }
  
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    lg: "h-10 px-6 text-base"
  };

  const variantClasses = {
    default: "bg-green-500 hover:bg-green-600 text-white border border-transparent",
    outline: "bg-transparent text-green-500 border border-green-500 hover:bg-green-50 hover:text-green-600",
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={cn("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50", sizeClasses[size], variantClasses[variant], className)}
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp
    </button>
  );
}