/**
 * HerbCraft Schema.js
 * Generates structured JSON-LD schema markup for herb pages.
 * Exports: generateHerbSchema(herb) → JSON string
 */

const BASE_URL = 'https://herbcraft.app';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

/**
 * Generate all JSON-LD schemas for a given herb object.
 * @param {Object} herb - Herb data object from herbs.json
 * @returns {string} JSON string containing an array of schema objects
 */
function generateHerbSchema(herb) {
  const schemas = [
    buildMedicalEntitySchema(herb),
    buildFAQPageSchema(herb),
    buildBreadcrumbSchema(herb),
    buildArticleSchema(herb),
  ];
  return JSON.stringify(schemas, null, 2);
}

/**
 * MedicalEntity schema
 */
function buildMedicalEntitySchema(herb) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalEntity',
    name: herb.name,
    alternateName: herb.scientific,
    description: herb.overview,
    medicineSystem: {
      '@type': 'MedicineSystem',
      name: 'Traditional Medicine',
    },
    relevantSpecialty: {
      '@type': 'MedicalSpecialty',
      name: 'Herbal Medicine',
    },
    activeIngredient: herb.active_compounds,
    warning: herb.safety_info,
    url: `${BASE_URL}/herbs/${herb.id}.html`,
  };
}

/**
 * FAQPage schema with 6 standard Q&As
 */
function buildFAQPageSchema(herb) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${herb.name} used for?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: herb.benefits,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${herb.name} safe?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: herb.safety_info,
        },
      },
      {
        '@type': 'Question',
        name: `What are the active compounds in ${herb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: herb.active_compounds,
        },
      },
      {
        '@type': 'Question',
        name: `What is the scientific name of ${herb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The scientific name of ${herb.name} is ${herb.scientific}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the traditional uses of ${herb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: herb.traditional,
        },
      },
      {
        '@type': 'Question',
        name: `When should I see a doctor when using ${herb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Always consult a qualified healthcare professional before using ${herb.name} or any herbal supplement, especially if you are pregnant, nursing, taking prescription medications, have a chronic health condition, or are scheduled for surgery. Seek immediate medical attention if you experience severe allergic reactions, chest pain, irregular heartbeat, severe digestive issues, or any symptoms that worsen or do not improve. This information is for educational purposes only and is not a substitute for professional medical advice.`,
        },
      },
    ],
  };
}

/**
 * BreadcrumbList schema: Home > Herb Directory > [Herb Name]
 */
function buildBreadcrumbSchema(herb) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Herb Directory',
        item: `${BASE_URL}/herb-directory.html`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: herb.name,
        item: `${BASE_URL}/herbs/${herb.id}.html`,
      },
    ],
  };
}

/**
 * Article schema
 */
function buildArticleSchema(herb) {
  // Build citation array from references field
  const citations = Array.isArray(herb.references)
    ? herb.references.map((ref) => ({
        '@type': 'CreativeWork',
        name: ref,
      }))
    : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${herb.name} (${herb.scientific}): Uses, Benefits & Safety`,
    description: herb.overview,
    author: {
      '@type': 'Organization',
      name: 'HerbCraft Editorial Team',
      url: `${BASE_URL}/about/`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HerbCraft',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/logo.png`,
      },
    },
    dateModified: TODAY,
    datePublished: TODAY,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/herbs/${herb.id}.html`,
    },
    citation: citations,
    about: {
      '@type': 'MedicalEntity',
      name: herb.name,
      alternateName: herb.scientific,
    },
  };
}

// Export for use in Node.js / build scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateHerbSchema };
}
