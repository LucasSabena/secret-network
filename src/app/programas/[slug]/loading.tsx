import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for program detail page
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
          <Skeleton className="h-4 w-40" />
        </nav>

        {/* Header Section Skeleton */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-start gap-6 mb-6">
            {/* Icon */}
            <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-lg flex-shrink-0" />
            
            <div className="flex-1">
              {/* Title and badges */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <Skeleton className="h-10 w-64" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
              
              {/* Category */}
              <Skeleton className="h-5 w-32 mb-4" />
              
              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Long Description */}
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Screenshot */}
            <div>
              <Skeleton className="h-8 w-40 mb-4" />
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>

            {/* Tags Card */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
