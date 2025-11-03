import { BlogPost, Block } from './types';

/**
 * Exporta un blog post a JSON
 */
export function exportToJSON(post: BlogPost): void {
  const exportData = {
    metadata: {
      titulo: post.titulo,
      slug: post.slug,
      descripcion_corta: post.descripcion_corta,
      autor: post.autor,
      tags: post.tags || [],
      imagen_portada_url: post.imagen_portada_url,
      imagen_portada_alt: post.imagen_portada_alt,
      publicado: post.publicado,
      fecha_publicacion: post.fecha_publicacion,
      // categoria_id: post.categoria_id,
    },
    bloques: post.contenido_bloques || [],
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${post.slug}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Convierte un bloque a Markdown
 */
function blockToMarkdown(block: Block): string {
  switch (block.type) {
    case 'text':
      const { format, content } = block.data;
      switch (format) {
        case 'h1':
          return `# ${content}\n\n`;
        case 'h2':
          return `## ${content}\n\n`;
        case 'h3':
          return `### ${content}\n\n`;
        case 'h4':
          return `#### ${content}\n\n`;
        case 'h5':
          return `##### ${content}\n\n`;
        case 'h6':
          return `###### ${content}\n\n`;
        case 'paragraph':
          return `${content}\n\n`;
        case 'ul':
          return `${content}\n\n`;
        case 'ol':
          return `${content}\n\n`;
        case 'quote':
          return `> ${content}\n\n`;
        default:
          return `${content}\n\n`;
      }

    case 'image':
      const alt = block.data.alt || 'Image';
      const caption = block.data.caption ? `\n*${block.data.caption}*` : '';
      return `![${alt}](${block.data.url || 'placeholder.jpg'})${caption}\n\n`;

    case 'code':
      return `\`\`\`${block.data.language || ''}\n${block.data.code}\n\`\`\`\n\n`;

    case 'callout':
      return `> **${block.data.icon || '💡'}** ${block.data.content}\n\n`;

    case 'alert':
      return `> **${block.data.title || 'Alert'}**\n> ${block.data.description}\n\n`;

    case 'quote':
      return `> ${block.data.quote}\n> \n> — ${block.data.author}${block.data.role ? `, ${block.data.role}` : ''}\n\n`;

    case 'faq':
      let faqMd = '## FAQ\n\n';
      block.data.items.forEach((item) => {
        faqMd += `**${item.question}**\n\n${item.answer}\n\n`;
      });
      return faqMd;

    case 'table':
      let tableMd = '';
      // Headers
      tableMd += '| ' + block.data.headers.join(' | ') + ' |\n';
      tableMd += '| ' + block.data.headers.map(() => '---').join(' | ') + ' |\n';
      // Rows
      block.data.rows.forEach((row) => {
        tableMd += '| ' + row.join(' | ') + ' |\n';
      });
      return tableMd + '\n';

    case 'pros-cons':
      let prosConsMd = '';
      if (block.data.pros.length > 0) {
        prosConsMd += '### Pros\n\n';
        block.data.pros.forEach((pro) => {
          prosConsMd += `- ✅ ${pro}\n`;
        });
        prosConsMd += '\n';
      }
      if (block.data.cons.length > 0) {
        prosConsMd += '### Cons\n\n';
        block.data.cons.forEach((con) => {
          prosConsMd += `- ❌ ${con}\n`;
        });
        prosConsMd += '\n';
      }
      return prosConsMd;

    case 'feature-list':
      let featuresMd = '';
      block.data.features.forEach((feature) => {
        featuresMd += `### ${feature.icon || '•'} ${feature.title}\n\n${feature.description}\n\n`;
      });
      return featuresMd;

    case 'stats':
      let statsMd = '';
      block.data.stats.forEach((stat) => {
        statsMd += `**${stat.value}** ${stat.label}\n\n`;
      });
      return statsMd;

    default:
      return `<!-- Bloque tipo: ${block.type} -->\n\n`;
  }
}

/**
 * Exporta un blog post a Markdown
 */
export function exportToMarkdown(post: BlogPost): void {
  let markdown = '';

  // Frontmatter
  markdown += '---\n';
  markdown += `title: "${post.titulo}"\n`;
  markdown += `slug: "${post.slug}"\n`;
  markdown += `description: "${post.descripcion_corta || ''}"\n`;
  markdown += `author: "${post.autor || ''}"\n`;
  markdown += `date: "${post.fecha_publicacion}"\n`;
  markdown += `published: ${post.publicado}\n`;
  if (post.tags && post.tags.length > 0) {
    markdown += `tags: [${post.tags.map(t => `"${t}"`).join(', ')}]\n`;
  }
  if (post.imagen_portada_url) {
    markdown += `cover: "${post.imagen_portada_url}"\n`;
    markdown += `coverAlt: "${post.imagen_portada_alt || ''}"\n`;
  }
  markdown += '---\n\n';

  // Content
  if (post.contenido_bloques && post.contenido_bloques.length > 0) {
    post.contenido_bloques.forEach((block) => {
      markdown += blockToMarkdown(block);
    });
  } else if (post.contenido) {
    markdown += post.contenido + '\n\n';
  }

  // Download
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${post.slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
