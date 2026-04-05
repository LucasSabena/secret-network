import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Inspiración | Secret Network',
  description: 'Un recopilatorio de páginas web que me gustan y me inspiran.',
};

export default async function InspiracionPage() {
  const supabase = await createClient();
  
  const { data: inspirations } = await supabase
    .from('inspirations')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Inspiración
          </h1>
          <p className="text-lg text-muted-foreground">
            Un recopilatorio simple de páginas web que voy encontrando y me gustan.
          </p>
        </div>

        {inspirations && inspirations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirations.map((item) => {
              let targetUrl = item.url;
              let displayUrl = item.url;
              try {
                const urlObj = new URL(item.url);
                urlObj.searchParams.set('utm_source', 'secretnetwork.co');
                urlObj.searchParams.set('utm_medium', 'referral');
                targetUrl = urlObj.toString();
                displayUrl = urlObj.hostname.replace('www.', '');
              } catch (e) {
                // Ignore invalid URLs
                displayUrl = item.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
              }

              return (
                <a
                  key={item.id}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">Sin imagen</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="flex items-center gap-2 text-white font-medium bg-black/50 px-4 py-2 rounded-full">
                        Visitar sitio <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {displayUrl}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed rounded-xl border-border">
            <p className="text-muted-foreground">
              Todavía no hay páginas guardadas. ¡Pronto agregaré algunas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
