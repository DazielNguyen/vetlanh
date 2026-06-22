"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useUser";

interface ProContentGateProps<T> {
    items: T[];
    /** The top-level element returned must carry a stable `key` prop (e.g. `key={item.id}`). */
    renderItem: (item: T, index: number) => React.ReactNode;
    freeLimit?: number;
    className?: string;
    /** Must match the parent grid className so blurred items stay visually aligned. */
    lockedGridClassName?: string;
}

export function ProContentGate<T>({
    items,
    renderItem,
    freeLimit = 2,
    className,
    lockedGridClassName,
}: ProContentGateProps<T>) {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <>
                {Array(freeLimit).fill(null).map((_, i) => (
                    <Skeleton key={i} className="rounded-2xl h-32" />
                ))}
            </>
        );
    }

    if (user?.subscription_status === "pro") {
        return <>{items.map((item, i) => renderItem(item, i))}</>;
    }

    const freeItems = items.slice(0, freeLimit);
    const lockedItems = items.slice(freeLimit);

    return (
        <>
            {freeItems.map((item, i) => renderItem(item, i))}
            {lockedItems.length > 0 && (
                <div className={cn("col-span-full relative", className)}>
                    {/* Blurred preview of locked items */}
                    <div
                        className={cn("pointer-events-none select-none blur-sm opacity-50", lockedGridClassName)}
                        aria-hidden="true"
                    >
                        {lockedItems.map((item, i) => renderItem(item, freeLimit + i))}
                    </div>

                    {/* Gradient fade using the theme background token */}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/70 to-background pointer-events-none" />

                    {/* CTA */}
                    <div className="relative z-10 flex flex-col items-center gap-3 py-8 px-4">
                        <span className="text-[10px] font-bold tracking-widest uppercase bg-[#6D8A96] text-white px-2.5 py-0.5 rounded-full">
                            PRO
                        </span>
                        <div className="text-center">
                            <h3 className="text-base font-bold text-slate-800">Mở khoá toàn bộ nội dung</h3>
                            <p className="text-xs text-slate-500 mt-1">Nâng cấp Pro để trải nghiệm không giới hạn</p>
                        </div>
                        <Link
                            href="/services/upgrade"
                            className="rounded-2xl px-6 py-2.5 bg-[#6D8A96] hover:bg-[#5A737D] text-white font-bold text-sm shadow-sm transition-colors"
                        >
                            Nâng cấp Pro ngay
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
