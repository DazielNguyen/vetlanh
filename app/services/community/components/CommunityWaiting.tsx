"use client";

import Link from "next/link";
import { Loader2, MessageSquare, LifeBuoy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCommunityOptInOut } from "@/hooks/useCommunityMatch";
import { openServiceChat } from "@/lib/chatAssistant";

export function CommunityWaiting() {
  const { optOut, isPending } = useCommunityOptInOut();

  return (
    <Card className="border-none card-lifted rounded-3xl overflow-hidden">
      <CardContent className="p-8 md:p-10 flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" strokeWidth={2} />
        </div>

        <div className="space-y-1.5 max-w-md">
          <h2 className="text-lg font-bold text-foreground">Đang tìm người bạn đồng hành...</h2>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Chưa có ai sẵn sàng ghép đôi ngay lúc này. Trong lúc chờ, bạn không cần phải ở một mình
            — đây là những lối đi khác bạn có thể dùng ngay:
          </p>
        </div>

        <div className="w-full max-w-sm grid grid-cols-1 gap-3">
          <Button
            type="button"
            onClick={() =>
              openServiceChat("Mình đang chờ kết nối cộng đồng và muốn có người lắng nghe lúc này.")
            }
            variant="outline"
            className="rounded-2xl h-12 justify-start gap-3 border-border/40"
          >
            <MessageSquare className="w-4 h-4 text-primary" strokeWidth={2} />
            Trò chuyện với Vết Lành AI
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-2xl h-12 justify-start gap-3 border-border/40"
          >
            <Link href="/services/safety-plan">
              <LifeBuoy className="w-4 h-4 text-primary" strokeWidth={2} />
              Xem công cụ hỗ trợ an toàn
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => optOut()}
          disabled={isPending}
          className="text-foreground/40 hover:text-foreground/70 text-xs"
        >
          {isPending ? "Đang huỷ..." : "Huỷ tham gia"}
        </Button>
      </CardContent>
    </Card>
  );
}
