export type CloudinaryParams = {
  upload_url: string;
  api_key: string;
  timestamp: number;
  signature: string;
  folder: string;
};

export function xhrUpload(
  url: string,
  fd: FormData,
  onProgress: (p: number) => void
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(JSON.parse(xhr.responseText)?.error?.message ?? "Cloudinary upload thất bại"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(fd);
  });
}
