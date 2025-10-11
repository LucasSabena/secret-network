# Tech Stack & Resources

This project uses a modern, server-first tech stack focused on performance, developer experience, and scalability.

- **Framework:** **Next.js** (using the App Router). All data fetching should be done server-side where possible for speed and security.
- **Language:** **TypeScript**. All components, functions, and types should be strongly typed.
- **Database:** **Supabase** (PostgreSQL). All interactions with the database are handled via the `@supabase/supabase-js` client library.
- **Styling:** **Tailwind CSS**. Utility-first CSS for rapid development. Custom styles and design system tokens are configured in `tailwind.config.ts`.
- **UI Components:** **shadcn/ui**. This is NOT a component library. It's a collection of reusable components that we copy into our project. They are built with Tailwind CSS and Radix UI, making them fully customizable. It is pre-configured to use `lucide-react` for icons within its components.

- **Iconography:** **Lucide React**. This is the official and sole icon library for the project.
    - **Why Lucide?** It provides a comprehensive set of clean, consistent, and lightweight SVG icons that can be easily styled with Tailwind CSS (color, size, stroke width).
    - **Strict Policy: NO EMOJIS.** The use of emojis in the UI is strictly prohibited. Lucide icons provide a professional, stylable, and consistent visual language that emojis cannot guarantee across different platforms and devices.

- **Animations:** **Framer Motion**. Used for all UI animations to create a fluid and engaging user experience.
- **Image Hosting:** **Cloudinary**. All static assets like program icons and screenshots are hosted on Cloudinary for global CDN delivery and on-the-fly transformations. The database only stores the URLs to these assets.
- **Hosting/Deployment:** **Vercel**. The project is deployed on Vercel, which is optimized for Next.js and provides seamless continuous deployment from GitHub.
- **Version Control:** **Git & GitHub**. The codebase is managed and versioned using Git and hosted on a private GitHub repository.