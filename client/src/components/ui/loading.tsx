import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export function Loading({ 
  size = "md", 
  fullScreen = false, 
  text = "Loading...",
  className
}: LoadingProps) {
  // Determine loader size based on prop
  const loaderSizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  // Container classes based on fullScreen prop
  const containerClasses = fullScreen 
    ? "flex flex-col items-center justify-center min-h-screen"
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={cn(containerClasses, className)}>
      <Loader2 className={cn(loaderSizes[size], "animate-spin text-primary")} />
      {text && <p className="mt-2 text-muted-foreground text-sm">{text}</p>}
    </div>
  );
}