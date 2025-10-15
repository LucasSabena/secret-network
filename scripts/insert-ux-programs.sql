-- =====================================================
-- Script para insertar programas de UX/Testing
-- 5 programas: Maze, Useberry, UXtweak, Optimal Workshop, Lyssna
-- =====================================================

-- Primero, necesitamos el ID de la categoría "Programas de Diseño"
-- y la subcategoría "Diseño UI/UX y Prototipado"

-- IMPORTANTE: Ajusta estos IDs según tu base de datos
-- Para verificar los IDs correctos, ejecuta:
-- SELECT id, nombre, slug FROM categorias WHERE slug = 'programas-de-diseño';
-- SELECT id, nombre, slug FROM categorias WHERE slug = 'diseño-ui-ux-y-prototipado';

-- Asumiendo:
-- categoria_id = 29 (Programas de Diseño)
-- subcategoria_id = 32 (Diseño UI/UX y Prototipado)

-- =====================================================
-- 1. MAZE
-- =====================================================
INSERT INTO programas (
  nombre,
  slug,
  categoria_slug,
  categoria_id,
  descripcion_corta,
  descripcion_larga,
  icono_url,
  captura_url,
  dificultad,
  es_open_source,
  es_recomendado,
  web_oficial_url
) VALUES (
  'Maze',
  'maze',
  'programas-de-diseño',
  29,
  'Una plataforma de pruebas rápidas que convierte prototipos en insights accionables de usuarios reales en cuestión de horas.',
  '<p>Maze es la plataforma líder para la realización de pruebas de usuario rápidas y no moderadas. Se integra directamente con herramientas de diseño como Figma, Adobe XD o Sketch, permitiendo a los equipos de producto importar sus prototipos y obtener feedback cuantitativo y cualitativo de usuarios reales a una velocidad sin precedentes.</p>

<h3>Puntos Fuertes y Características Clave:</h3>

<p><strong>Integración Directa con Prototipos:</strong> Su principal ventaja es la capacidad de importar un prototipo directamente desde Figma. Los usuarios interactúan con tu diseño real, no con una simulación.</p>

<p><strong>Pruebas No Moderadas a Escala:</strong> Permite enviar un enlace a cientos de usuarios y recopilar datos de forma asíncrona, sin necesidad de programar sesiones individuales.</p>

<p><strong>Métricas Cuantitativas Claras:</strong> Genera automáticamente informes con métricas clave como tasas de éxito en tareas, mapas de calor de clics (heatmaps), duración de las tareas y rutas de usuario.</p>

<p><strong>Variedad de Bloques de Prueba:</strong> Permite construir pruebas complejas combinando diferentes tipos de preguntas: tareas en el prototipo, preguntas de opción múltiple, escalas de opinión y preguntas abiertas.</p>

<h3>¿Para quién es ideal Maze?</h3>
<p>Es la herramienta indispensable para diseñadores de producto y equipos ágiles que necesitan validar sus diseños rápidamente y tomar decisiones basadas en datos reales de los usuarios, en lugar de en opiniones.</p>',
  NULL,
  NULL,
  'Intermedio',
  false,
  true,
  'https://maze.co'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. USEBERRY
-- =====================================================
INSERT INTO programas (
  nombre,
  slug,
  categoria_slug,
  categoria_id,
  descripcion_corta,
  descripcion_larga,
  icono_url,
  captura_url,
  dificultad,
  es_open_source,
  es_recomendado,
  web_oficial_url
) VALUES (
  'Useberry',
  'useberry',
  'programas-de-diseño',
  29,
  'Una plataforma de investigación de experiencia de usuario que ofrece una suite completa de métodos de prueba para prototipos y sitios web en vivo.',
  '<p>Useberry es una plataforma de investigación de experiencia de usuario que se posiciona como una alternativa robusta a Maze. Ofrece una amplia gama de métodos de prueba no moderadas que se pueden aplicar tanto a prototipos importados de herramientas de diseño como a sitios web o aplicaciones ya en producción. Destaca por la riqueza de los datos que recopila, incluyendo grabaciones de sesión.</p>

<h3>Puntos Fuertes y Características Clave:</h3>

<p><strong>Suite de Métodos de Prueba:</strong> Además de las pruebas de prototipos, ofrece pruebas de primer clic, card sorting, tree testing y encuestas, cubriendo una gran parte del espectro de la investigación UX.</p>

<p><strong>Grabaciones de Sesión y Mapas de Calor:</strong> Para cada participante, graba en vídeo su pantalla, sus clics y su interacción, proporcionando un contexto cualitativo muy rico para entender el "porqué" detrás de las métricas cuantitativas.</p>

<p><strong>Integración con Paneles de Participantes:</strong> Se integra con paneles de usuarios de terceros, facilitando el reclutamiento de participantes para las pruebas que se ajusten a un perfil demográfico específico.</p>

<p><strong>Análisis de Flujo de Usuario:</strong> Proporciona análisis detallados sobre los caminos que toman los usuarios para completar una tarea, identificando puntos de fricción y abandonos.</p>

<h3>¿Para quién es ideal Useberry?</h3>
<p>Es ideal para investigadores de UX y equipos de producto que necesitan una solución todo en uno para la investigación cuantitativa y cualitativa, y que valoran especialmente poder ver las grabaciones de las sesiones de los usuarios.</p>',
  NULL,
  NULL,
  'Intermedio',
  false,
  true,
  'https://www.useberry.com'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 3. UXTWEAK
-- =====================================================
INSERT INTO programas (
  nombre,
  slug,
  categoria_slug,
  categoria_id,
  descripcion_corta,
  descripcion_larga,
  icono_url,
  captura_url,
  dificultad,
  es_open_source,
  es_recomendado,
  web_oficial_url
) VALUES (
  'UXtweak',
  'uxtweak',
  'programas-de-diseño',
  29,
  'Una potente plataforma todo-en-uno para la investigación de UX que cubre todo el ciclo de vida del producto, desde prototipos hasta sitios en producción.',
  '<p>UXtweak es una plataforma de investigación de UX todo-en-uno que ofrece un conjunto de herramientas extremadamente completo para analizar y mejorar la experiencia de usuario. Su gran diferenciador es su capacidad para cubrir todo el ciclo de vida de un producto, desde las primeras etapas de investigación de la arquitectura de la información hasta el análisis del comportamiento en el sitio web en vivo.</p>

<h3>Puntos Fuertes y Características Clave:</h3>

<p><strong>Suite de Herramientas Completa:</strong> Es una verdadera navaja suiza. Incluye Card Sorting, Tree Testing, Pruebas de Preferencia, Pruebas de Cinco Segundos, Encuestas y un completo conjunto de herramientas para sitios en vivo, como grabación de sesiones y mapas de calor.</p>

<p><strong>Reclutamiento de Participantes Integrado:</strong> Ofrece un panel de usuarios integrado con más de 155 millones de participantes en todo el mundo, así como un widget de reclutamiento para captar a tus propios usuarios directamente desde tu sitio web.</p>

<p><strong>"Own Your Data":</strong> Tiene un fuerte enfoque en la propiedad de los datos, ofreciendo planes que permiten a las empresas ser las propietarias de todos los datos de la investigación.</p>

<p><strong>Análisis de Sitios Web en Vivo:</strong> Sus herramientas de análisis de comportamiento (Session Recording) permiten ver exactamente cómo los usuarios reales interactúan con tu producto en producción.</p>

<h3>¿Para quién es ideal UXtweak?</h3>
<p>Es la solución perfecta para investigadores de UX, agencias y empresas que buscan una única plataforma para gestionar todas sus necesidades de investigación de usuario, desde la ideación hasta la optimización continua del producto final.</p>',
  NULL,
  NULL,
  'Intermedio',
  false,
  true,
  'https://www.uxtweak.com'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 4. OPTIMAL WORKSHOP
-- =====================================================
INSERT INTO programas (
  nombre,
  slug,
  categoria_slug,
  categoria_id,
  descripcion_corta,
  descripcion_larga,
  icono_url,
  captura_url,
  dificultad,
  es_open_source,
  es_recomendado,
  web_oficial_url
) VALUES (
  'Optimal Workshop',
  'optimal-workshop',
  'programas-de-diseño',
  29,
  'La suite de herramientas estándar de la industria para la investigación de la arquitectura de la información (IA).',
  '<p>Optimal Workshop es la suite de herramientas estándar de la industria, especializada en la investigación de la arquitectura de la información (IA) y el diseño de la navegación. Durante años, ha sido la plataforma de referencia para que los arquitectos de la información y los diseñadores de UX tomen decisiones informadas sobre cómo estructurar y etiquetar el contenido de un sitio web o una aplicación.</p>

<h3>Puntos Fuertes y Características Clave:</h3>

<p><strong>Especialización en Arquitectura de la Información:</strong> Su enfoque es muy claro y profundo. Sus herramientas están diseñadas por expertos en IA y son consideradas el estándar de oro en el campo.</p>

<p><strong>OptimalSort (Card Sorting):</strong> Su herramienta para realizar estudios de card sorting (abierto, cerrado o híbrido) es la más robusta del mercado, con potentes herramientas de análisis de resultados.</p>

<p><strong>Treejack (Tree Testing):</strong> Es la herramienta de referencia para validar la estructura de navegación de un sitio. Permite probar si los usuarios pueden encontrar información en una jerarquía de contenido sin la influencia del diseño visual.</p>

<p><strong>Chalkmark (Pruebas de Primer Clic):</strong> Permite analizar dónde harían clic los usuarios por primera vez en una interfaz para completar una tarea, validando la claridad visual y la jerarquía de la información.</p>

<h3>¿Para quién es ideal Optimal Workshop?</h3>
<p>Es una herramienta esencial para arquitectos de la información, estrategas de contenido y diseñadores de UX que trabajan en proyectos grandes y complejos. Es indispensable para tomar decisiones fundamentadas sobre la estructura, la navegación y el etiquetado.</p>',
  NULL,
  NULL,
  'Intermedio',
  false,
  true,
  'https://www.optimalworkshop.com'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 5. LYSSNA
-- =====================================================
INSERT INTO programas (
  nombre,
  slug,
  categoria_slug,
  categoria_id,
  descripcion_corta,
  descripcion_larga,
  icono_url,
  captura_url,
  dificultad,
  es_open_source,
  es_recomendado,
  web_oficial_url
) VALUES (
  'Lyssna',
  'lyssna',
  'programas-de-diseño',
  29,
  'Una plataforma de investigación de usuario todo-en-uno que facilita la obtención de feedback claro en cada etapa del proceso de diseño.',
  '<p>Lyssna (anteriormente UsabilityHub) es una plataforma de investigación de usuario todo-en-uno que se enfoca en la velocidad y la claridad para obtener feedback en cada etapa del proceso de diseño. Ofrece una variedad de métodos de prueba rápidos que ayudan a los equipos a tomar decisiones de diseño más inteligentes, desde la validación de un eslogan hasta la prueba de un prototipo completo.</p>

<h3>Puntos Fuertes y Características Clave:</h3>

<p><strong>Variedad de Métodos de Prueba Rápidos:</strong> Ofrece una suite de pruebas muy prácticas: Pruebas de Primer Clic, Pruebas de Preferencia (¿qué diseño gusta más?), Pruebas de Cinco Segundos (¿qué recuerdan los usuarios tras ver un diseño durante 5s?), Encuestas y Pruebas de Prototipos.</p>

<p><strong>Panel de Participantes Integrado:</strong> Cuenta con un panel propio con cientos de miles de participantes, lo que permite obtener respuestas de un público objetivo específico en cuestión de minutos.</p>

<p><strong>Enfoque en la Claridad y la Rapidez:</strong> La plataforma está diseñada para configurar pruebas y analizar los resultados de forma muy rápida y sencilla, ideal para equipos que necesitan un feedback ágil.</p>

<p><strong>Resultados Fáciles de Interpretar:</strong> Presenta los resultados de forma muy visual y fácil de entender, con mapas de calor, nubes de palabras y gráficos claros.</p>

<h3>¿Para quién es ideal Lyssna?</h3>
<p>Es ideal para diseñadores de marketing, diseñadores de UI/UX y gerentes de producto que necesitan validar rápidamente decisiones de diseño específicas. Es perfecta para obtener feedback rápido y frecuente a lo largo de todo el proceso creativo.</p>',
  NULL,
  NULL,
  'Intermedio',
  false,
  true,
  'https://www.lyssna.com'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- INSERTAR SUBCATEGORÍAS (tabla intermedia)
-- =====================================================

-- Primero obtenemos los IDs de los programas recién insertados
WITH programa_ids AS (
  SELECT id, slug FROM programas WHERE slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna')
)
INSERT INTO programas_subcategorias (programa_id, subcategoria_id)
SELECT p.id, 32 -- ID de la subcategoría "Diseño UI/UX y Prototipado"
FROM programa_ids p
ON CONFLICT (programa_id, subcategoria_id) DO NOTHING;

-- =====================================================
-- CONFIGURAR ALTERNATIVAS
-- =====================================================
-- Cada programa tendrá 5 alternativas:
--   - Los otros 4 programas de UX/Testing (bidireccional)
--   - Figma (id = 218)
-- 
-- IMPORTANTE: Figma NO tendrá estos programas como alternativas

-- 1. Crear relaciones bidireccionales entre los 5 programas de UX
--    (Cada uno → los otros 4)
WITH programa_ids AS (
  SELECT id, slug FROM programas WHERE slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna')
),
all_combinations AS (
  SELECT p1.id AS original_id, p2.id AS alternativa_id
  FROM programa_ids p1
  CROSS JOIN programa_ids p2
  WHERE p1.id != p2.id
)
INSERT INTO programas_alternativas (programa_original_id, programa_alternativa_id)
SELECT original_id, alternativa_id FROM all_combinations
ON CONFLICT (programa_original_id, programa_alternativa_id) DO NOTHING;

-- 2. Agregar Figma (id = 218) como alternativa de cada uno de estos 5 programas
INSERT INTO programas_alternativas (programa_original_id, programa_alternativa_id)
SELECT p.id, 218
FROM programas p
WHERE p.slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna')
ON CONFLICT (programa_original_id, programa_alternativa_id) DO NOTHING;

-- =====================================================
-- VERIFICAR RESULTADOS
-- =====================================================

SELECT 'Programas insertados:' AS status;
SELECT id, nombre, slug, web_oficial_url 
FROM programas 
WHERE slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna')
ORDER BY nombre;

SELECT 'Subcategorías asignadas:' AS status;
SELECT p.nombre, p.slug, c.nombre AS subcategoria
FROM programas p
JOIN programas_subcategorias ps ON p.id = ps.programa_id
JOIN categorias c ON ps.subcategoria_id = c.id
WHERE p.slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna')
ORDER BY p.nombre;

SELECT 'Total de alternativas por programa (debe ser 5 para cada uno):' AS status;
SELECT p.nombre, COUNT(*) AS total_alternativas
FROM programas_alternativas pa
JOIN programas p ON pa.programa_original_id = p.id
WHERE p.slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna')
GROUP BY p.nombre
ORDER BY p.nombre;

SELECT 'Alternativas de Maze (ejemplo - debe tener 5):' AS status;
SELECT p2.nombre AS alternativa
FROM programas_alternativas pa
JOIN programas p1 ON pa.programa_original_id = p1.id
JOIN programas p2 ON pa.programa_alternativa_id = p2.id
WHERE p1.slug = 'maze'
ORDER BY p2.nombre;

SELECT 'Verificar que Figma NO tiene estos programas como alternativas:' AS status;
SELECT COUNT(*) AS count_debe_ser_0
FROM programas_alternativas pa
JOIN programas p ON pa.programa_alternativa_id = p.id
WHERE pa.programa_original_id = 218
  AND p.slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna');
