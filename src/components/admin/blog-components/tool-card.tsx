// Componente ToolCard para insertar en blogs
// Genera HTML con estilos inline para funcionar en contenido HTML

export type ToolCardSize = 'small' | 'medium' | 'large';

export interface ToolCardProps {
  toolName: string;
  description: string;
  imageUrl?: string;
  link?: string;
  size?: ToolCardSize;
}

// Función que genera el HTML del componente
export function generateToolCardHTML(props: ToolCardProps): string {
  const { toolName, description, imageUrl, link, size = 'medium' } = props;

  // Estilos según el tamaño
  const sizes = {
    small: {
      container: 'max-width: 280px;',
      image: 'height: 120px;',
      title: 'font-size: 1rem;',
      description: 'font-size: 0.875rem;',
    },
    medium: {
      container: 'max-width: 400px;',
      image: 'height: 180px;',
      title: 'font-size: 1.25rem;',
      description: 'font-size: 0.9375rem;',
    },
    large: {
      container: 'max-width: 100%;',
      image: 'height: 240px;',
      title: 'font-size: 1.5rem;',
      description: 'font-size: 1rem;',
    },
  };

  const styles = sizes[size];

  // HTML base con estilos inline
  const baseStyles = `
    border-radius: 0.75rem;
    overflow: hidden;
    background: #1a1a1a;
    border: 1px solid #333;
    transition: all 0.3s ease;
    margin: 1.5rem auto;
    ${styles.container}
  `;

  const imageSection = imageUrl
    ? `
    <div style="
      width: 100%;
      ${styles.image}
      overflow: hidden;
      background: linear-gradient(135deg, #ff3399 0%, #9933ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <img 
        src="${imageUrl}" 
        alt="${toolName}"
        style="
          width: 100%;
          height: 100%;
          object-fit: cover;
        "
      />
    </div>
  `
    : `
    <div style="
      width: 100%;
      ${styles.image}
      background: linear-gradient(135deg, #ff3399 0%, #9933ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      color: white;
    ">
      ${toolName.charAt(0).toUpperCase()}
    </div>
  `;

  const linkWrapper = link
    ? { open: `<a href="${link}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">`, close: '</a>' }
    : { open: '', close: '' };

  return `
<div class="tool-card" style="${baseStyles}">
  ${linkWrapper.open}
    ${imageSection}
    <div style="padding: 1.5rem;">
      <h3 style="
        ${styles.title}
        font-weight: 700;
        margin: 0 0 0.75rem 0;
        color: #fafafa;
        background: linear-gradient(135deg, #ff3399 0%, #9933ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      ">
        ${toolName}
      </h3>
      <p style="
        ${styles.description}
        color: #a1a1aa;
        margin: 0;
        line-height: 1.6;
      ">
        ${description}
      </p>
      ${link ? `
        <div style="margin-top: 1rem;">
          <span style="
            display: inline-block;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #ff3399 0%, #9933ff 100%);
            color: white;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
          ">
            Ver herramienta →
          </span>
        </div>
      ` : ''}
    </div>
  ${linkWrapper.close}
</div>
  `.trim();
}

// Componente React para preview en el editor
export default function ToolCard(props: ToolCardProps) {
  const { toolName, description, imageUrl, link, size = 'medium' } = props;

  const sizeClasses = {
    small: 'max-w-xs',
    medium: 'max-w-md',
    large: 'w-full',
  };

  const imageHeights = {
    small: 'h-32',
    medium: 'h-44',
    large: 'h-60',
  };

  const titleSizes = {
    small: 'text-base',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  const descSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-base',
  };

  const CardContent = () => (
    <>
      <div className={`w-full ${imageHeights[size]} overflow-hidden flex items-center justify-center`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={toolName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-5xl font-bold text-white">
            {toolName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className={`${titleSizes[size]} font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent`}>
          {toolName}
        </h3>
        <p className={`${descSizes[size]} text-muted-foreground leading-relaxed`}>
          {description}
        </p>
        {link && (
          <div className="mt-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-sm font-semibold">
              Ver herramienta →
            </span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={`${sizeClasses[size]} mx-auto my-6 rounded-xl overflow-hidden bg-card border border-border transition-all hover:border-primary/50`}>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
          <CardContent />
        </a>
      ) : (
        <CardContent />
      )}
    </div>
  );
}
