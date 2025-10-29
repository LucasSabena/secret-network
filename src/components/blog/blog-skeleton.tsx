import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function BlogHeroSkeleton() {
  return (
    <div className="border-b bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Skeleton className="h-8 w-40 mx-auto rounded-full" />
          <Skeleton className="h-16 w-96 mx-auto" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          <Skeleton className="h-5 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden group">
      <Skeleton className="w-full aspect-video" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
}

export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeroSkeleton />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>
        <BlogGridSkeleton />
      </div>
    </div>
  );
}
