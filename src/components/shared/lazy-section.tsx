'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  minHeight?: string | number;
  rootMargin?: string;
}

/**
 * LazySection component for high-performance below-the-fold homepage rendering.
 * Defers DOM evaluation and hydration until the viewport is within 250px of the section,
 * preserving 60fps smooth scrolling, zero CLS (Cumulative Layout Shift), and low TBT.
 */
export function LazySection({
  children,
  fallback,
  className = '',
  minHeight = '320px',
  rootMargin = '250px',
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isVisible) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={
        !isVisible
          ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }
          : undefined
      }
    >
      {isVisible ? (
        <div className="transition-opacity duration-500 ease-out">{children}</div>
      ) : (
        fallback || (
          <div
            className="w-full flex items-center justify-center opacity-30 py-16"
            style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
          >
            <div className="h-7 w-7 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          </div>
        )
      )}
    </div>
  );
}
