import { BarChart3 } from "lucide-react";

export default function RevenueOverview() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <BarChart3 className="w-20 h-20 mb-4" />
      <p className="text-sm">Revenue overview chart will display here</p>
    </div>
  );
}