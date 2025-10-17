// Script para crear el blog post sobre IA
// Ejecutar con: node scripts/create-ai-blog-post.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Usar SERVICE_ROLE_KEY para bypass RLS en scripts de admin
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const contenidoHTML = `
<h2>La Revolución del "Vibe Coding": De la Idea al Prototipo en Minutos</h2>

<p>Imagina esto: en lugar de empezar con un lienzo en blanco en Figma, abres una herramienta, describes con tus propias palabras la interfaz que tienes en mente y, en segundos, la IA te presenta un componente funcional y bien diseñado.</p>

<p>Eso, en esencia, es el "Vibe Coding" o "desarrollo basado en prompts". Es la capacidad de traducir una idea, una "vibra", en un punto de partida tangible.</p>

<h3>Herramienta Estrella: v0.dev</h3>

<p><strong>v0.dev</strong>, creado por la gente de Vercel (los mismos detrás de Next.js), es el ejemplo perfecto. No es solo un generador de imágenes; genera código real en React utilizando librerías modernas y respetadas como shadcn/ui y Tailwind CSS.</p>

<p><strong>¿Cómo funciona?</strong></p>

<p>Simplemente le pides lo que necesitas:</p>

<blockquote>
  <p>"Crea una sección de precios con tres planes: Básico, Pro y Empresa. El plan Pro debe estar destacado."</p>
</blockquote>

<p>En segundos, v0 te ofrecerá varias alternativas visuales, cada una con su código listo para copiar y pegar. Es la herramienta perfecta para superar el síndrome de la página en blanco y acelerar la fase de ideación.</p>

<h2>El Puente Mágico: De Figma a Código Real sin Perderse en la Traducción</h2>

<p>El "handoff" (la entrega del diseño a los desarrolladores) es, históricamente, una de las mayores fuentes de fricción. Medidas, colores, fuentes, espaciados... es un proceso manual y propenso a errores. Aquí es donde la IA está construyendo un puente sólido.</p>

<p>Herramientas como <strong>Penpot, Figma o Sketch</strong> son fantásticas para diseñar, pero ¿cómo convertimos esos diseños estáticos en algo real?</p>

<h3>Herramienta Estrella: Anima App</h3>

<p><strong>Anima</strong> es un plugin que se integra directamente en tus herramientas de diseño favoritas (Figma, Sketch, Adobe XD) y las sobrealimenta. Permite convertir tus diseños estáticos en prototipos de alta fidelidad y, lo más importante, en código que los desarrolladores pueden usar.</p>

<p><strong>El flujo de trabajo es revolucionario:</strong></p>

<ol>
  <li>Diseñas en Figma o Penpot como siempre lo has hecho.</li>
  <li>Usas Anima para añadir interacciones, animaciones y definir cómo debe comportarse tu diseño en diferentes tamaños de pantalla (responsividad).</li>
  <li>Con un clic, Anima te permite exportar ese diseño como código HTML, React o Vue.</li>
</ol>

<p>No es un código perfecto y final, pero es una base sólida que le ahorra a tu equipo de desarrollo horas, o incluso días, de trabajo. Se acabaron las discusiones sobre si un padding es de 16px o 18px; el código lo refleja directamente desde tu diseño.</p>

<h2>Tu Compañero de Programación: Escribir Código Más Rápido e Inteligente</h2>

<p>Incluso si eres un diseñador que no escribe código, es crucial entender las herramientas que usan tus compañeros desarrolladores. Y si eres de los que se mete en el código, esto te va a cambiar la vida.</p>

<p>Los asistentes de IA para escribir código son la herramienta más transformadora para el desarrollo web desde la invención de Google.</p>

<h3>Herramienta Estrella: Cursor</h3>

<p>Imagina Visual Studio Code, el editor de código más popular del mundo, pero reconstruido desde cero con la IA en su núcleo. Eso es <strong>Cursor</strong>.</p>

<p>Mientras que Copilot de GitHub es un plugin genial para VS Code, Cursor es una experiencia totalmente integrada. Te permite:</p>

<ul>
  <li><strong>Chatear con tu proyecto:</strong> Puedes hacerle preguntas como "¿Dónde se define el estilo del botón principal?" y la IA leerá todos tus archivos para darte la respuesta exacta.</li>
  <li><strong>Generar y editar código:</strong> Selecciona un trozo de código y pídele que lo refactorice, añada funcionalidades o lo traduzca a otro lenguaje.</li>
  <li><strong>Depurar errores:</strong> ¿Tienes un error que no entiendes? Pídele a Cursor que lo analice y te sugiera una solución.</li>
</ul>

<p>Es como tener a un programador senior sentado a tu lado, disponible 24/7 para responder tus dudas y ayudarte a resolver los problemas más complejos.</p>

<h2>Un Flujo de Trabajo Real: Poniendo Todo Junto</h2>

<p>Veamos cómo sería un proyecto de principio a fin usando estas herramientas:</p>

<ol>
  <li><strong>Ideación (15 minutos):</strong> Usas v0.dev para generar los componentes clave de tu landing page (hero, tabla de precios, testimonios).</li>
  <li><strong>Diseño y Refinamiento (Horas):</strong> Importas los conceptos a Figma o Penpot. Aquí aplicas tu magia: ajustas la tipografía, perfeccionas la paleta de colores y creas la composición final.</li>
  <li><strong>Prototipo y Exportación (30 minutos):</strong> Usas Anima para añadir las animaciones de scroll y las transiciones de los botones. Exportas la sección del hero como un componente de React.</li>
  <li><strong>Desarrollo (Horas en lugar de Días):</strong> El desarrollador toma el código de Anima, lo abre en Cursor y empieza a trabajar. Usa la IA para conectar el formulario de contacto, optimizar el rendimiento y asegurarse de que todo sea perfectamente responsivo.</li>
</ol>

<h2>Conclusión: Adopta a tu Copiloto</h2>

<p>La inteligencia artificial no es una amenaza para los buenos diseñadores. Es una palanca. Es la herramienta que te permitirá ejecutar tus ideas más rápido, eliminar las partes aburridas de tu trabajo y cerrar la dolorosa brecha que siempre ha existido entre el diseño y el código.</p>

<p>Explora estas herramientas, intégralas en tu flujo de trabajo y prepárate para construir mejores sitios web, más rápido. El futuro del diseño web no es sobre si usarás IA, sino sobre cómo la usarás para potenciar tu creatividad.</p>

<p><strong>¿Te ha gustado este artículo?</strong> Explora <a href="https://v0.dev" target="_blank" rel="noopener noreferrer">v0.dev</a>, <a href="https://www.animaapp.com" target="_blank" rel="noopener noreferrer">Anima</a> y <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer">Cursor</a> en nuestro directorio y descubre más herramientas que cambiarán tu forma de trabajar.</p>
`;

