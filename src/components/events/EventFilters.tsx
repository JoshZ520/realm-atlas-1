"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";

interface RegionOption {
  id: string;
  name: string;
}

interface EventFiltersProps {
  regions: RegionOption[];
}

export function EventFilters({ regions }: EventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-1">
        <Label htmlFor="filter-status">Status</Label>
        <select
          id="filter-status"
          aria-label="Filter by status"
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(e) => update("status", e.target.value)}
          className="h-10 min-w-[140px] rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
          <option value="ignored">Ignored</option>
        </select>
      </div>

      {regions.length > 0 && (
        <div className="space-y-1">
          <Label htmlFor="filter-region">Region</Label>
          <select
            id="filter-region"
            aria-label="Filter by region"
            defaultValue={searchParams.get("regionId") ?? ""}
            onChange={(e) => update("regionId", e.target.value)}
            className="h-10 min-w-[160px] rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
