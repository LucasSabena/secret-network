// FILE: src/components/contact/contact-info.tsx

'use client';

import { Mail, Clock, MapPin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export function ContactInfo() {
  const infoItems = [
    {
      icon: Mail,
      title: 'Email',
      description: '01studiobinary@gmail.com',
      delay: 0.1,
    },
    {
      icon: Clock,
      title: 'Tiempo de respuesta',
      description: '24-48 horas hábiles',
      delay: 0.2,
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      description: 'Argentina',
      delay: 0.3,
    },
    {
      icon: Github,
      title: 'Open Source',
      description: 'LucasSabena/secret-network',
      delay: 0.4,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">
          Información de contacto
        </h3>
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
              className="flex items-start gap-3"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tarjeta de FAQ rápido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-transparent p-6"
      >
        <h3 className="mb-3 text-lg font-semibold">
          Preguntas frecuentes
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">
              ¿Cuánto cuesta agregar un programa?
            </strong>
            <br />
            Es completamente gratis. Solo enviá la sugerencia.
          </p>
          <p>
            <strong className="text-foreground">
              ¿Responden todos los mensajes?
            </strong>
            <br />
            Sí, leemos y respondemos cada mensaje que recibimos.
          </p>
          <p>
            <strong className="text-foreground">
              ¿Aceptan sponsors?
            </strong>
            <br />
            ¡Sí! Contactanos para más información sobre oportunidades.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
