import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function SerieHeroSkeleton() {
  return (
    <div className="border-b bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-12 w-96 mb-4" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  );
}

export function SerieCarouselSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SeriePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <SerieHeroSkeleton />
      <SerieCarouselSkeleton />
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex gap-4">
                <Skeleton className="w-48 h-32 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
