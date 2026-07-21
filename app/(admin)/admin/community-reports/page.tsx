"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, TriangleAlert, ShieldOff, Ban } from "lucide-react";
import { toast } from "sonner";
import { fetchAdmin } from "@/lib/api/services/fetchAdmin";
import type { CommunityReport } from "@/types/community";

type Tab = "open" | "resolved";

const fmtDateTime = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const isOverdue = (slaDeadline: string) => new Date(slaDeadline).getTime() < Date.now();

const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };

export default function AdminCommunityReportsPage() {
  const [tab, setTab] = useState<Tab>("open");
  const [open, setOpen] = useState<CommunityReport[]>([]);
  const [resolved, setResolved] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);

  const refetch = () => {
    setLoading(true);
    Promise.all([
      fetchAdmin.getCommunityReports("open"),
      fetchAdmin.getCommunityReports("resolved"),
    ])
      .then(([o, r]) => { setOpen(o); setResolved(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { refetch(); }, []);

  const moveToResolved = (updated: CommunityReport) => {
    setOpen((prev) => prev.filter((r) => r.id !== updated.id));
    setResolved((prev) => [updated, ...prev]);
  };

  const handleWarn = async (report: CommunityReport) => {
    setActing(true);
    try {
      const updated = await fetchAdmin.warnCommunityReport(report.id);
      moveToResolved(updated);
      toast.success(`Đã cảnh cáo ${report.reportedHandle}`);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setActing(false);
    }
  };

  const handleUnmatch = async (report: CommunityReport) => {
    setActing(true);
    try {
      const updated = await fetchAdmin.unmatchCommunityReport(report.id);
      moveToResolved(updated);
      toast.success(`Đã huỷ ghép cặp ${report.reportedHandle}`);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setActing(false);
    }
  };

  const handleBan = async (report: CommunityReport) => {
    setActing(true);
    try {
      const updated = await fetchAdmin.banCommunityReport(report.id);
      moveToResolved(updated);
      toast.success(`Đã cấm ${report.reportedHandle}`);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Báo cáo cộng đồng</h1>
        <p className="text-white/45 font-medium text-sm">Duyệt các báo cáo từ tính năng ghép đôi ẩn danh — SLA phản hồi 8 giờ</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 w-fit rounded-2xl border border-white/9" style={{ background: "rgba(255,255,255,0.04)" }}>
        {([["open", "Chờ duyệt", open.length], ["resolved", "Đã xử lý", resolved.length]] as [Tab, string, number][]).map(([value, label, count]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === value
                ? "bg-emerald-500/20 text-white border border-emerald-500/25"
                : "text-white/45 hover:text-white/80"
            }`}
          >
            {label}
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
              tab === value ? "bg-white/15 text-white" : "bg-white/8 text-white/40"
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Open */}
      {tab === "open" && (
        <div className="rounded-[24px] border border-white/9" style={cardStyle}>
          {!loading && open.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-white/70">Tất cả đã được xử lý</p>
              <p className="text-xs text-white/35 font-medium">Không còn báo cáo chờ duyệt</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {["Người báo cáo", "Bị báo cáo", "Lý do", "Thời hạn SLA", "Thao tác"].map((h, i) => (
                    <th key={i} className={`${i === 0 ? "px-6" : "px-4"} py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest${i === 4 ? " text-right pr-6" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-white/30 font-medium">Đang tải...</td>
                  </tr>
                )}
                {!loading && open.map((report) => {
                  const overdue = isOverdue(report.slaDeadline);
                  return (
                    <tr key={report.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-white/90">{report.reporterHandle}</td>
                      <td className="px-4 py-4 text-sm font-bold text-white/90">{report.reportedHandle}</td>
                      <td className="px-4 py-4 max-w-60">
                        <p className="text-xs font-medium text-white/40 truncate" title={report.reason ?? undefined}>
                          {report.reason ?? "(không có lý do)"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 w-fit ${
                          overdue
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                            : "bg-white/8 text-white/50 border-white/10"
                        }`}>
                          {overdue && <TriangleAlert className="w-3 h-3" />}
                          {overdue ? "Quá hạn" : fmtDateTime(report.slaDeadline)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleWarn(report)}
                            disabled={acting}
                            className="h-8 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition-colors border border-amber-500/25 active:scale-[0.97] disabled:opacity-50"
                          >
                            Cảnh cáo
                          </button>
                          <button
                            onClick={() => handleUnmatch(report)}
                            disabled={acting}
                            className="h-8 w-8 flex items-center justify-center bg-white/8 hover:bg-orange-500/15 text-white/35 hover:text-orange-400 rounded-xl transition-colors border border-white/10 disabled:opacity-50"
                            title="Huỷ ghép"
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleBan(report)}
                            disabled={acting}
                            className="h-8 w-8 flex items-center justify-center bg-white/8 hover:bg-rose-500/15 text-white/35 hover:text-rose-400 rounded-xl transition-colors border border-white/10 disabled:opacity-50"
                            title="Cấm"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Resolved */}
      {tab === "resolved" && (
        <div className="rounded-[24px] border border-white/9" style={cardStyle}>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Người báo cáo", "Bị báo cáo", "Lý do", "Thời điểm báo cáo"].map((h, i) => (
                  <th key={i} className={`${i === 0 ? "px-6" : "px-4"} py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-white/30 font-medium">Đang tải...</td>
                </tr>
              )}
              {!loading && resolved.map((report) => (
                <tr key={report.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-white/90">{report.reporterHandle}</td>
                  <td className="px-4 py-4 text-sm font-bold text-white/90">{report.reportedHandle}</td>
                  <td className="px-4 py-4 max-w-60">
                    <p className="text-xs font-medium text-white/40 truncate" title={report.reason ?? undefined}>
                      {report.reason ?? "(không có lý do)"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-white/50">{fmtDateTime(report.reportedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
