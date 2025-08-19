"use client";

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ 
  size = 'md', 
  className = '', 
  showText = true,
  textClassName = ''
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/aasan-rishte-logo-navbar.png"
        alt="Aasan Rishte Logo"
        width={32}
        height={32}
        className={sizeClasses[size]}
      />
      {showText && (
        <span className={`ml-2 text-xl font-bold ${textClassName || 'text-gray-900'}`}>Aasan Rishte</span>
      )}
    </div>
  );
}
