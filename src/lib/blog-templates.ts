// FILE: src/lib/blog-templates.ts
// Templates predefinidos para posts de blog

import { Block } from './types';

export interface BlogTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'lista' | 'tutorial' | 'comparativa' | 'guia' | 'review' | 'showcase';
  thumbnail: string;
  bloques: Block[];
}

// Helper para generar IDs únicos
function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

// Helper para crear múltiples items de lista
function createListItems(count: number, itemName: string): Block[] {
  const blocks: Block[] = [];

  for (let i = 1; i <= count; i++) {
    blocks.push(
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h3',
          content: `${i}. ${itemName} #${i}`,
        },
      },
      {
        id: generateBlockId(),
        type: 'image',
        data: {
          url: '',
          alt: `${itemName} ${i}`,
          caption: '',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: `Descripción detallada de ${itemName.toLowerCase()} #${i}. Explica por qué es interesante, qué lo hace único y por qué merece estar en esta lista.`,
        },
      },
      {
        id: generateBlockId(),
        type: 'separator',
        data: {
          style: 'solid',
        },
      }
    );
  }

  return blocks;
}

export const PREDEFINED_TEMPLATES: BlogTemplate[] = [
  // Template 1: Top 30 Páginas Error 404
  {
    id: 'top-30-error-404',
    nombre: 'Top 30 Páginas Error 404',
    descripcion: 'Lista de las mejores páginas de error 404 con ejemplos visuales',
    categoria: 'lista',
    thumbnail: 'alert-circle',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Las 30 Mejores Páginas de Error 404 Creativas',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Las páginas de error 404 no tienen por qué ser aburridas. En esta lista, hemos recopilado las 30 páginas de error 404 más creativas, divertidas y útiles de la web. Desde animaciones interactivas hasta mensajes ingeniosos, estas páginas convierten un error en una experiencia memorable.',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'default',
          title: 'Tip',
          description: 'Una buena página 404 debe ser útil, mantener al usuario en tu sitio y reflejar la personalidad de tu marca.',
        },
      },
      ...createListItems(30, 'Página Error 404'),
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Conclusión',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Estas 30 páginas de error 404 demuestran que incluso los errores pueden ser una oportunidad para sorprender y deleitar a tus usuarios. ¿Cuál es tu favorita?',
        },
      },
    ],
  },

  // Template 2: Top 20 Hero Sections Animadas
  {
    id: 'top-20-hero-sections',
    nombre: 'Top 20 Hero Sections Animadas',
    descripcion: 'Colección de las mejores hero sections con animaciones',
    categoria: 'showcase',
    thumbnail: 'palette',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Las 20 Mejores Hero Sections Animadas',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'La hero section es lo primero que ven tus visitantes. Una buena animación puede captar la atención, comunicar tu mensaje y crear una primera impresión memorable. Aquí están las 20 hero sections más impresionantes que hemos encontrado.',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'warning',
          title: 'Importante',
          description: 'Las animaciones deben mejorar la experiencia, no distraer. Asegúrate de que sean sutiles y no afecten el rendimiento.',
        },
      },
      ...createListItems(20, 'Hero Section'),
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Conclusión',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Estas hero sections demuestran el poder de las animaciones bien ejecutadas. Inspírate en estos ejemplos para crear tu propia hero section impactante.',
        },
      },
    ],
  },

  // Template 3: Tutorial Paso a Paso
  {
    id: 'tutorial-paso-a-paso',
    nombre: 'Tutorial Paso a Paso',
    descripcion: 'Guía estructurada con pasos numerados y código',
    categoria: 'tutorial',
    thumbnail: '📚',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Cómo [Hacer Algo]: Tutorial Completo',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'En este tutorial aprenderás paso a paso cómo [hacer algo]. Cubriremos desde los conceptos básicos hasta técnicas avanzadas.',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'default',
          title: 'Requisitos Previos',
          description: 'Antes de empezar, asegúrate de tener: Node.js instalado, conocimientos básicos de JavaScript, y un editor de código.',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Paso 1: Configuración Inicial',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Primero, vamos a configurar nuestro entorno de desarrollo.',
        },
      },
      {
        id: generateBlockId(),
        type: 'code',
        data: {
          language: 'bash',
          code: 'npm init -y\nnpm install [paquetes necesarios]',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Paso 2: Crear la Estructura',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Ahora crearemos la estructura básica de nuestro proyecto.',
        },
      },
      {
        id: generateBlockId(),
        type: 'code',
        data: {
          language: 'javascript',
          code: '// Código de ejemplo\nconst ejemplo = () => {\n  console.log("Hola mundo");\n};',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Paso 3: Implementación',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Implementemos la funcionalidad principal.',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'success',
          title: 'Tip Pro',
          description: 'Recuerda siempre probar tu código antes de continuar al siguiente paso.',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Conclusión',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: '¡Felicidades! Has completado el tutorial. Ahora puedes [resultado esperado].',
        },
      },
    ],
  },

  // Template 4: Comparativa de Herramientas
  {
    id: 'comparativa-herramientas',
    nombre: 'Comparativa de Herramientas',
    descripcion: 'Comparación detallada entre diferentes herramientas',
    categoria: 'comparativa',
    thumbnail: 'scale',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: '[Herramienta A] vs [Herramienta B] vs [Herramienta C]: Comparativa Completa',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Elegir la herramienta adecuada puede marcar la diferencia en tu proyecto. En esta comparativa analizamos las principales opciones del mercado.',
        },
      },
      {
        id: generateBlockId(),
        type: 'programs-grid',
        data: {
          programIds: [],
          columns: 3,
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Tabla Comparativa',
        },
      },
      {
        id: generateBlockId(),
        type: 'accordion',
        data: {
          items: [
            {
              id: generateBlockId(),
              title: '💰 Precio',
              content: '<strong>Herramienta A:</strong> $X/mes<br><strong>Herramienta B:</strong> $Y/mes<br><strong>Herramienta C:</strong> Gratis',
            },
            {
              id: generateBlockId(),
              title: 'Rendimiento',
              content: 'Comparación de velocidad y eficiencia entre las tres herramientas.',
            },
            {
              id: generateBlockId(),
              title: 'Facilidad de Uso',
              content: 'Análisis de la curva de aprendizaje y experiencia de usuario.',
            },
            {
              id: generateBlockId(),
              title: '🔧 Características',
              content: 'Lista de funcionalidades de cada herramienta.',
            },
          ],
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Veredicto Final',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'success',
          title: '🏆 Ganador',
          description: '[Herramienta X] es la mejor opción si buscas [característica]. Sin embargo, [Herramienta Y] puede ser mejor para [otro caso de uso].',
        },
      },
    ],
  },

  // Template 5: Guía Completa
  {
    id: 'guia-completa',
    nombre: 'Guía Completa',
    descripcion: 'Guía exhaustiva sobre un tema con índice y secciones',
    categoria: 'guia',
    thumbnail: '📖',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Guía Completa de [Tema]',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Esta es la guía definitiva sobre [tema]. Aprenderás todo lo que necesitas saber, desde los fundamentos hasta técnicas avanzadas.',
        },
      },
      {
        id: generateBlockId(),
        type: 'image',
        data: {
          url: '',
          alt: 'Imagen de portada de la guía',
          caption: '',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: '📑 Índice',
        },
      },
      {
        id: generateBlockId(),
        type: 'accordion',
        data: {
          items: [
            {
              id: generateBlockId(),
              title: '1. Introducción',
              content: 'Conceptos básicos y fundamentos',
            },
            {
              id: generateBlockId(),
              title: '2. Primeros Pasos',
              content: 'Cómo empezar y configuración inicial',
            },
            {
              id: generateBlockId(),
              title: '3. Técnicas Intermedias',
              content: 'Mejora tus habilidades',
            },
            {
              id: generateBlockId(),
              title: '4. Técnicas Avanzadas',
              content: 'Para usuarios experimentados',
            },
            {
              id: generateBlockId(),
              title: '5. Mejores Prácticas',
              content: 'Tips y recomendaciones',
            },
          ],
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: '1. Introducción',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Contenido de la introducción...',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'default',
          title: 'Sabías que...',
          description: 'Dato interesante relacionado con el tema.',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: '2. Primeros Pasos',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Contenido de primeros pasos...',
        },
      },
      {
        id: generateBlockId(),
        type: 'images-grid',
        data: {
          images: [
            { url: '', alt: 'Paso 1', caption: 'Descripción paso 1' },
            { url: '', alt: 'Paso 2', caption: 'Descripción paso 2' },
            { url: '', alt: 'Paso 3', caption: 'Descripción paso 3' },
          ],
          columns: 3,
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Conclusión',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Resumen de lo aprendido y próximos pasos.',
        },
      },
    ],
  },

  // Template 6: Review de Producto
  {
    id: 'review-producto',
    nombre: 'Review de Producto',
    descripcion: 'Análisis detallado de un producto o servicio',
    categoria: 'review',
    thumbnail: '⭐',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Review: [Nombre del Producto]',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Análisis completo de [producto]. Después de [X tiempo] de uso, aquí está mi opinión honesta.',
        },
      },
      {
        id: generateBlockId(),
        type: 'image',
        data: {
          url: '',
          alt: 'Imagen del producto',
          caption: '',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'success',
          title: '⭐ Puntuación General',
          description: '8.5/10 - Excelente producto con algunas áreas de mejora.',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Pros',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'ul',
          content: '<li>Fácil de usar</li><li>Excelente rendimiento</li><li>Buen precio</li><li>Soporte técnico rápido</li>',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Contras',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'ul',
          content: '<li>Curva de aprendizaje inicial</li><li>Falta algunas características avanzadas</li><li>Documentación mejorable</li>',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Características Principales',
        },
      },
      {
        id: generateBlockId(),
        type: 'tabs',
        data: {
          tabs: [
            {
              id: generateBlockId(),
              label: 'Diseño',
              content: '<p>Análisis del diseño y experiencia de usuario.</p>',
            },
            {
              id: generateBlockId(),
              label: 'Rendimiento',
              content: '<p>Pruebas de velocidad y eficiencia.</p>',
            },
            {
              id: generateBlockId(),
              label: 'Precio',
              content: '<p>Análisis de relación calidad-precio.</p>',
            },
            {
              id: generateBlockId(),
              label: 'Soporte',
              content: '<p>Experiencia con el servicio al cliente.</p>',
            },
          ],
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Veredicto Final',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: '[Producto] es una excelente opción para [tipo de usuario]. Lo recomiendo especialmente si buscas [característica principal].',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'default',
          title: '¿Para quién es?',
          description: 'Ideal para: [tipo de usuario]. No recomendado para: [otro tipo de usuario].',
        },
      },
    ],
  },

  // Template 7: Caso de Estudio
  {
    id: 'caso-de-estudio',
    nombre: 'Caso de Estudio',
    descripcion: 'Análisis detallado de un proyecto o implementación real',
    categoria: 'guia',
    thumbnail: 'file-check',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Caso de Estudio: [Nombre del Proyecto]',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Análisis completo de cómo [empresa/persona] logró [resultado] usando [herramienta/método].',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'default',
          title: 'Resumen Ejecutivo',
          description: 'Resultado: [X% mejora]. Tiempo: [X meses]. Inversión: [X]. ROI: [X%]',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'El Desafío',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Descripción del problema o desafío que enfrentaba el cliente antes de la solución.',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'La Solución',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Explicación detallada de la solución implementada y por qué se eligió este enfoque.',
        },
      },
      {
        id: generateBlockId(),
        type: 'tabs',
        data: {
          tabs: [
            {
              id: generateBlockId(),
              label: 'Fase 1',
              content: '<p>Descripción de la primera fase de implementación.</p>',
            },
            {
              id: generateBlockId(),
              label: 'Fase 2',
              content: '<p>Descripción de la segunda fase.</p>',
            },
            {
              id: generateBlockId(),
              label: 'Fase 3',
              content: '<p>Descripción de la fase final.</p>',
            },
          ],
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Resultados',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'success',
          title: 'Métricas Clave',
          description: 'Aumento del X% en conversiones. Reducción del X% en costos. Mejora del X% en satisfacción.',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Lecciones Aprendidas',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'ul',
          content: '<li>Lección 1: Descripción</li><li>Lección 2: Descripción</li><li>Lección 3: Descripción</li>',
        },
      },
    ],
  },

  // Template 8: FAQ (Preguntas Frecuentes)
  {
    id: 'faq-preguntas-frecuentes',
    nombre: 'FAQ - Preguntas Frecuentes',
    descripcion: 'Lista de preguntas y respuestas comunes',
    categoria: 'guia',
    thumbnail: 'lightbulb',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Preguntas Frecuentes sobre [Tema]',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Encuentra respuestas a las preguntas más comunes sobre [tema]. Si no encuentras lo que buscas, contáctanos.',
        },
      },
      {
        id: generateBlockId(),
        type: 'accordion',
        data: {
          items: [
            {
              id: generateBlockId(),
              title: '¿Qué es [concepto]?',
              content: '<p>Explicación clara y concisa del concepto.</p>',
            },
            {
              id: generateBlockId(),
              title: '¿Cómo funciona [proceso]?',
              content: '<p>Descripción paso a paso del proceso.</p>',
            },
            {
              id: generateBlockId(),
              title: '¿Cuánto cuesta [servicio/producto]?',
              content: '<p>Información sobre precios y planes disponibles.</p>',
            },
            {
              id: generateBlockId(),
              title: '¿Necesito conocimientos previos?',
              content: '<p>Requisitos y nivel de experiencia necesario.</p>',
            },
            {
              id: generateBlockId(),
              title: '¿Cuánto tiempo toma [acción]?',
              content: '<p>Estimación de tiempo y factores que lo afectan.</p>',
            },
            {
              id: generateBlockId(),
              title: '¿Es compatible con [plataforma]?',
              content: '<p>Información sobre compatibilidad y requisitos técnicos.</p>',
            },
            {
              id: generateBlockId(),
              title: '¿Ofrecen soporte técnico?',
              content: '<p>Detalles sobre el soporte disponible y cómo acceder a él.</p>',
            },
            {
              id: generateBlockId(),
              title: '¿Puedo cancelar en cualquier momento?',
              content: '<p>Política de cancelación y reembolsos.</p>',
            },
          ],
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'default',
          title: '¿No encontraste tu respuesta?',
          description: 'Contáctanos y estaremos encantados de ayudarte.',
        },
      },
    ],
  },

  // Template 9: Recursos y Herramientas
  {
    id: 'recursos-herramientas',
    nombre: 'Recursos y Herramientas',
    descripcion: 'Colección curada de recursos útiles',
    categoria: 'lista',
    thumbnail: 'list',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Recursos y Herramientas para [Tema]',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Una colección curada de las mejores herramientas y recursos para [tema]. Actualizado regularmente.',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Herramientas Esenciales',
        },
      },
      {
        id: generateBlockId(),
        type: 'programs-grid',
        data: {
          programIds: [],
          columns: 3,
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Recursos de Aprendizaje',
        },
      },
      {
        id: generateBlockId(),
        type: 'accordion',
        data: {
          items: [
            {
              id: generateBlockId(),
              title: 'Documentación Oficial',
              content: '<p>Enlaces a la documentación oficial y guías de inicio.</p>',
            },
            {
              id: generateBlockId(),
              title: 'Tutoriales en Video',
              content: '<p>Canales de YouTube y cursos recomendados.</p>',
            },
            {
              id: generateBlockId(),
              title: 'Blogs y Artículos',
              content: '<p>Los mejores blogs para mantenerse actualizado.</p>',
            },
            {
              id: generateBlockId(),
              title: 'Comunidades',
              content: '<p>Foros, Discord, Slack y otras comunidades activas.</p>',
            },
          ],
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Plantillas y Ejemplos',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Plantillas listas para usar y ejemplos de proyectos reales.',
        },
      },
    ],
  },

  // Template 10: Changelog / Novedades
  {
    id: 'changelog-novedades',
    nombre: 'Changelog / Novedades',
    descripcion: 'Anuncio de nuevas funcionalidades y actualizaciones',
    categoria: 'showcase',
    thumbnail: 'newspaper',
    bloques: [
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h1',
          content: 'Novedades - [Versión X.X]',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Estamos emocionados de anunciar las nuevas funcionalidades y mejoras de esta versión.',
        },
      },
      {
        id: generateBlockId(),
        type: 'alert',
        data: {
          variant: 'success',
          title: 'Versión X.X ya disponible',
          description: 'Actualiza ahora para disfrutar de todas las nuevas funcionalidades.',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Nuevas Funcionalidades',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'ul',
          content: '<li><strong>Funcionalidad 1:</strong> Descripción de la nueva funcionalidad</li><li><strong>Funcionalidad 2:</strong> Descripción</li><li><strong>Funcionalidad 3:</strong> Descripción</li>',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Mejoras',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'ul',
          content: '<li>Mejora en el rendimiento del X%</li><li>Interfaz más intuitiva</li><li>Mejor experiencia en mobile</li>',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Correcciones',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'ul',
          content: '<li>Corregido bug en [funcionalidad]</li><li>Solucionado problema con [característica]</li><li>Mejorada estabilidad general</li>',
        },
      },
      {
        id: generateBlockId(),
        type: 'separator',
        data: {
          style: 'solid',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'h2',
          content: 'Próximamente',
        },
      },
      {
        id: generateBlockId(),
        type: 'text',
        data: {
          format: 'paragraph',
          content: 'Estamos trabajando en nuevas funcionalidades que llegarán pronto...',
        },
      },
    ],
  },
];

// Función para obtener un template por ID
export function getTemplateById(id: string): BlogTemplate | undefined {
  return PREDEFINED_TEMPLATES.find(t => t.id === id);
}

// Función para obtener templates por categoría
export function getTemplatesByCategory(categoria: BlogTemplate['categoria']): BlogTemplate[] {
  return PREDEFINED_TEMPLATES.filter(t => t.categoria === categoria);
}

// Función para clonar un template con nuevos IDs
export function cloneTemplate(template: BlogTemplate): Block[] {
  return template.bloques.map(block => ({
    ...block,
    id: generateBlockId(),
  }));
}
