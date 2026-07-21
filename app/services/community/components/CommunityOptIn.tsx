"use client";

import { useState } from "react";
import { Users, ShieldCheck, EyeOff, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCommunityOptInOut } from "@/hooks/useCommunityMatch";

const EXPLAIN_POINTS = [
  { Icon: EyeOff, text: "Bạn sẽ được ghép ẩn danh — không ai thấy tên thật, email hay ảnh đại diện của bạn." },
  { Icon: ShieldCheck, text: "Bạn có thể thoát cuộc trò chuyện bất cứ lúc nào, không cần xác nhận." },
  { Icon: Flag, text: "Có thể báo cáo hoặc chặn người đối diện nếu bạn cảm thấy không an toàn." },
];

export function CommunityOptIn() {
  const { optIn, isPending } = useCommunityOptInOut();
  const [confirming, setConfirming] = useState(false);

  return (
    <Card className="border-none card-lifted rounded-3xl overflow-hidden">
      <CardContent className="p-8 md:p-10 flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
          <Users className="w-8 h-8 text-primary" strokeWidth={2} />
        </div>

        <div className="space-y-1.5 max-w-md">
          <h2 className="text-lg font-bold text-foreground">Kết nối với một người bạn ẩn danh</h2>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Đôi khi được lắng nghe bởi một người cũng đang trải qua điều tương tự sẽ giúp bạn thấy đỡ cô đơn hơn.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3 text-left">
          {EXPLAIN_POINTS.map(({ Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-xs text-foreground/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {!confirming ? (
          <Button
            onClick={() => setConfirming(true)}
            className="rounded-2xl bg-primary hover:bg-primary/90 text-white px-8 h-11 font-semibold"
          >
            Tham gia cộng đồng
          </Button>
        ) : (
          <div className="w-full max-w-sm space-y-3">
            <p className="text-xs text-foreground/50 font-medium">
              Xác nhận bạn đồng ý được ghép ẩn danh với một người dùng khác?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirming(false)}
                disabled={isPending}
                className="flex-1 rounded-2xl h-11"
              >
                Huỷ
              </Button>
              <Button
                onClick={() => optIn()}
                disabled={isPending}
                className="flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-white h-11 font-semibold"
              >
                {isPending ? "Đang xử lý..." : "Đồng ý, tham gia"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
