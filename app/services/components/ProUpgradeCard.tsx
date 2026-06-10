import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { PACKAGES, PRO_FEATURES, DEFAULT_PACKAGE_KEY } from "@/lib/constants/packages";

const HIGHLIGHTS = PRO_FEATURES.slice(0, 3);

export function ProUpgradeCard() {
  return (
    <Card className="border-none card-lifted rounded-3xl bg-linear-to-br from-[#E8F2F6] to-[#C8DFE9] relative overflow-hidden h-full flex flex-col">
      <div className="absolute -right-6 -bottom-6 opacity-20 text-[#6D8A96]">
        <Sparkles className="w-32 h-32" />
      </div>

      <CardContent className="p-6 relative z-10 flex flex-col gap-4 h-full">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest uppercase bg-[#6D8A96] text-white px-2.5 py-0.5 rounded-full">
            PRO
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-snug">
            Mở khoá toàn bộ hành trình
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Từ <span className="font-semibold text-[#6D8A96]">{PACKAGES[0].price}/tháng</span>
          </p>
        </div>

        <ul className="space-y-2 flex-1">
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
              <div className="w-5 h-5 rounded-full bg-[#6D8A96]/15 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#6D8A96]" strokeWidth={3} />
              </div>
              {item}
            </li>
          ))}
        </ul>

        <Button
          asChild
          className="w-full rounded-2xl py-5 bg-[#6D8A96] hover:bg-[#5A737D] text-white font-bold shadow-sm border-none"
        >
          <Link href={`/services/upgrade?package=${DEFAULT_PACKAGE_KEY}`}>Nâng cấp Pro ngay</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
