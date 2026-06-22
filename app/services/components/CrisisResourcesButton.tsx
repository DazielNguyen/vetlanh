"use client";

import { useState } from "react";
import { Phone, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCrisisResources } from "@/hooks/useCrisisResources";

export function CrisisResourcesButton() {
  const [open, setOpen] = useState(false);
  const { data: resources, isLoading } = useCrisisResources();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Đường dây hỗ trợ khẩn cấp"
        className="w-10 h-10 border border-red-200 dark:border-red-900/50 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 cursor-pointer hover:bg-red-50 dark:hover:bg-slate-700 transition text-red-400 hover:text-red-500"
      >
        <Phone className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
          tabIndex={-1}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md p-6 space-y-4 dark:border dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-red-500" />
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white">Đường dây hỗ trợ</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-500">
              Nếu bạn đang trong tình trạng khủng hoảng, hãy liên hệ ngay với một trong các đường
              dây dưới đây — miễn phí và bảo mật.
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
              </div>
            ) : !resources || resources.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                Không thể tải danh sách. Vui lòng thử lại sau.
              </p>
            ) : (
              <div className="space-y-3">
                {resources.map((r) => (
                  <div
                    key={r.name + (r.phone ?? "")}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{r.name}</p>
                      {r.phone && (
                        <a
                          href={`tel:${r.phone}`}
                          className="text-sm font-bold text-red-500 hover:text-red-600 transition"
                        >
                          {r.phone}
                        </a>
                      )}
                      {r.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full rounded-2xl"
              onClick={() => setOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
