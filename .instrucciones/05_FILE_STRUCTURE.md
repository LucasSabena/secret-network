# Project File Structure

The project follows the standard Next.js App Router structure with the `src` directory.

- **`/.instructions`**: Contains these context files for the AI assistant.
- **`/public`**: For static assets like favicons, images, or fonts that are publicly accessible.
- **`/src`**: The main application source code directory.
    - **`/app`**: Contains all routes and layouts.
        - **`/(main)`**: A route group for pages that share the main layout (e.g., home, categories).
            - **`layout.tsx`**: The main layout file (with header, footer, etc.).
            - **`page.tsx`**: The homepage component.
        - **`/programas/[slug]`**: A dynamic route for individual program detail pages.
        - **`globals.css`**: The main stylesheet with design system tokens.
        - **`layout.tsx`**: The root layout, including `<html>` and `<body>` tags.
    - **`/components`**: For all reusable React components.
        - **`/ui`**: For shadcn/ui components (e.g., Button.tsx, Card.tsx).
        - **`/icons`**: For custom SVG icon components.
        - **`/layout`**: For major layout components like `<Header />` or `<Footer />`.
        - **`/shared`**: For components shared across multiple pages.
    - **`/lib`**: For utility functions, helper scripts, and third-party library configurations.
        - **`supabase.js`**: The Supabase client configuration.
        - **`types.ts`**: TypeScript type definitions for database tables (e.g., `Program`, `Category`).
        - **`utils.ts`**: General utility functions.
    - **`/.env.local`**: For storing secret environment variables (e.g., Supabase keys). **This file is NOT committed to Git.**
- **`tailwind.config.ts`**: The configuration file for Tailwind CSS, where the design system tokens (colors, fonts, etc.) are connected.