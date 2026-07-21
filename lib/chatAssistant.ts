export const OPEN_SERVICE_CHAT_EVENT = "open-service-chat";

export function openServiceChat(prompt?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(OPEN_SERVICE_CHAT_EVENT, {
      detail: { prompt: prompt?.trim() || undefined },
    })
  );
}
