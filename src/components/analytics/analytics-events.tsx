// FILE: src/components/analytics/analytics-events.tsx
// Utilidades para trackear eventos personalizados en GA4 y GTM

'use client';

// Declarar gtag globalmente
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Tipos de eventos
export type EventCategory = 
  | 'programa'
  | 'navegacion'
  | 'filtro'
  | 'social'
  | 'conversion'
  | 'engagement';

export type EventAction = 
  | 'click'
  | 'view'
  | 'filter'
  | 'share'
  | 'visit'
  | 'download'
  | 'search';

interface TrackEventParams {
  category: EventCategory;
  action: EventAction;
  label: string;
  value?: number;
  customParams?: Record<string, any>;
}

/**
 * Trackea un evento en Google Analytics y Tag Manager
 */
export function trackEvent({
  category,
  action,
  label,
  value,
  customParams = {},
}: TrackEventParams) {
  // GTM DataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'custom_event',
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value,
      ...customParams,
    });
  }

  // Google Analytics gtag
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...customParams,
    });
  }

  // Log en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', {
      category,
      action,
      label,
      value,
      customParams,
    });
  }
}

/**
 * Eventos específicos para programas
 */
export const programEvents = {
  clickProgram: (programName: string, category: string) => {
    trackEvent({
      category: 'programa',
      action: 'click',
      label: `${category} - ${programName}`,
      customParams: {
        program_name: programName,
        program_category: category,
      },
    });
  },

  visitWebsite: (programName: string) => {
    trackEvent({
      category: 'programa',
      action: 'visit',
      label: `Visit Website - ${programName}`,
      customParams: {
        program_name: programName,
      },
    });
  },

  viewDetails: (programName: string) => {
    trackEvent({
      category: 'programa',
      action: 'view',
      label: `View Details - ${programName}`,
      customParams: {
        program_name: programName,
      },
    });
  },
};

/**
 * Eventos de navegación
 */
export const navigationEvents = {
  clickCategory: (categoryName: string) => {
    trackEvent({
      category: 'navegacion',
      action: 'click',
      label: `Category - ${categoryName}`,
      customParams: {
        category_name: categoryName,
      },
    });
  },

  clickSubcategory: (subcategoryName: string, parentCategory: string) => {
    trackEvent({
      category: 'navegacion',
      action: 'click',
      label: `Subcategory - ${parentCategory} > ${subcategoryName}`,
      customParams: {
        subcategory_name: subcategoryName,
        parent_category: parentCategory,
      },
    });
  },

  clickBreadcrumb: (path: string) => {
    trackEvent({
      category: 'navegacion',
      action: 'click',
      label: `Breadcrumb - ${path}`,
      customParams: {
        breadcrumb_path: path,
      },
    });
  },
};

/**
 * Eventos de filtros
 */
export const filterEvents = {
  applyFilter: (filterType: string, filterValue: string) => {
    trackEvent({
      category: 'filtro',
      action: 'filter',
      label: `${filterType} - ${filterValue}`,
      customParams: {
        filter_type: filterType,
        filter_value: filterValue,
      },
    });
  },

  search: (searchTerm: string, resultsCount: number) => {
    trackEvent({
      category: 'filtro',
      action: 'search',
      label: `Search - ${searchTerm}`,
      value: resultsCount,
      customParams: {
        search_term: searchTerm,
        results_count: resultsCount,
      },
    });
  },
};

/**
 * Eventos de redes sociales
 */
export const socialEvents = {
  share: (platform: string, contentType: string, contentTitle: string) => {
    trackEvent({
      category: 'social',
      action: 'share',
      label: `${platform} - ${contentType} - ${contentTitle}`,
      customParams: {
        social_platform: platform,
        content_type: contentType,
        content_title: contentTitle,
      },
    });
  },
};

/**
 * Eventos de blog
 */
export const blogEvents = {
  readArticle: (articleTitle: string, readingTime: number) => {
    trackEvent({
      category: 'engagement',
      action: 'view',
      label: `Blog - ${articleTitle}`,
      value: readingTime,
      customParams: {
        article_title: articleTitle,
        reading_time: readingTime,
      },
    });
  },

  clickRelatedPost: (postTitle: string) => {
    trackEvent({
      category: 'engagement',
      action: 'click',
      label: `Related Post - ${postTitle}`,
      customParams: {
        post_title: postTitle,
      },
    });
  },
};

/**
 * Eventos de conversión
 */
export const conversionEvents = {
  downloadResource: (resourceName: string) => {
    trackEvent({
      category: 'conversion',
      action: 'download',
      label: `Download - ${resourceName}`,
      customParams: {
        resource_name: resourceName,
      },
    });
  },

  viewAlternatives: (programName: string, alternativesCount: number) => {
    trackEvent({
      category: 'conversion',
      action: 'view',
      label: `Alternatives - ${programName}`,
      value: alternativesCount,
      customParams: {
        program_name: programName,
        alternatives_count: alternativesCount,
      },
    });
  },
};
