const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary').v2;
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath, folder) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, { folder: folder });
    return res.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};

const tools = [
  {
    nombre: "UI Playbook",
    slug: "ui-playbook",
    web_oficial_url: "https://uiplaybook.dev/",
    descripcion_corta: "Colección documentada de patrones y componentes de interfaz de usuario para inspirar tus diseños.",
    descripcion_larga: "<p>UI Playbook es una biblioteca exhaustiva de patrones de diseño UI, diseccionando componentes comunes (botones, modales, navegaciones) para entender sus mejores prácticas.</p><ul><li><strong>Patrones reales:</strong> Analiza cómo se construyen interfaces efectivas.</li><li><strong>Buenas prácticas:</strong> Detalla el por qué detrás de cada decisión de diseño.</li></ul>",
    dificultad: "Principiante",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "inspiracion-y-referencias-galerias-de-ui-ux-apps",
    categoria_id: 15,
    usos: ["Inspiración UI", "Estudio de componentes", "Creación de Design Systems"]
  },
  {
    nombre: "Projects by IF Catalogue",
    slug: "projects-by-if-catalogue",
    web_oficial_url: "https://catalogue.projectsbyif.com/",
    descripcion_corta: "Catálogo de patrones de diseño centrados en la confianza, privacidad y uso de datos.",
    descripcion_larga: "<p>Projects by IF ofrece un catálogo único enfocado en cómo diseñar interfaces que manejan permisos, datos de usuarios y privacidad de forma ética y clara.</p><ul><li><strong>Privacidad por diseño:</strong> Patrones para consentimientos y términos de uso.</li><li><strong>Transparencia:</strong> Ejemplos de cómo mostrar el uso de datos.</li></ul>",
    dificultad: "Intermedio",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "research",
    categoria_id: 80,
    usos: ["Diseño de privacidad", "Flujos de onboarding", "Manejo de consentimientos"]
  },
  {
    nombre: "UX Snaps",
    slug: "ux-snaps",
    web_oficial_url: "https://www.uxsnaps.com/",
    descripcion_corta: "Librería de capturas de pantalla de flujos de UX de aplicaciones móviles reales.",
    descripcion_larga: "<p>UX Snaps recopila flujos completos de aplicaciones populares para que puedas analizar cómo resuelven problemas de UX complejos paso a paso.</p><ul><li><strong>Flujos completos:</strong> Desde onboarding hasta checkout.</li><li><strong>Apps reales:</strong> Inspiración basada en productos probados en el mercado.</li></ul>",
    dificultad: "Principiante",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "inspiracion-y-referencias-galerias-de-ui-ux-apps",
    categoria_id: 15,
    usos: ["Benchmarking", "Análisis de UX", "Inspiración móvil"]
  },
  {
    nombre: "Design Spells",
    slug: "design-spells",
    web_oficial_url: "https://www.designspells.com/",
    descripcion_corta: "Colección de micro-interacciones y detalles de diseño que hacen que el software se sienta mágico.",
    descripcion_larga: "<p>Design Spells destaca esos pequeños detalles (animaciones, estados hover, respuestas sutiles) que elevan un producto de bueno a excelente.</p><ul><li><strong>Magia visual:</strong> Animaciones que deleitan al usuario.</li><li><strong>Atención al detalle:</strong> Recopilación de los mejores micro-momentos de la web.</li></ul>",
    dificultad: "Intermedio",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "inspiracion-y-referencias-galerias-de-ui-ux-apps",
    categoria_id: 15,
    usos: ["Inspiración de animaciones", "Micro-interacciones", "Pulido de UI"]
  },
  {
    nombre: "A/B Test Design",
    slug: "abtest-design",
    web_oficial_url: "https://abtest.design/",
    descripcion_corta: "Casos de estudio reales de tests A/B en diseño web para entender qué convierte mejor.",
    descripcion_larga: "<p>A/B Test Design muestra ejemplos reales de experimentos de diseño y sus resultados, ayudándote a tomar decisiones basadas en datos y conversiones reales.</p><ul><li><strong>Basado en datos:</strong> Aprende qué funciona con evidencia.</li><li><strong>Optimización:</strong> Mejora el CRO de tus interfaces.</li></ul>",
    dificultad: "Avanzado",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "research",
    categoria_id: 80,
    usos: ["CRO", "Testing A/B", "Optimización de conversiones"]
  },
  {
    nombre: "60fps Design",
    slug: "60fps-design",
    web_oficial_url: "https://60fps.design/",
    descripcion_corta: "Inspiración de animaciones fluidas e interacciones web de alto rendimiento.",
    descripcion_larga: "<p>Un escaparate de sitios web e interacciones que destacan por su rendimiento y animaciones a 60 cuadros por segundo, ideal para desarrolladores creativos.</p><ul><li><strong>Rendimiento:</strong> Interfaces súper fluidas.</li><li><strong>Creatividad técnica:</strong> Ejemplos de WebGL y animaciones CSS avanzadas.</li></ul>",
    dificultad: "Avanzado",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "inspiracion-y-referencias-galerias-de-diseo-web",
    categoria_id: 14,
    usos: ["Inspiración de animaciones", "Desarrollo frontend creativo", "Referencias WebGL"]
  },
  {
    nombre: "Binary Studio Tools",
    slug: "binary-studio-tools",
    web_oficial_url: "https://herramientas.binarystudio.com.ar/",
    descripcion_corta: "Colección de herramientas útiles creadas por Binary Studio.",
    descripcion_larga: "<p>Un hub de utilidades prácticas que incluye conversores, calculadoras y generadores orientados a facilitar el día a día de perfiles técnicos y creativos.</p><ul><li><strong>Utilidades variadas:</strong> Herramientas rápidas y sin fricción.</li><li><strong>Enfoque local:</strong> Creado por un estudio para resolver problemas comunes del flujo de trabajo.</li></ul>",
    dificultad: "Principiante",
    es_open_source: false,
    es_recomendado: true,
    categoria_slug: "utilidades-de-apoyo",
    categoria_id: 20,
    usos: ["Utilidades rápidas", "Cálculos diarios", "Herramientas web"]
  },
  {
    nombre: "MockuPhone",
    slug: "mockuphone",
    web_oficial_url: "https://mockuphone.com/",
    descripcion_corta: "Generador de mockups gratuitos envolviendo tus diseños en dispositivos reales.",
    descripcion_larga: "<p>MockuPhone es una herramienta sencilla de un solo clic que envuelve tus capturas de pantalla de apps en imágenes de dispositivos (iOS, Android, Desktop) de alta calidad.</p><ul><li><strong>Variedad de dispositivos:</strong> Desde los últimos iPhones hasta monitores.</li><li><strong>Formatos transparentes:</strong> Descarga en PNG con fondo transparente.</li></ul>",
    dificultad: "Principiante",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "programas-de-diseo-generacion-de-mockups",
    categoria_id: 41,
    usos: ["Presentación de portafolios", "Materiales de marketing", "Mockups rápidos"]
  },
  {
    nombre: "CleanSnap",
    slug: "cleansnap",
    web_oficial_url: "https://www.cleansnap.co/",
    descripcion_corta: "Crea capturas de pantalla hermosas y limpias para redes sociales y presentaciones.",
    descripcion_larga: "<p>CleanSnap permite embellecer tus capturas de pantalla agregando fondos de gradientes, sombras, bordes redondeados y marcos de navegador con unos pocos clics.</p><ul><li><strong>Fondos personalizables:</strong> Gradientes y colores sólidos.</li><li><strong>Marcos:</strong> macOS, Windows y navegadores web.</li></ul>",
    dificultad: "Principiante",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "programas-de-diseo-generacion-de-mockups",
    categoria_id: 41,
    usos: ["Redes sociales", "Presentación de proyectos", "Imágenes para blogs"]
  },
  {
    nombre: "MockupViews",
    slug: "mockupviews",
    web_oficial_url: "https://mockupviews.com/",
    descripcion_corta: "Crea mockups 3D de dispositivos de alta calidad directamente en tu navegador.",
    descripcion_larga: "<p>MockupViews es un creador de escenas para mostrar tus diseños en entornos 3D hiperrealistas sin necesidad de utilizar software como Photoshop.</p><ul><li><strong>Escenas 3D:</strong> Ajusta ángulos y luces fácilmente.</li><li><strong>Directo en el navegador:</strong> Sin descargas de plantillas pesadas.</li></ul>",
    dificultad: "Intermedio",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "programas-de-diseo-generacion-de-mockups",
    categoria_id: 41,
    usos: ["Mockups 3D", "Dribbble & Behance", "Landing pages"]
  },
  {
    nombre: "PostSpark",
    slug: "postspark",
    web_oficial_url: "https://postspark.app/",
    descripcion_corta: "Herramienta para diseñar y automatizar imágenes para posts en redes sociales.",
    descripcion_larga: "<p>PostSpark facilita la creación de imágenes atractivas con texto para compartir reflexiones, hilos o citas en redes sociales, optimizando el diseño para cada plataforma.</p><ul><li><strong>Plantillas optimizadas:</strong> Diseños probados para el engagement.</li><li><strong>Exportación rápida:</strong> Tamaños correctos para cada red.</li></ul>",
    dificultad: "Principiante",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "programas-de-diseo-diseo-rapido-y-para-marketing",
    categoria_id: 43,
    usos: ["Gestión de redes sociales", "Marketing de contenidos", "Personal branding"]
  },
  {
    nombre: "GrainRad",
    slug: "grainrad",
    web_oficial_url: "https://grainrad.com/",
    descripcion_corta: "Generador de texturas de ruido y gradientes granulosos para diseño web y gráfico.",
    descripcion_larga: "<p>GrainRad te permite generar fondos con texturas de grano y gradientes fluidos exportables en CSS o como imagen, dándole un toque orgánico y moderno a tus diseños.</p><ul><li><strong>Texturas orgánicas:</strong> Crea efectos de ruido visual fácilmente.</li><li><strong>Exportación CSS/SVG:</strong> Implementación directa en código.</li></ul>",
    dificultad: "Principiante",
    es_open_source: false,
    es_recomendado: false,
    categoria_slug: "utilidades-de-apoyo",
    categoria_id: 20,
    usos: ["Fondos web", "Diseño gráfico", "Efectos visuales UI"]
  }
];

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });

  for (let tool of tools) {
    console.log(`\nProcesando: ${tool.nombre}`);
    
    // Check if exists
    const { data: existing } = await supabase
      .from('programas')
      .select('id')
      .eq('web_oficial_url', tool.web_oficial_url)
      .single();

    if (existing) {
      console.log(`⚠️  ${tool.nombre} ya existe en BD. Saltando...`);
      continue;
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const screenshotPath = `./temp_${tool.slug}.png`;
    const iconPath = `./temp_icon_${tool.slug}.png`;
    let faviconUrl = '';

    try {
      console.log(`Navegando a ${tool.web_oficial_url}...`);
      await page.goto(tool.web_oficial_url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for animations
      await new Promise(r => setTimeout(r, 4000));
      
      await page.screenshot({ path: screenshotPath });
      console.log(`✅ Captura tomada.`);

      faviconUrl = await page.evaluate(() => {
        let icon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
        if (icon) return icon.href;
        return new URL('/favicon.ico', document.baseURI).href;
      });

    } catch (e) {
      console.log(`❌ Error procesando puppeteer para ${tool.nombre}: ${e.message}`);
    } finally {
      await page.close();
    }

    let captura_url = null;
    let icono_url = null;

    if (fs.existsSync(screenshotPath)) {
      console.log(`Subiendo captura a Cloudinary...`);
      captura_url = await uploadToCloudinary(screenshotPath, 'programas/screenshots');
      fs.unlinkSync(screenshotPath);
    }

    if (faviconUrl) {
      try {
        console.log(`Obteniendo favicon desde: ${faviconUrl}`);
        const response = await fetch(faviconUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          fs.writeFileSync(iconPath, Buffer.from(buffer));
          icono_url = await uploadToCloudinary(iconPath, 'programas/icons');
          fs.unlinkSync(iconPath);
        }
      } catch (e) {
        console.log(`❌ Error con el favicon de ${tool.nombre}: ${e.message}`);
      }
    }

    console.log(`Guardando en Supabase...`);
    const finalData = {
      ...tool,
      captura_url,
      icono_url,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('programas').insert([finalData]);
    if (error) {
      console.log(`❌ Error guardando en Supabase: ${error.message}`);
    } else {
      console.log(`✅ Guardado con éxito en BD.`);
    }
  }

  await browser.close();
  console.log('\n🚀 Proceso completado.');
}

run();