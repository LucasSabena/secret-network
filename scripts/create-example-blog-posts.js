// Script para crear los 2 posts de blog de ejemplo
// Ejecutar con: node scripts/create-example-blog-posts.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Usar Service Role Key para bypassear RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const post1_404 = {
  titulo: '¿Perdido? Estas 30 Páginas 404 Te Harán Feliz de Equivocarte',
  slug: 'mejores-paginas-404-creatividad-diseno',
  descripcion_corta: 'Una página 404 no tiene por qué ser aburrida. Descubre 30 ejemplos creativos que convierten errores en experiencias memorables.',
  contenido: '', // Columna legacy (requerida por NOT NULL)
  imagen_portada_url: null, // Usuario agregará después
  autor: 'Secret Network',
  publicado: true,
  tags: ['diseño web', 'UX', 'inspiración', 'páginas 404', 'creatividad'],
  contenido_bloques: [
    {
      id: 'block-intro-1',
      type: 'text',
      data: {
        format: 'paragraph',
        content: 'La página 404 es, por definición, un error. Un callejón sin salida digital. Tu usuario ha hecho clic en un enlace roto o ha tecleado mal una URL, y ha aterrizado en la nada. Para muchas webs, es una pantalla blanca con un texto técnico y aburrido: "404 Not Found". Una oportunidad perdida.'
      }
    },
    {
      id: 'block-intro-2',
      type: 'text',
      data: {
        format: 'paragraph',
        content: 'Pero para los mejores diseñadores, una página 404 no es un error; es un lienzo en blanco. Es una oportunidad única para sorprender, deleitar, ayudar y reforzar la personalidad de una marca. Es el momento de convertir la frustración de un usuario en una sonrisa.'
      }
    },
    {
      id: 'block-alert-intro',
      type: 'alert',
      data: {
        variant: 'default',
        title: '💡 Pro Tip',
        description: 'Hemos navegado por los rincones más perdidos de internet para traerte 30 de las páginas 404 más creativas, inteligentes y bellamente diseñadas. Prepárate para inspirarte, y quizás, para desear perderte más a menudo.'
      }
    },
    {
      id: 'block-h2-1',
      type: 'text',
      data: {
        format: 'h2',
        content: '1. Figma: El Error Colaborativo'
      }
    },
    {
      id: 'block-figma-desc',
      type: 'text',
      data: {
        format: 'paragraph',
        content: 'Figma lleva su espíritu colaborativo hasta el final. Su página 404 muestra los tiradores de un vector rotos, una metáfora visual que cualquier diseñador entiende al instante. Es una forma brillante de decir "algo no está conectado" usando su propio lenguaje de producto.'
      }
    },
    {
      id: 'block-img-figma',
      type: 'image',
      data: {
        url: '',
        alt: 'Captura de pantalla de la página 404 de Figma, mostrando los tiradores de un vector rotos',
        caption: 'La página 404 de Figma usa su propio lenguaje visual'
      }
    },
    {
      id: 'block-h2-2',
      type: 'text',
      data: {
        format: 'h2',
        content: '2. Dribbble: Un Mosaico de Fracaso Creativo'
      }
    },
    {
      id: 'block-dribbble-desc',
      type: 'text',
      data: {
        format: 'paragraph',
        content: 'Dribbble, la meca de la inspiración visual, te presenta una cuadrícula de diseños. El truco es que si haces clic en cualquier color de la paleta "404", te muestra proyectos reales de otros diseñadores que coinciden con ese color. Convierte un error en una nueva vía de descubrimiento. ¡Genial!'
      }
    },
    {
      id: 'block-img-dribbble',
      type: 'image',
      data: {
        url: '',
        alt: 'Captura de pantalla de la página 404 de Dribbble, con su paleta de colores interactiva',
        caption: 'Dribbble convierte su 404 en una herramienta de descubrimiento'
      }
    },
    {
      id: 'block-tabs-ejemplos',
      type: 'tabs',
      data: {
        tabs: [
          {
            id: 'tab-humor',
            label: 'Con Humor',
            content: '<p><strong>GitHub:</strong> "These aren\'t the droids you\'re looking for" - Una parodia de Star Wars con Octocat vestido de Jedi.</p><p><strong>Mailchimp:</strong> Un caballo-simio mirando por prismáticos en medio del follaje. Absurdo y memorable.</p>'
          },
          {
            id: 'tab-personajes',
            label: 'Con Personajes',
            content: '<p><strong>Pixar:</strong> Tristeza de "Intensamente" representando la decepción perfectamente.</p><p><strong>Marvel:</strong> Ojo de Halcón confundido o el Agente Coulson con diferentes mensajes.</p>'
          },
          {
            id: 'tab-interactivo',
            label: 'Interactivas',
            content: '<p><strong>Kualo:</strong> Un juego completo de Space Invaders personalizado.</p><p><strong>Framer:</strong> Un laberinto 3D que puedes explorar con las flechas del teclado.</p>'
          }
        ]
      }
    },
    {
      id: 'block-h2-tools',
      type: 'text',
      data: {
        format: 'h2',
        content: 'Herramientas para Crear Tu Propia 404'
      }
    },
    {
      id: 'block-accordion-tools',
      type: 'accordion',
      data: {
        items: [
          {
            id: 'acc-design',
            title: '🎨 Diseño e Ilustración',
            content: '<p>Usa herramientas como <strong>Figma</strong> para diseñar tu página 404. Puedes crear ilustraciones personalizadas con <strong>Adobe Illustrator</strong> o buscar assets en <strong>Unsplash</strong> y <strong>unDraw</strong>.</p>'
          },
          {
            id: 'acc-animation',
            title: '✨ Animaciones',
            content: '<p>Agrega movimiento con <strong>Lottie Files</strong> o <strong>GSAP</strong>. Las microinteracciones pueden transformar una página estática en una experiencia memorable.</p>'
          },
          {
            id: 'acc-code',
            title: '💻 Implementación',
            content: '<p>Frameworks como <strong>Next.js</strong> o <strong>Astro</strong> facilitan la creación de páginas 404 personalizadas. No olvides incluir enlaces a tu home y un buscador.</p>'
          }
        ]
      }
    },
    {
      id: 'block-code-example',
      type: 'code',
      data: {
        language: 'tsx',
        code: `// Ejemplo de página 404 en Next.js
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl mt-4">¡Ups! Página no encontrada</p>
        <Link href="/" className="mt-8 btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}`
      }
    },
    {
      id: 'block-alert-tip',
      type: 'alert',
      data: {
        variant: 'success',
        title: '✅ Checklist de una Buena 404',
        description: 'Reconocer el error claramente • Mantener la identidad de marca • Ofrecer navegación alternativa • Incluir un buscador • Agregar un toque de humor o personalidad'
      }
    },
    {
      id: 'block-separator-1',
      type: 'separator',
      data: {
        style: 'dashed'
      }
    },
    {
      id: 'block-h2-conclusion',
      type: 'text',
      data: {
        format: 'h2',
        content: '¿Buscas Más Inspiración?'
      }
    },
    {
      id: 'block-conclusion',
      type: 'text',
      data: {
        format: 'paragraph',
        content: 'La creatividad no surge en el vacío. Para diseñar grandes experiencias, necesitas consumir grandes experiencias. Si te has quedado con ganas de más, sumérgete en estas galerías de inspiración, donde encontrarás no solo páginas 404, sino miles de ejemplos de diseño web de vanguardia.'
      }
    }
  ]
};

