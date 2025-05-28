"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "warning" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export interface UseToastReturn {
  showToast: (message: string, type?: "success" | "warning" | "error") => void;
  toastProps: {
    message: string;
    type: "success" | "warning" | "error";
    isVisible: boolean;
    onClose: () => void;
  };
}

export function useToast(): UseToastReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "warning" | "error">("warning");

  const showToast = useCallback(
    (msg: string, toastType: "success" | "warning" | "error" = "warning") => {
      setMessage(msg);
      setType(toastType);
      setIsVisible(true);
    },
    []
  );

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    showToast,
    toastProps: {
      message,
      type,
      isVisible,
      onClose: hideToast,
    },
  };
}

export function Toast({
  message,
  type = "warning",
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          bgColor: "bg-green-100",
        };
      case "error":
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          bgColor: "bg-red-100",
        };
      default:
        return {
          icon: (
            <svg
              className="w-4 h-4 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          ),
          bgColor: "bg-orange-100",
        };
    }
  };

  const { icon, bgColor } = getIconAndColor();

  return (
    <div className="fixed top-28 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px]">
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}
          >
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
