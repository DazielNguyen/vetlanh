import Link from "next/link";
import { Mail, ArrowLeft, Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthIconCircle } from "@/components/auth/auth-card";

export default async function VerifyPendingPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const { email } = await searchParams;

    return (
        <div className="w-full max-w-md">
            <AuthCard>
                <div className="flex justify-center mb-6">
                    <AuthIconCircle className="animate-pulse">
                        <Mail className="w-8 h-8 text-white" />
                    </AuthIconCircle>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        Kiểm tra email của bạn
                    </h2>
                    {email ? (
                        <p className="text-white/65 text-sm leading-relaxed">
                            Chúng tôi đã gửi email xác thực đến{" "}
                            <span className="font-bold text-white">{email}</span>.
                            Vui lòng nhấp vào liên kết trong email để xác thực tài khoản.
                        </p>
                    ) : (
                        <p className="text-white/65 text-sm leading-relaxed">
                            Chúng tôi đã gửi email xác minh tới địa chỉ của bạn. Vui lòng nhấp vào liên kết trong email để xác minh tài khoản.
                        </p>
                    )}
                </div>

                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
                    <p className="text-white/90 text-sm font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0" />
                        Không thấy email?
                    </p>
                    <ul className="space-y-1">
                        <li className="text-white/65 text-xs">• Kiểm tra thư mục Spam</li>
                        <li className="text-white/65 text-xs">• Chắc chắn bạn kiểm tra đúng email đã đăng ký</li>
                    </ul>
                </div>

                <Link
                    href={email ? `/resend-verification?email=${encodeURIComponent(email)}` : "/resend-verification"}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-white/10 border border-white/25 text-white/80 hover:bg-white/20 hover:text-white font-semibold text-sm transition-colors mb-3"
                >
                    <RefreshCw className="w-4 h-4" strokeWidth={2} />
                    Gửi lại email xác thực
                </Link>

                <Link href="/login">
                    <Button
                        variant="outline"
                        className="w-full h-12 rounded-2xl bg-white/10 border-white/25 text-white hover:bg-white/20 hover:text-white font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại đăng nhập
                    </Button>
                </Link>

                <p className="mt-5 text-center text-xs text-white/40">
                    Liên kết xác minh sẽ hết hạn trong 24 giờ
                </p>
            </AuthCard>
        </div>
    );
}
