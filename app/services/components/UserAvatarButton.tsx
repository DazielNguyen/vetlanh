"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useUser";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

export function UserAvatarButton() {
  const { data: user } = useCurrentUser();
  const src = formatImageUrl(user?.avatar_url) ?? "/images/placeholder-user.jpg";

  return (
    <Link
      href="/services/profile"
      aria-label="Mở hồ sơ cá nhân"
      className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      <img
        src={src}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full border-2 border-white/80 object-cover cursor-pointer shadow-[0_8px_20px_rgba(91,55,31,0.14)] hover:-translate-y-0.5 transition dark:border-white/15"
        alt="Ảnh đại diện"
      />
    </Link>
  );
}
