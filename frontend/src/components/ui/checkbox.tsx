"use client"

import * as React from "react"
import { Check } from "lucide-react"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <input
      type="checkbox"
      ref={ref}
      className="sr-only"
      {...props}
    />
    <div className={`h-4 w-4 shrink-0 rounded-sm border border-gray-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.checked ? 'bg-blue-600 border-blue-600' : ''} ${className}`}>
      {props.checked && (
        <Check className="h-4 w-4 text-white" />
      )}
    </div>
  </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
