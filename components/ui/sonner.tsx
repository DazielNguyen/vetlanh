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
            "!bg-gradient-to-b !from-white/85 !to-white/70",
            "!backdrop-blur-xl",
            "!border !border-white/65",
            // outer depth shadow + inner top-edge highlight = glass 3D effect
            "!shadow-[0_8px_40px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.95)]",
            "!text-[#3D3530]",
            "!px-4 !py-3.5",
            "!gap-3",
          ].join(" "),
          title: "!text-sm !font-semibold !text-[#3D3530]",
          description: "!text-xs !text-[#7A736E] !leading-relaxed",
          success: "!border-l-2 !border-l-emerald-400 [&>[data-icon]]:!text-emerald-500",
          error:   "!border-l-2 !border-l-red-400   [&>[data-icon]]:!text-red-400",
          warning: "!border-l-2 !border-l-yellow-400 [&>[data-icon]]:!text-yellow-500",
          info:    "!border-l-2 !border-l-[#789dbc]  [&>[data-icon]]:!text-[#789dbc]",
          closeButton: [
            "!static !translate-x-0 !translate-y-0 !relative",
            "!rounded-lg",
            "!bg-white/40 !border-white/50",
            "!text-[#789dbc]",
            "hover:!bg-white/60",
            "!transition-colors !w-6 !h-6",
          ].join(" "),
          actionButton: "!rounded-xl !bg-[#789dbc] !text-white hover:!bg-[#5b82a3] !text-xs !font-semibold !transition-colors",
          cancelButton: "!rounded-xl !bg-white/40 !text-[#789dbc] hover:!bg-white/60 !text-xs !font-semibold !transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
