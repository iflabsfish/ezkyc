"use client";
import React from "react";

interface LoadingProps {
  text?: string;
  fullscreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  text = "Loading...",
  fullscreen = true,
  className = "",
}) => {
  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          : "flex items-center justify-center" +
            (className ? ` ${className}` : "")
      }
    >
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center border border-indigo-100">
        <svg
          className="animate-spin h-10 w-10 text-indigo-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-indigo-700 font-semibold text-lg tracking-wide">
          {text}
        </span>
      </div>
    </div>
  );
};
