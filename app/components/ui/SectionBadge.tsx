import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function SectionBadge({ children, className, variant = "default" }: SectionBadgeProps) {
  return (
    <Badge variant={variant} className={cn(className)}>
      {children}
    </Badge>
  );
}
