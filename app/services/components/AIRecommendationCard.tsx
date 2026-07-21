"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeCompanion } from "@/components/illustrations/SafeCompanion";
import { usePersonalizedRecommendation } from "@/hooks/useRecommendation";

export function AIRecommendationCard() {
  const { data: recommendation, isLoading, isError } = usePersonalizedRecommendation();

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-linear-to-br from-primary/10 to-transparent">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  // Only accept a same-origin relative path — guards against a compromised or
  // misconfigured backend returning a javascript:/data: URL into next/link's href.
  const isSafeRelativeUrl = recommendation?.url.startsWith("/") && !recommendation.url.startsWith("//");

  if (isError || !recommendation || !isSafeRelativeUrl) return null;

  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-linear-to-br from-primary/10 to-transparent card-tilt">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-primary">
          <Sparkles className="h-4 w-4 fill-primary text-primary" />
          Gợi ý riêng cho bạn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link href={recommendation.url} className="flex gap-3 items-start group">
          <SafeCompanion state="happy" className="w-9 h-9 shrink-0" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {recommendation.title}
            </p>
            <p className="text-xs text-foreground/60 leading-relaxed">{recommendation.rationale}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
