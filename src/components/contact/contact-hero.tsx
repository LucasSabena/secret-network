// FILE: src/components/contact/contact-hero.tsx

'use client';

import { Mail, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function ContactHero() {
  return (
    <section className="relative border-b border-border bg-gradient-to-b from-background to-muted/20 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Icono animado */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-4"
          >
            <MessageSquare className="h-8 w-8 text-primary" />
          </motion.div>

          {/* Título con gradiente */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Hablemos{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              juntos
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            ¿Tenés una idea? ¿Encontraste un error? ¿Querés ser sponsor?
            <br className="hidden md:block" />
            Estamos acá para escucharte.
          </p>

          {/* Badges informativos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-sm backdrop-blur">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Respuesta en 24-48hs
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-sm backdrop-blur">
              <Send className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Formulario seguro
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
