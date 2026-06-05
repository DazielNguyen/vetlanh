"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useUser";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

export function UserAvatarButton() {
    const { data: user } = useCurrentUser();
    const src = formatImageUrl(user?.avatar_url) ?? "/images/placeholder-user.jpg";

    return (
        <Link href="/services/profile">
            <img
                src={src}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border border-slate-200 object-cover cursor-pointer hover:opacity-90 transition"
                alt="Avatar User"
            />
        </Link>
    );
}
