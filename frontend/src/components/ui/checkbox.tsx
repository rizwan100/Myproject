"use client"

import * as React from "react"
import { Check } from "lucide-react"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        ref={ref}
        className="sr-only"
        checked={checked}
        onChange={e => onCheckedChange && onCheckedChange(e.target.checked)}
        {...props}
      />
      <div 
        className={`h-4 w-4 shrink-0 rounded-sm border border-gray-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-blue-600 border-blue-600' : ''} ${className || ''}`}
        onClick={() => onCheckedChange && onCheckedChange(!checked)}
      >
        {checked && (
          <Check className="h-4 w-4 text-white" />
        )}
      </div>
    </div>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
