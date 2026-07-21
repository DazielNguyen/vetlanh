"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCommunityFeatured } from "@/hooks/useServices";

export function CommunitySupport() {
    const { data } = useCommunityFeatured();
    const activeCount = data?.active_users_count ?? 4;

    return (
        <div className="h-full flex flex-col space-y-4">
            <h2 className="text-xl font-bold text-primary">Hỗ trợ Cộng đồng</h2>
            <Link href="/services/community" className="flex-1">
                <Card className="border-none card-lifted rounded-3xl overflow-hidden p-6 h-full flex flex-col justify-between hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                        <Users className="w-6 h-6 text-primary" strokeWidth={2} />
                    </div>
                    <div className="mt-4 space-y-1">
                        <p className="text-sm font-bold text-foreground">
                            Kết nối ẩn danh với người khác đang trải qua điều tương tự
                        </p>
                        <p className="text-xs text-foreground/50 font-medium">{activeCount} đang hoạt động</p>
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mt-4 group-hover:underline">
                        Tham gia ngay →
                    </span>
                </Card>
            </Link>
        </div>
    );
}
