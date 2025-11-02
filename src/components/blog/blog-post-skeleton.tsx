// FILE: src/components/blog/blog-post-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function BlogPostSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button skeleton */}
        <Skeleton className="h-5 w-32 mb-6" />

        {/* Image skeleton */}
        <Skeleton className="h-64 md:h-96 w-full rounded-lg mb-8" />

        {/* Meta info skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-3/4 mb-6" />

        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        <hr className="mb-8" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          
          <div className="py-4">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
