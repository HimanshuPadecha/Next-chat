import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export const FullScreenLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
          <Loader2Icon className="size-8 text-white/50 animate-pulse" />
        </div>
        <span className="text-white/80 font-medium tracking-wide text-sm">{text}</span>
      </div>
    </div>
  );
};

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/10", className)}
      {...props}
    />
  );
};
