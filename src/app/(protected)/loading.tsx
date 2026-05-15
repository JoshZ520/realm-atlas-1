import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function ProtectedLoading() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton rows={1} />
      <LoadingSkeleton rows={3} />
    </div>
  );
}