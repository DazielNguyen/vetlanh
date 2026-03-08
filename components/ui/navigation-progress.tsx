"use client";

import React from "react";

interface NavigationProgressProps {
  isNavigating: boolean;
  progress?: number;
  className?: string;
}

export function NavigationProgress({ isNavigating, progress, className }: NavigationProgressProps) {
  if (!isNavigating) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${progress || 0}%` }}
      />
    </div>
  );
}

export function NavigationProgressAdvanced({
  isNavigating,
  className,
}: {
  isNavigating: boolean;
  className?: string;
}) {
  if (!isNavigating) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
      <div className="h-full bg-primary animate-pulse w-full" />
    </div>
  );
}
