"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: [
            "group/toast",
            "!rounded-2xl",
            "!bg-white/90 !backdrop-blur-md",
            "!border !border-white/60",
            "!shadow-[0_8px_32px_rgba(0,0,0,0.10)]",
            "!text-[#3D3530]",
            "!px-4 !py-3.5",
            "!gap-3",
          ].join(" "),
          title: "!text-sm !font-semibold !text-[#3D3530]",
          description: "!text-xs !text-[#7A736E] !leading-relaxed",
          success: "!border-l-2 !border-l-emerald-400 [&>[data-icon]]:!text-emerald-500",
          error: "!border-l-2 !border-l-red-400 [&>[data-icon]]:!text-red-400",
          warning: "!border-l-2 !border-l-yellow-400 [&>[data-icon]]:!text-yellow-500",
          info: "!border-l-2 !border-l-[#789dbc] [&>[data-icon]]:!text-[#789dbc]",
          closeButton: [
            "!static !translate-x-0 !translate-y-0",
            "!relative",
            "!rounded-lg",
            "!bg-black/5 !border-black/10",
            "!text-[#789dbc]",
            "hover:!bg-black/10",
            "!transition-colors",
            "!w-6 !h-6",
          ].join(" "),
          actionButton: "!rounded-xl !bg-[#789dbc] !text-white hover:!bg-[#5b82a3] !text-xs !font-semibold !transition-colors",
          cancelButton: "!rounded-xl !bg-black/5 !text-[#789dbc] hover:!bg-black/10 !text-xs !font-semibold !transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
