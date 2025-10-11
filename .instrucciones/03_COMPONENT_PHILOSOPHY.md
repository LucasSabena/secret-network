# Component Development Philosophy

All components must adhere to the following principles to ensure the project is scalable, maintainable, and performant.

1.  **Data-Driven, Not Hardcoded:** Components should be "dumb". They receive all the data they need to render via props. Never hardcode text, numbers, or other content directly into a component unless it is genuinely static (e.g., a "Submit" button label).

2.  **Server-First Mentality:** Components should be React Server Components (RSCs) by default. Only add the `"use client";` directive at the top of a file if the component absolutely requires browser-only APIs or interactivity hooks like `useState`, `useEffect`, or event handlers (`onClick`, `onChange`, etc.).

3.  **Build Small, Compose Large:** Create small, single-purpose components (e.g., `<Button>`, `<Icon>`, `<Card>`) and compose them together to build larger, more complex UI sections (e.g., `<ProgramGrid>`, `<FiltersSidebar>`).

4.  **Strongly Typed Props:** Every component must define its props using a TypeScript `interface` or `type`. This ensures type safety and provides excellent autocompletion for developers.

5.  **Leverage Design Tokens:** Do not use magic numbers or hardcoded values for styling (e.g., `mt-3.5`, `text-[#ff3399]`). Always use the design tokens defined in `tailwind.config.ts`. For example, use `mt-4` (if `4` is a token) and `text-primary`.

### Example: A Program Card Component

A component like `<ProgramCard />` should be a Server Component that receives a `programa` object as a prop and renders its details.

```typescript
// src/components/program-card.tsx

import { type Program } from "@/lib/types"; // Assuming types are defined elsewhere

interface ProgramCardProps {
  program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg">
      <h3 className="text-lg font-bold">{program.nombre}</h3>
      <p className="text-muted-foreground">{program.descripcion_corta}</p>
      {/* ... other details ... */}
    </div>
  );
}