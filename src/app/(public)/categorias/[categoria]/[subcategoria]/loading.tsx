import { ProgramCardSkeleton } from "@/components/shared/program-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for subcategory page
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Skeleton */}
        <nav className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </nav>

        {/* Header Skeleton */}
        <div className="mb-8 md:mb-12">
          <Skeleton className="h-10 w-80 mb-3" />
          <Skeleton className="h-6 w-full max-w-2xl mb-2" />
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>

        {/* Programs Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProgramCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
