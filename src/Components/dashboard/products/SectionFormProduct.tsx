import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  titleSection?: string;
  children: ReactNode;
}

export const SectionFormProduct = ({
  className,
  titleSection,
  children,
}: Props) => {
  return (
    <div
      className={cn(
        "bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl flex flex-col gap-6 p-8 h-fit",
        className
      )}
    >
      {titleSection && (
        <div className="border-b border-white/10 pb-4">
          <h2 className="font-bold tracking-tight text-xl text-neutral-900 dark:text-white">
            {titleSection}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};
