import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ProgramCardSkeleton Component
 * 
 * Loading skeleton for program cards that matches the structure
 * of the actual ProgramCard component
 */
export function ProgramCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        {/* Icon, Name, and Badges */}
        <div className="flex items-center gap-3 mb-3">
          {/* Icon skeleton */}
          <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
          
          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
            {/* Name skeleton */}
            <Skeleton className="h-6 w-32" />
            
            {/* Badges skeleton */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>
          </div>
        </div>

        {/* Category skeleton */}
        <Skeleton className="h-4 w-24 mb-2" />
      </CardHeader>

      <CardContent className="flex-grow">
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Subcategories and Difficulty skeleton */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-14 rounded-md" />
          </div>
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </CardContent>

      <CardFooter className="pt-4 mt-auto">
        {/* Ver detalles skeleton */}
        <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  );
}
