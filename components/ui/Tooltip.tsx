import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(
    null
  );
  const [tooltipSize, setTooltipSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        left: rect.left + rect.width / 2,
        top: rect.bottom,
      });
    }
  }, [show]);

  useLayoutEffect(() => {
    if (show && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      setTooltipSize({ width: rect.width, height: rect.height });
    }
  }, [show, content]);

  const { left, top } = useMemo(() => {
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
      {show &&
        coords &&
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
