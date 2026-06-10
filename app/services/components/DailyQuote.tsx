"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useDailyQuote } from "@/hooks/useServices";

export function DailyQuote() {
    const { data } = useDailyQuote();

    const text = data?.text ?? "Chữa lành không phải đường thẳng, nhưng mỗi bước tiến đều là một chiến thắng.";
    const author = data?.author;

    return (
        <Card className="border-none shadow-md rounded-3xl bg-[#7C9AB3] overflow-hidden h-full">
            <CardContent className="p-8 text-left relative overflow-hidden min-h-40 h-full flex flex-col justify-center">
                {/* TODO: replace with hosted asset */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.pexels.com/photos/839462/pexels-photo-839462.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt=""
                        fill
                        className="object-cover opacity-20"
                        sizes="(max-width: 768px) 100vw, 40vw"
                    />
                </div>

                <div className="absolute top-4 left-4 text-white/20 text-6xl font-serif select-none">"</div>

                <div className="relative z-10 pl-4">
                    <p className="text-sm md:text-base font-medium italic text-white leading-relaxed mb-6">
                        "{text}"
                    </p>
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                        {author ?? "Cảm hứng mỗi ngày"}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
