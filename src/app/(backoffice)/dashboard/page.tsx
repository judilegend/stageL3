import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Your dashboard content */}
      </div>
    </Suspense>
  );
}
