"use client";

import { useEffect, useRef } from "react";
import type { Driver } from "driver.js";

const TOUR_KEY = "vetlanh_tour_done";

export function ServiceTour() {
    const driverRef = useRef<Driver | null>(null);

    useEffect(() => {
        if (localStorage.getItem(TOUR_KEY)) return;

        let rafId = 0;
        let retries = 0;
        const MAX_RETRIES = 20;

        const launchTour = async () => {
            const { driver } = await import("driver.js");

            const driverObj = driver({
                animate: true,
                showProgress: true,
                nextBtnText: "Tiếp →",
                prevBtnText: "← Quay lại",
                doneBtnText: "Hoàn thành ✓",
                onDestroyed: () => {
                    localStorage.setItem(TOUR_KEY, "1");
                },
                steps: [
                    {
                        element: '[data-tour="dashboard"]',
                        popover: {
                            title: "Chào mừng đến Vết Lành 👋",
                            description: "Đây là trang chủ của bạn — nơi truy cập tất cả dịch vụ hỗ trợ sức khoẻ tâm thần. Nhấn × để bỏ qua phần hướng dẫn.",
                            side: "right",
                            align: "start",
                        },
                    },
                    {
                        element: '[data-tour="library"]',
                        popover: {
                            title: "Thư viện",
                            description: "Khám phá các bài viết về sức khoẻ tâm thần, kỹ thuật chữa lành và kiến thức hữu ích được chọn lọc kỹ càng.",
                            side: "right",
                        },
                    },
                    {
                        element: '[data-tour="sounds"]',
                        popover: {
                            title: "Âm thanh thư giãn",
                            description: "Nghe nhạc thiên nhiên và âm thanh thiền định giúp bạn giảm căng thẳng và tập trung.",
                            side: "right",
                        },
                    },
                    {
                        element: '[data-tour="exercises"]',
                        popover: {
                            title: "Bài tập",
                            description: "Thực hành các bài tập tâm lý và chánh niệm được thiết kế bởi chuyên gia để cải thiện sức khoẻ tinh thần mỗi ngày.",
                            side: "right",
                        },
                    },
                    {
                        element: '[data-tour="settings"]',
                        popover: {
                            title: "Hồ sơ & Cài đặt",
                            description: "Quản lý thông tin tài khoản, xem lịch sử sử dụng và nâng cấp Pro để mở khoá toàn bộ tính năng.",
                            side: "right",
                        },
                    },
                ],
            });

            driverRef.current = driverObj;
            driverObj.drive();
        };

        const waitForTargets = () => {
            if (document.querySelector('[data-tour="library"]')) {
                launchTour();
                return;
            }
            retries++;
            if (retries < MAX_RETRIES) {
                rafId = requestAnimationFrame(waitForTargets);
            }
        };

        rafId = requestAnimationFrame(waitForTargets);

        return () => {
            cancelAnimationFrame(rafId);
            if (driverRef.current) {
                driverRef.current.destroy();
                driverRef.current = null;
            }
        };
    }, []);

    return null;
}
