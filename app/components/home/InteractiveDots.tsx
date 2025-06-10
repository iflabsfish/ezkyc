"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface Dot {
  id: number;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  opacity: number;
}

export function InteractiveDots() {
  const [dots, setDots] = useState<Dot[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const idleTimerRef = useRef<number>();
  const scrollTimerRef = useRef<number>();

  useEffect(() => {
    const initializeDots = () => {
      const dotsArray: Dot[] = [];
      const spacing = 80;
      const cols = Math.ceil(window.innerWidth / spacing) + 1;
      const rows =
        Math.ceil(
          Math.max(window.innerHeight, document.documentElement.scrollHeight) /
            spacing
        ) + 1;

      let id = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;
          dotsArray.push({
            id: id++,
            x,
            y,
            originalX: x,
            originalY: y,
            opacity: Math.random() * 0.06 + 0.04,
          });
        }
      }

      setDots(dotsArray);
    };

    initializeDots();

    const handleResize = () => {
      initializeDots();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const newPosition = {
      x: event.clientX,
      y: event.clientY,
    };

    setMousePosition(newPosition);
    setIsMouseInside(true);
    setIsMouseIdle(false);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      setIsMouseIdle(true);
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseInside(false);
    setIsMouseIdle(false);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 200);
  }, []);

  useEffect(() => {
    const animate = () => {
      setDots((prevDots) =>
        prevDots.map((dot) => {
          if (isScrolling) {
            const easeFactor = 0.15;
            const distance = Math.sqrt(
              Math.pow(dot.x - dot.originalX, 2) +
                Math.pow(dot.y - dot.originalY, 2)
            );

            if (distance < 1) {
              return {
                ...dot,
                x: dot.originalX,
                y: dot.originalY,
                opacity: Math.max(0.02, dot.opacity - 0.08),
              };
            }

            return {
              ...dot,
              x: dot.x + (dot.originalX - dot.x) * easeFactor,
              y: dot.y + (dot.originalY - dot.y) * easeFactor,
              opacity: Math.max(0.02, dot.opacity - 0.08),
            };
          }

          if (!isMouseInside) {
            const easeFactor = 0.2;
            const distance = Math.sqrt(
              Math.pow(dot.x - dot.originalX, 2) +
                Math.pow(dot.y - dot.originalY, 2)
            );

            if (distance < 1) {
              return {
                ...dot,
                x: dot.originalX,
                y: dot.originalY,
                opacity: Math.max(0.04, dot.opacity - 0.05),
              };
            }

            return {
              ...dot,
              x: dot.x + (dot.originalX - dot.x) * easeFactor,
              y: dot.y + (dot.originalY - dot.y) * easeFactor,
              opacity: Math.max(0.04, dot.opacity - 0.05),
            };
          }

          const distance = Math.sqrt(
            Math.pow(dot.originalX - mousePosition.x, 2) +
              Math.pow(dot.originalY - mousePosition.y, 2)
          );

          const maxDistance = 120;
          const force = Math.max(0, (maxDistance - distance) / maxDistance);

          if (force > 0) {
            if (isMouseIdle) {
              const angle = Math.atan2(
                mousePosition.y - dot.originalY,
                mousePosition.x - dot.originalX
              );

              const targetDistance = 30 + Math.random() * 30;
              const targetX =
                mousePosition.x - Math.cos(angle) * targetDistance;
              const targetY =
                mousePosition.y - Math.sin(angle) * targetDistance;

              const attractForce = 0.02;
              return {
                ...dot,
                x: dot.x + (targetX - dot.x) * attractForce,
                y: dot.y + (targetY - dot.y) * attractForce,
                opacity: Math.min(0.9, dot.opacity + force * 2.5),
              };
            } else {
              const angle = Math.atan2(
                dot.originalY - mousePosition.y,
                dot.originalX - mousePosition.x
              );
              const pushDistance = force * 60;

              return {
                ...dot,
                x: dot.originalX + Math.cos(angle) * pushDistance,
                y: dot.originalY + Math.sin(angle) * pushDistance,
                opacity: Math.min(0.8, dot.opacity + force * 2.0),
              };
            }
          } else {
            const easeFactor = 0.18;
            const distance = Math.sqrt(
              Math.pow(dot.x - dot.originalX, 2) +
                Math.pow(dot.y - dot.originalY, 2)
            );

            if (distance < 2) {
              return {
                ...dot,
                x: dot.originalX,
                y: dot.originalY,
                opacity: Math.max(0.06, dot.opacity - 0.04),
              };
            }

            return {
              ...dot,
              x: dot.x + (dot.originalX - dot.x) * easeFactor,
              y: dot.y + (dot.originalY - dot.y) * easeFactor,
              opacity: Math.max(0.06, dot.opacity - 0.04),
            };
          }
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, isMouseInside, isMouseIdle, isScrolling]);

  // Event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave, handleScroll]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* Interactive Dots Background */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute w-2 h-2 bg-blue-500 rounded-full dot-matrix"
          style={{
            left: dot.x,
            top: dot.y,
            opacity: dot.opacity,
            transform: "translate(-50%, -50%)",
            willChange: "transform, opacity",
            boxShadow: `0 0 ${dot.opacity * 6}px rgba(59, 130, 246, ${
              dot.opacity * 0.4
            })`,
            background: `radial-gradient(circle, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0.7) 100%)`,
          }}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none"></div>

      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/30 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/30 to-transparent pointer-events-none"></div>
    </div>
  );
}
