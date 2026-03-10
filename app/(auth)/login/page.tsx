"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (email === "user@gmail.com" && password === "user@1234") {
            router.push("/services");
        } else {
            setError("Tài khoản hoặc mật khẩu không chính xác.");
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-10 text-pretty">
                <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Chào mừng bạn trở lại</h2>
                <p className="text-slate-500 text-base">Hôm nay của bạn thế nào? Hãy đăng nhập để tiếp tục hành trình nhé.</p>
            </div>

            <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 text-center font-medium">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2.5">
                        <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">Email</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" className="text-slate-700 font-semibold">Mật khẩu</Label>
                            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-emerald-600 transition-colors">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-slate-800 text-white shadow-md active:scale-[0.98] transition-all group">
                        Đăng nhập
                        <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </form>

                <div className="mt-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-200 after:mt-0.5 after:flex-1 after:border-t after:border-slate-200">
                    <p className="mx-4 mb-0 text-center text-xs font-medium text-slate-400 uppercase tracking-widest">Hoặc</p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 w-full rounded-2xl border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-slate-600 font-semibold shadow-sm overflow-hidden flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google
                    </Button>
                    <Button variant="outline" className="h-12 w-full rounded-2xl border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-slate-600 font-semibold shadow-sm overflow-hidden flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="#1877F2" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
                        </svg>
                        Facebook
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                Bạn chưa có tài khoản?{" "}
                <Link href="/register" className="font-bold text-primary hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}
