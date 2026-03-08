"use client";

import Link from "next/link";
import React from "react";

export interface NavigationLinkProps extends React.ComponentProps<typeof Link> {
  showProgress?: boolean;
}

export function NavigationLink({ children, showProgress, ...props }: NavigationLinkProps) {
  return <Link {...props}>{children}</Link>;
}

export interface EnhancedNavigationLinkProps extends NavigationLinkProps {
  progressDelay?: number;
  progressType?: "immediate" | "delayed" | "on-hover";
  onNavigationStart?: () => void;
  onNavigationComplete?: () => void;
}

export function EnhancedNavigationLink({
  children,
  onNavigationStart,
  onNavigationComplete,
  ...props
}: EnhancedNavigationLinkProps) {
  return (
    <Link
      onClick={() => {
        onNavigationStart?.();
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
