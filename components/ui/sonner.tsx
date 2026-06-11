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
            "!bg-white/95 !backdrop-blur-sm",
            "!border !border-[#d6e8f5]",
            "!shadow-[0_4px_24px_rgba(120,157,188,0.18)]",
            "!text-[#3D3530]",
            "!px-4 !py-3.5",
            "!gap-3",
          ].join(" "),
          title: "!text-sm !font-semibold !text-[#3D3530]",
          description: "!text-xs !text-[#7A736E] !leading-relaxed",
          success: "!border-l-[3px] !border-l-emerald-400 [&>[data-icon]]:!text-emerald-500",
          error: "!border-l-[3px] !border-l-red-400 [&>[data-icon]]:!text-red-400",
          warning: "!border-l-[3px] !border-l-yellow-400 [&>[data-icon]]:!text-yellow-500",
          info: "!border-l-[3px] !border-l-[#789dbc] [&>[data-icon]]:!text-[#789dbc]",
          closeButton: [
            "!rounded-lg",
            "!bg-[#f4f8fc] !border-[#d6e8f5]",
            "!text-[#789dbc]",
            "hover:!bg-[#d6e8f5]",
            "!transition-colors",
          ].join(" "),
          actionButton: "!rounded-xl !bg-[#789dbc] !text-white hover:!bg-[#5b82a3] !text-xs !font-semibold !transition-colors",
          cancelButton: "!rounded-xl !bg-[#f4f8fc] !text-[#789dbc] hover:!bg-[#d6e8f5] !text-xs !font-semibold !transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