const post2_ia = {
  titulo: '¿Diseñador Web? La IA es el Copiloto que No Sabías que Necesitabas',
  slug: 'ia-herramientas-disenadores-web-workflow',
  descripcion_corta: 'Descubre cómo la IA puede transformar tu flujo de trabajo de diseño web: desde el primer boceto hasta el código final en producción.',
  contenido: '', // Columna legacy (requerida por NOT NULL)
  imagen_portada_url: null,
  autor: 'Secret Network',
  publicado: true,
  tags: ['IA', 'diseño web', 'herramientas', 'productividad', 'desarrollo'],
  contenido_bloques: [
    {
      id: 'intro-1',
      type: 'text',
      data: {
        format: 'paragraph',
        content: 'Como diseñador web, vives en una carrera constante contra el reloj. Los clientes quieren resultados impresionantes para ayer, el código tiene que ser perfecto y la brecha entre tu diseño pixel-perfect en Figma y el sitio web en producción a veces parece un abismo insondable.'
      }
    },
    {
      id: 'intro-2',
      type: 'text',
      data: {
        format: 'paragraph',
        content: '¿Y si te dijera que tienes un nuevo miembro en tu equipo? Uno que no duerme, no pide café y está entrenado con el conocimiento colectivo de internet. Hablamos de la Inteligencia Artificial.'
      }
    },
    {
      id: 'alert-warning',
      type: 'alert',
      data: {
        variant: 'warning',
        title: '⚠️ Importante',
        description: 'La IA no viene a robarte el trabajo. Viene a ser tu copiloto, tu asistente, la herramienta que se encargará de las tareas tediosas para que tú puedas centrarte en lo que mejor sabes hacer: crear experiencias increíbles.'
      }
    },
    {
      id: 'h2-vibe',
      type: 'text',
      data: {
        format: 'h2',
        content: 'La Revolución del "Vibe Coding": De la Idea al Prototipo en Minutos'
      }
    },
    {
      id: 'vibe-desc',
      type: 'text',
      data: {
        format: 'paragraph',
        content: 'Imagina esto: en lugar de empezar con un lienzo en blanco en Figma, abres una herramienta, describes con tus propias palabras la interfaz que tienes en mente y, en segundos, la IA te presenta un componente funcional y bien diseñado.'
      }
    },
    {
      id: 'img-v0',
      type: 'image',
      data: {
        url: '',
        alt: 'Captura de pantalla de la interfaz de v0.dev mostrando un prompt de texto y el componente UI generado',
        caption: 'v0.dev convierte prompts en componentes React funcionales'
      }
    },
    {
      id: 'code-example-prompt',
      type: 'code',
      data: {
        language: 'typescript',
        code: `// Ejemplo de prompt para v0.dev
"Crea una sección de precios con tres planes: 
Básico, Pro y Empresa. El plan Pro debe estar 
destacado con un badge de 'Más popular'."

// v0 genera código React + Tailwind + shadcn/ui
// listo para copiar y pegar en tu proyecto`
      }
    },
    {
      id: 'tabs-tools',
      type: 'tabs',
      data: {
        tabs: [
          {
            id: 'tab-v0',
            label: 'v0.dev',
            content: '<p><strong>v0.dev</strong> es perfecto para generar componentes React con shadcn/ui y Tailwind. Ideal para crear secciones hero, pricing, testimonios y más.</p><p>✅ Genera código limpio<br>✅ Múltiples variaciones<br>✅ Integración con Next.js</p>'
          },
          {
            id: 'tab-anima',
            label: 'Anima',
            content: '<p><strong>Anima</strong> convierte tus diseños de Figma/Sketch en código HTML, React o Vue. Añade interacciones y responsividad directamente desde tu herramienta de diseño.</p><p>✅ Plugin para Figma<br>✅ Export a React/Vue<br>✅ Prototipos de alta fidelidad</p>'
          },
          {
            id: 'tab-cursor',
            label: 'Cursor',
            content: '<p><strong>Cursor</strong> es un editor de código con IA integrada. Chatea con tu proyecto, genera código, refactoriza y depura errores con asistencia de IA.</p><p>✅ Fork de VS Code<br>✅ IA contextual<br>✅ Debugging inteligente</p>'
          }
        ]
      }
    },
    {
      id: 'h2-workflow',
      type: 'text',
      data: {
        format: 'h2',
        content: 'Un Flujo de Trabajo Real: Poniendo Todo Junto'
      }
    },
    {
      id: 'accordion-workflow',
      type: 'accordion',
      data: {
        items: [
          {
            id: 'step-1',
            title: '1️⃣ Ideación (15 minutos)',
            content: '<p>Usas <strong>v0.dev</strong> para generar los componentes clave de tu landing page (hero, tabla de precios, testimonios). Obtienes múltiples variaciones y seleccionas la que más te gusta.</p>'
          },
          {
            id: 'step-2',
            title: '2️⃣ Diseño y Refinamiento (Horas)',
            content: '<p>Importas los conceptos a <strong>Figma</strong> o <strong>Penpot</strong>. Aquí aplicas tu magia: ajustas la tipografía, perfeccionas la paleta de colores y creas la composición final.</p>'
          },
          {
            id: 'step-3',
            title: '3️⃣ Prototipo y Exportación (30 minutos)',
            content: '<p>Usas <strong>Anima</strong> para añadir las animaciones de scroll y las transiciones de los botones. Exportas la sección del hero como un componente de React.</p>'
          },
          {
            id: 'step-4',
            title: '4️⃣ Desarrollo (Horas en lugar de Días)',
            content: '<p>El desarrollador toma el código de Anima, lo abre en <strong>Cursor</strong> y empieza a trabajar. Usa la IA para conectar el formulario de contacto, optimizar el rendimiento y asegurarse de que todo sea perfectamente responsivo.</p>'
          }
        ]
      }
    },
    {
      id: 'img-workflow',
      type: 'image',
      data: {
        url: '',
        alt: 'Diagrama de flujo mostrando el workflow: v0 -> Figma -> Anima -> Cursor',
        caption: 'Flujo de trabajo moderno con IA: de la idea al código en tiempo récord'
      }
    },
    {
      id: 'separator-1',
      type: 'separator',
      data: {
        style: 'solid'
      }
    },
    {
      id: 'h2-conclusion',
      type: 'text',
      data: {
        format: 'h2',
        content: 'Conclusión: Adopta a tu Copiloto'
      }
    },
    {
      id: 'conclusion',
      type: 'text',
      data: {
        format: 'paragraph',
        content: 'La inteligencia artificial no es una amenaza para los buenos diseñadores. Es una palanca. Es la herramienta que te permitirá ejecutar tus ideas más rápido, eliminar las partes aburridas de tu trabajo y cerrar la dolorosa brecha que siempre ha existido entre el diseño y el código.'
      }
    },
    {
      id: 'alert-cta',
      type: 'alert',
      data: {
        variant: 'success',
        title: '🚀 Próximos Pasos',
        description: 'Explora v0.dev, Anima y Cursor en nuestro directorio y descubre más herramientas que cambiarán tu forma de trabajar. El futuro del diseño web no es sobre si usarás IA, sino sobre cómo la usarás para potenciar tu creatividad.'
      }
    }
  ]
};

