"use client";

import React from 'react';
import { Heart } from "lucide-react";

interface DonateButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function DonateButton({ 
  variant = "outline", 
  size = "md",
  className = "" 
}: DonateButtonProps) {
  const handleDonate = () => {
    const upiUrl = `upi://pay?pa=+916281905305&pn=Aasan%20Rishte&cu=INR&mc=0000&tr=${Date.now()}`;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = upiUrl;
    } else {
      const fallbackUrl = `https://pay.google.com/gp/p/ui/pay?pa=+916281905305&pn=Aasan%20Rishte&cu=INR`;
      window.open(fallbackUrl, '_blank');
    }
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm", 
    lg: "h-10 px-6 text-base"
  };

  return (
    <button
      onClick={handleDonate}
      className={`${sizeClasses[size]} bg-green-600 hover:bg-green-700 text-white border border-green-600 hover:border-green-700 flex items-center gap-2 rounded-md font-medium transition-colors ${className}`}
    >
      <Heart className="h-4 w-4" />
      Donate
    </button>
  );
}
