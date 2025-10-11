import { ProgramCardSkeleton } from "@/components/shared/program-card-skeleton";

/**
 * Loading state for the home page
 * Shows skeleton cards while data is being fetched
 */
export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20 py-20 md:py-28">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="h-12 w-48 bg-muted rounded-lg mx-auto animate-pulse" />
            <div className="space-y-3">
              <div className="h-8 w-full bg-muted rounded-lg animate-pulse" />
              <div className="h-8 w-5/6 bg-muted rounded-lg mx-auto animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-full bg-muted rounded-lg animate-pulse" />
              <div className="h-6 w-4/5 bg-muted rounded-lg mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="h-8 w-64 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-6 w-96 bg-muted rounded-lg animate-pulse" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
          <div className="flex gap-4">
            <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProgramCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