async function createPosts() {
  try {
    console.log('🚀 Creando posts de ejemplo...\n');

    // Post 1: 30 Páginas 404
    console.log('📝 Creando: "30 Páginas 404 Increíbles"...');
    const { data: post1, error: error1 } = await supabase
      .from('blog_posts')
      .insert([post1_404])
      .select()
      .single();

    if (error1) {
      console.error('❌ Error creando post 1:', error1.message);
    } else {
      console.log('✅ Post 1 creado:', post1.titulo);
      console.log(`   URL: /blog/${post1.slug}\n`);
    }

    // Post 2: IA para Diseñadores
    console.log('📝 Creando: "IA para Diseñadores Web"...');
    const { data: post2, error: error2 } = await supabase
      .from('blog_posts')
      .insert([post2_ia])
      .select()
      .single();

    if (error2) {
      console.error('❌ Error creando post 2:', error2.message);
    } else {
      console.log('✅ Post 2 creado:', post2.titulo);
      console.log(`   URL: /blog/${post2.slug}\n`);
    }

    console.log('🎉 ¡Posts creados exitosamente!');
    console.log('\n📌 Próximos pasos:');
    console.log('1. Ve a /admin y edita ambos posts');
    console.log('2. Agrega las imágenes de portada');
    console.log('3. Completa los bloques de imagen con URLs reales');
    console.log('4. ¡Publica y comparte!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createPosts();
