import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VerifyEmailChangeContent from "./VerifyEmailChangeContent";

export default function VerifyEmailChangePage() {
    return (
        <div className="w-full max-w-md">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                    </div>
                }
            >
                <VerifyEmailChangeContent />
            </Suspense>
        </div>
    );
}
