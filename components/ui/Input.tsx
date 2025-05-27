import React, { useState } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  helperText?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  helperText,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-base font-medium text-gray-700 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-md">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon
              className={`h-5 w-5 ${
                isFocused ? "text-indigo-500" : "text-gray-400"
              } transition-colors duration-200`}
            />
          </div>
        )}
        <input
          className={`
            block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 text-base
            py-3 px-4
            transition-all duration-200 ease-in-out
            ${LeftIcon ? "pl-10" : ""}
            ${RightIcon ? "pr-10" : ""}
            ${
              error
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : isFocused
                ? "border-indigo-400"
                : ""
            }
            hover:border-gray-400
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <RightIcon
              className={`h-5 w-5 ${
                isFocused ? "text-indigo-500" : "text-gray-400"
              } transition-colors duration-200`}
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
      {hint && !error && <p className="mt-2 text-sm text-gray-500">{hint}</p>}
      {helperText && !error && !hint && (
        <p className="mt-2 text-xs text-gray-400 italic">{helperText}</p>
      )}
    </div>
  );
}
