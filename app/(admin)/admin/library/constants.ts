import apiService from "@/lib/api/core";
import { xhrUpload, type CloudinaryParams } from "@/lib/utils/cloudinaryUpload";
import { type Article, type ArticleCategory } from "@/lib/api/services/fetchLibrary";

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
    healing: "Kỹ thuật chữa lành",
    psychology: "Xu hướng tâm lý",
    research: "Nghiên cứu",
    lifestyle: "Lối sống",
};

export const CATEGORIES: ArticleCategory[] = ["healing", "psychology", "research", "lifestyle"];

export const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };
export const overlayStyle = { background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" };
export const COLS = "grid grid-cols-[1fr_140px_90px_90px_90px_140px] gap-4 px-6";
export const TABLE_HEADERS = ["Bài viết", "Danh mục", "Phút đọc", "Ảnh bìa", "Trạng thái", "Hành động"];

export const hasCover = (a: Article) => !!a.cover_url;

export const apiDetail = (e: unknown, fallback: string) =>
    (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? fallback;

export async function uploadCoverImage(articleId: string, file: File, onProgress: (p: number) => void): Promise<Article> {
    const paramsRes = await apiService.post<CloudinaryParams>(`api/v1/articles/${articleId}/upload-url`);
    const p = paramsRes.data;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", p.api_key);
    fd.append("timestamp", String(p.timestamp));
    fd.append("signature", p.signature);
    fd.append("folder", p.folder);
    const cloud = await xhrUpload(p.upload_url, fd, onProgress);
    const patchRes = await apiService.patch<Article>(`api/v1/articles/${articleId}`, {
        cover_url: cloud.secure_url,
        cloudinary_public_id: cloud.public_id,
    });
    return patchRes.data;
}
