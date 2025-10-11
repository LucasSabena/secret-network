// FILE: scripts/create-blog-posts.js

/**
 * Script para crear posts de blog de prueba en Supabase
 * Ejecutar con: node scripts/create-blog-posts.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Inicializar cliente de Supabase con service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const blogPosts = [
  {
    titulo: "El Renacimiento del Diseño Open Source",
    slug: "renacimiento-diseno-open-source",
    descripcion_corta: "Descubre por qué el diseño open source está transformando la industria creativa y democratizando el acceso a herramientas profesionales.",
    contenido: `
<p>El mundo del diseño está experimentando una revolución silenciosa. El software open source, que alguna vez fue visto como una alternativa de menor calidad, ahora rivaliza e incluso supera a muchas soluciones comerciales.</p>

<h2>¿Qué está impulsando este cambio?</h2>

<p>Varios factores han contribuido al auge del diseño open source:</p>

<ul>
  <li><strong>Comunidades vibrantes:</strong> Miles de desarrolladores y diseñadores contribuyen activamente a proyectos open source.</li>
  <li><strong>Transparencia total:</strong> El código abierto garantiza que no hay "cajas negras" en tu flujo de trabajo.</li>
  <li><strong>Personalización ilimitada:</strong> Puedes adaptar las herramientas a tus necesidades específicas.</li>
  <li><strong>Costo cero:</strong> Sin suscripciones mensuales ni licencias costosas.</li>
</ul>

<h2>Herramientas que están marcando la diferencia</h2>

<p><strong>GIMP</strong> ha evolucionado hasta convertirse en una alternativa seria a Photoshop. <strong>Inkscape</strong> ofrece capacidades de diseño vectorial comparables a Illustrator. <strong>Blender</strong> ha revolucionado el mundo del 3D con una suite completa que rivaliza con software de miles de dólares.</p>

<h2>El futuro es abierto</h2>

<p>Las grandes empresas están tomando nota. Adobe, Figma y otras están incorporando principios open source en sus flujos de trabajo. La colaboración abierta ya no es solo una filosofía, es una ventaja competitiva.</p>

<p>En Secret Network, celebramos y promovemos estas herramientas. Porque creemos que el buen diseño debe ser accesible para todos.</p>
    `,
    imagen_portada_url: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=1200&h=630&fit=crop",
    autor: "Binary Studio",
    fecha_publicacion: new Date().toISOString(),
    actualizado_en: new Date().toISOString(),
    publicado: true,
    tags: ["open-source", "diseño", "herramientas", "comunidad"]
  },
  {
    titulo: "Figma vs. Sketch: La Guerra de las Herramientas de Diseño UI",
    slug: "figma-vs-sketch-guerra-diseno-ui",
    descripcion_corta: "Una comparación profunda entre las dos herramientas más populares para diseño de interfaces. ¿Cuál es la mejor para tu equipo?",
    contenido: `
<p>La elección de una herramienta de diseño UI puede definir el éxito de tu flujo de trabajo. Figma y Sketch han dominado el mercado durante años, pero ¿cuál es realmente mejor?</p>

<h2>Figma: El Colaborador en la Nube</h2>

<p>Figma revolucionó el diseño UI al llevarlo completamente a la nube. Sus ventajas incluyen:</p>

<ul>
  <li><strong>Colaboración en tiempo real:</strong> Múltiples diseñadores pueden trabajar simultáneamente.</li>
  <li><strong>Multiplataforma:</strong> Funciona en Windows, Mac y Linux.</li>
  <li><strong>Versionado automático:</strong> Nunca pierdas tu trabajo.</li>
  <li><strong>Comentarios integrados:</strong> Feedback directo en el diseño.</li>
</ul>

<h2>Sketch: El Veterano de macOS</h2>

<p>Sketch fue pionero en el diseño UI moderno y mantiene una base de usuarios leales:</p>

<ul>
  <li><strong>Rendimiento nativo:</strong> Optimizado específicamente para macOS.</li>
  <li><strong>Ecosistema de plugins:</strong> Miles de extensiones disponibles.</li>
  <li><strong>Workflow local:</strong> Control total sobre tus archivos.</li>
  <li><strong>Precio único:</strong> Compra una vez, úsalo para siempre (con actualizaciones opcionales).</li>
</ul>

<h2>¿Cuál elegir?</h2>

<p>Si trabajas en un equipo distribuido y necesitas colaboración constante, <strong>Figma</strong> es la elección obvia. Si trabajas solo o en equipos pequeños con Mac y priorizas el rendimiento, <strong>Sketch</strong> sigue siendo excelente.</p>

<p>Lo mejor: ambas herramientas ofrecen versiones gratuitas para que las pruebes antes de comprometerte.</p>
    `,
    imagen_portada_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=630&fit=crop",
    autor: "Binary Studio",
    fecha_publicacion: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 días atrás
    actualizado_en: new Date(Date.now() - 86400000 * 3).toISOString(),
    publicado: true,
    tags: ["figma", "sketch", "ui-design", "herramientas", "comparación"]
  },
  {
    titulo: "5 Tendencias de Diseño que Dominarán 2025",
    slug: "tendencias-diseno-2025",
    descripcion_corta: "El diseño evoluciona constantemente. Estas son las tendencias que verás por todas partes en 2025 y cómo implementarlas en tus proyectos.",
    contenido: `
<p>El diseño nunca duerme. Cada año trae nuevas tendencias, y 2025 promete ser emocionante. Aquí están las 5 tendencias que dominarán el panorama del diseño.</p>

<h2>1. Neomorfismo 2.0</h2>

<p>El neomorfismo regresa, pero más refinado. Los diseñadores están combinando sombras suaves con colores vibrantes, creando interfaces que parecen tangibles sin sacrificar la usabilidad.</p>

<h2>2. Tipografía Variable Experimental</h2>

<p>Las fuentes variables permiten transiciones fluidas entre pesos y estilos. En 2025, veremos animaciones tipográficas más atrevidas y expresivas, especialmente en sitios web y aplicaciones móviles.</p>

<h2>3. Glasmorfismo Oscuro</h2>

<p>El glasmorfismo se combina con modos oscuros para crear interfaces elegantes y futuristas. Transparencias, desenfoques y contraste elevado definen esta tendencia.</p>

<h2>4. Diseño Generativo con IA</h2>

<p>Las herramientas de IA como Midjourney, DALL-E y Stable Diffusion están integrándose en flujos de trabajo profesionales. Los diseñadores ya no compiten con la IA, colaboran con ella.</p>

<h2>5. Minimalismo Cálido</h2>

<p>El minimalismo frío está siendo reemplazado por diseños limpios pero acogedores. Paletas cálidas, espacios generosos y microinteracciones sutiles crean experiencias más humanas.</p>

<h2>Implementando las Tendencias</h2>

<p>No todas las tendencias son apropiadas para todos los proyectos. La clave es entender a tu audiencia y adaptar estas tendencias a las necesidades específicas de tu marca.</p>
    `,
    imagen_portada_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&h=630&fit=crop",
    autor: "Binary Studio",
    fecha_publicacion: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 días atrás
    actualizado_en: new Date(Date.now() - 86400000 * 7).toISOString(),
    publicado: true,
    tags: ["tendencias", "2025", "diseño", "ui-ux", "minimalismo", "ia"]
  },
  {
    titulo: "Cómo Elegir la Paleta de Colores Perfecta para tu Proyecto",
    slug: "elegir-paleta-colores-perfecta",
    descripcion_corta: "Los colores pueden hacer o deshacer un diseño. Aprende a elegir combinaciones armoniosas que refuercen el mensaje de tu marca.",
    contenido: `
<p>Los colores son mucho más que estética. Comunican emociones, establecen jerarquías y pueden influir en las decisiones de los usuarios. Elegir la paleta correcta es crucial.</p>

<h2>Entendiendo la Psicología del Color</h2>

<p>Cada color evoca emociones diferentes:</p>

<ul>
  <li><strong>Azul:</strong> Confianza, profesionalismo, calma (bancos, tech)</li>
  <li><strong>Rojo:</strong> Energía, urgencia, pasión (food, retail)</li>
  <li><strong>Verde:</strong> Crecimiento, salud, naturaleza (eco, wellness)</li>
  <li><strong>Amarillo:</strong> Optimismo, creatividad, atención (entretenimiento)</li>
  <li><strong>Negro:</strong> Lujo, elegancia, sofisticación (moda, premium)</li>
</ul>

<h2>Herramientas para Crear Paletas</h2>

<p>Existen herramientas excelentes para generar paletas armoniosas:</p>

<ul>
  <li><strong>Coolors.co:</strong> Generador rápido con opciones de exportación</li>
  <li><strong>Adobe Color:</strong> Rueda cromática interactiva con reglas de armonía</li>
  <li><strong>Paletton:</strong> Esquemas complejos y previsualización en UI</li>
  <li><strong>Color Hunt:</strong> Paletas curadas por diseñadores</li>
</ul>

<h2>La Regla 60-30-10</h2>

<p>Un principio clásico del diseño de interiores que funciona perfectamente en diseño digital:</p>

<ul>
  <li><strong>60%:</strong> Color dominante (fondos, áreas grandes)</li>
  <li><strong>30%:</strong> Color secundario (secciones, cards)</li>
  <li><strong>10%:</strong> Color de acento (CTAs, highlights)</li>
</ul>

<h2>Accesibilidad es Clave</h2>

<p>Asegúrate de que tu paleta cumpla con estándares WCAG. Herramientas como <strong>WebAIM Contrast Checker</strong> te ayudan a verificar que tus combinaciones sean legibles para todos.</p>

<p>Una paleta bien pensada no solo se ve bien, funciona mejor.</p>
    `,
    imagen_portada_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=630&fit=crop",
    autor: "Binary Studio",
    fecha_publicacion: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 días atrás
    actualizado_en: new Date(Date.now() - 86400000 * 14).toISOString(),
    publicado: true,
    tags: ["colores", "paleta", "diseño", "psicología", "accesibilidad"]
  }
];

async function createBlogPosts() {
  console.log('🚀 Creando posts de blog en Supabase...\n');

  for (const post of blogPosts) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select();

      if (error) {
        console.error(`❌ Error creando "${post.titulo}":`, error.message);
      } else {
        console.log(`✅ Post creado: "${post.titulo}"`);
      }
    } catch (err) {
      console.error(`❌ Error inesperado:`, err);
    }
  }

  console.log('\n✨ Proceso completado!');
}

// Ejecutar el script
createBlogPosts();