async function createBlogPost() {
  try {
    // Primero, obtener el ID del autor "Equipo Secret Network"
    const { data: autores, error: autorError } = await supabase
      .from('autores')
      .select('id')
      .eq('slug', 'equipo-secret-network')
      .single();

    if (autorError) {
      console.error('Error al buscar autor:', autorError);
      throw new Error('No se encontró el autor "Equipo Secret Network". Asegúrate de que existe en la base de datos.');
    }

    const autorId = autores.id;
    console.log(`✓ Autor encontrado: ID ${autorId}`);

    // Crear el blog post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          titulo: '¿Diseñador Web? La IA es el Copiloto que No Sabías que Necesitabas',
          slug: 'disenador-web-ia-copiloto',
          descripcion_corta: 'Descubre cómo la inteligencia artificial está revolucionando el flujo de trabajo del diseñador web, desde el primer boceto hasta el código final. Te mostramos las herramientas que puedes empezar a usar hoy mismo.',
          contenido: contenidoHTML,
          imagen_portada_url: null, // Puedes agregar una URL de imagen si tienes una
          autor: 'Equipo Secret Network', // Legacy field
          autor_id: autorId, // Nuevo campo relacional
          publicado: false, // BORRADOR
          tags: ['diseño web', 'IA', 'herramientas', 'desarrollo', 'v0', 'Cursor', 'Anima'],
          fecha_publicacion: new Date().toISOString(),
          actualizado_en: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    console.log('\n✅ Blog post creado exitosamente!');
    console.log('\nDetalles:');
    console.log('- Título:', data[0].titulo);
    console.log('- Slug:', data[0].slug);
    console.log('- Estado: BORRADOR (publicado=false)');
    console.log('- Autor ID:', data[0].autor_id);
    console.log('- Tags:', data[0].tags.join(', '));
    console.log('\n📝 Puedes editar este post desde el panel de admin en /admin');
  } catch (error) {
    console.error('\n❌ Error al crear el blog post:', error.message);
    process.exit(1);
  }
}

createBlogPost();
