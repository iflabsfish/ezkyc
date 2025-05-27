import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export function Tooltip({
  children,
  content,
  showTip,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  showTip: boolean;
}) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
  const [tooltipSize, setTooltipSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        left: rect.left + rect.width / 2,
        top: rect.bottom,
      });
    }
  }, [show]);

  useEffect(() => {
    if (show && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      setTooltipSize({ width: rect.width, height: rect.height });
    }
  }, [show, content]);

  const { left, top } = useMemo(() => {
    if (typeof window === 'undefined') return { left: 0, top: 0 };
    
    let left = coords?.left ?? 0;
    let top = coords?.top ?? 0;
    if (tooltipSize) {
      const padding = 8;
      if (left - tooltipSize.width / 2 < padding) {
        left = tooltipSize.width / 2 + padding;
      } else if (left + tooltipSize.width / 2 > window.innerWidth - padding) {
        left = window.innerWidth - tooltipSize.width / 2 - padding;
      }
      if (top + tooltipSize.height > window.innerHeight - padding) {
        top = top - tooltipSize.height - (ref.current?.offsetHeight || 0) - 8;
      }
      if (top < padding) {
        top = padding;
      }
    }
    return { left, top };
  }, [coords, tooltipSize]);

  if (!mounted) {
    return <span className="relative inline-block">{children}</span>;
  }

  return (
    <span
      className="relative inline-block"
      ref={ref}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {showTip &&
        show &&
        coords &&
        typeof document !== 'undefined' &&
        typeof window !== 'undefined' &&
        createPortal(
          <span
            ref={tooltipRef}
            className="fixed z-50 px-3 py-2 rounded bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg pointer-events-none"
            style={{ left, top, transform: "translateX(-50%)" }}
          >
            {content}
          </span>,
          document.body
        )}
    </span>
  );
}
