#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Herb and condition data
const herbs = [
  {
    name: "Chamomile",
    slug: "chamomile",
    scientificName: "Matricaria chamomilla",
    description: "A gentle herb known for its calming and anti-inflammatory properties",
    properties: ["calming", "anti-inflammatory", "digestive", "sleep-aid"],
    conditions: ["anxiety", "insomnia", "digestive-issues", "inflammation"]
  },
  {
    name: "Lavender",
    slug: "lavender",
    scientificName: "Lavandula angustifolia",
    description: "An aromatic herb prized for its relaxing and antiseptic qualities",
    properties: ["relaxing", "antiseptic", "aromatic", "calming"],
    conditions: ["anxiety", "insomnia", "stress", "headaches"]
  },
  {
    name: "Peppermint",
    slug: "peppermint",
    scientificName: "Mentha piperita",
    description: "A cooling herb excellent for digestive health and mental clarity",
    properties: ["digestive", "cooling", "energizing", "anti-nausea"],
    conditions: ["digestive-issues", "nausea", "headaches", "fatigue"]
  },
  {
    name: "Ginger",
    slug: "ginger",
    scientificName: "Zingiber officinale",
    description: "A warming herb with powerful anti-inflammatory and digestive benefits",
    properties: ["warming", "anti-inflammatory", "digestive", "anti-nausea"],
    conditions: ["nausea", "inflammation", "digestive-issues", "cold-flu"]
  },
  {
    name: "Echinacea",
    slug: "echinacea",
    scientificName: "Echinacea purpurea",
    description: "An immune-boosting herb traditionally used to prevent and treat infections",
    properties: ["immune-boosting", "anti-inflammatory", "antimicrobial"],
    conditions: ["cold-flu", "immune-support", "infections", "inflammation"]
  },
  {
    name: "Turmeric",
    slug: "turmeric",
    scientificName: "Curcuma longa",
    description: "A golden spice with potent anti-inflammatory and antioxidant properties",
    properties: ["anti-inflammatory", "antioxidant", "digestive", "pain-relief"],
    conditions: ["inflammation", "arthritis", "digestive-issues", "pain"]
  }
];

const conditions = [
  { name: "Anxiety", slug: "anxiety", description: "Natural relief for anxiety and stress" },
  { name: "Insomnia", slug: "insomnia", description: "Herbal solutions for better sleep" },
  { name: "Digestive Issues", slug: "digestive-issues", description: "Herbs for digestive health" },
  { name: "Inflammation", slug: "inflammation", description: "Anti-inflammatory herbal remedies" },
  { name: "Nausea", slug: "nausea", description: "Natural nausea relief" },
  { name: "Headaches", slug: "headaches", description: "Herbal headache remedies" },
  { name: "Cold & Flu", slug: "cold-flu", description: "Immune-boosting herbs" },
  { name: "Arthritis", slug: "arthritis", description: "Natural arthritis relief" }
];

// Template for herb/condition pages
const generateHerbConditionPage = (herb, condition) => {
  const title = `${herb.name} for ${condition.name}: Benefits, Dosage & Usage Guide`;
  const description = `Discover how ${herb.name} can help with ${condition.name}. Learn about scientific evidence, proper dosage, preparation methods, and safety considerations.`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - HerbCraft</title>
    <meta name="description" content="${description}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${title}",
        "description": "${description}",
        "author": {
            "@type": "Organization",
            "name": "HerbCraft"
        },
        "publisher": {
            "@type": "Organization",
            "name": "HerbCraft",
            "logo": {
                "@type": "ImageObject",
                "url": "https://herbcraft.com/images/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://herbcraft.com/herbs/${herb.slug}/for-${condition.slug}"
        },
        "about": {
            "@type": "MedicalCondition",
            "name": "${condition.name}",
            "possibleTreatment": {
                "@type": "MedicalTherapy",
                "name": "${herb.name} therapy"
            }
        }
    }
    </script>
    
    <!-- SEO meta tags -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://herbcraft.com/herbs/${herb.slug}/for-${condition.slug}">
    
    <link rel="canonical" href="https://herbcraft.com/herbs/${herb.slug}/for-${condition.slug}">
</head>
<body class="font-sans text-gray-900">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <a href="/" class="text-2xl font-bold text-green-700">
                        🌿 HerbCraft
                    </a>
                </div>
                
                <div class="hidden md:flex space-x-8">
                    <a href="/herbs.html" class="text-gray-700 hover:text-green-700 transition">Herbs</a>
                    <a href="/recipes.html" class="text-gray-700 hover:text-green-700 transition">Recipes</a>
                    <a href="/ai-advisor.html" class="text-gray-700 hover:text-green-700 transition">AI Advisor</a>
                    <a href="/#about" class="text-gray-700 hover:text-green-700 transition">About</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Breadcrumb -->
    <div class="bg-gray-50 py-3">
        <div class="container mx-auto px-4">
            <nav class="text-sm">
                <a href="/" class="text-gray-600 hover:text-green-700">Home</a>
                <span class="mx-2">/</span>
                <a href="/herbs.html" class="text-gray-600 hover:text-green-700">Herbs</a>
                <span class="mx-2">/</span>
                <a href="/herbs/${herb.slug}.html" class="text-gray-600 hover:text-green-700">${herb.name}</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900">For ${condition.name}</span>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-12">
        <div class="container mx-auto px-4 max-w-4xl">
            <h1 class="text-4xl font-bold mb-6">${herb.name} for ${condition.name}</h1>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
                <p class="text-sm">
                    <strong>Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before using herbs for medicinal purposes.
                </p>
            </div>

            <div class="prose prose-lg max-w-none">
                <section class="mb-8">
                    <h2 class="text-2xl font-semibold mb-4">Overview</h2>
                    <p>${herb.name} (${herb.scientificName}) has been traditionally used to help with ${condition.name}. ${herb.description}</p>
                    <p>Research suggests that ${herb.name} may help alleviate ${condition.name} symptoms through its ${herb.properties.join(', ')} properties.</p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold mb-4">How ${herb.name} Helps with ${condition.name}</h2>
                    <p>The active compounds in ${herb.name} work in several ways to address ${condition.name}:</p>
                    <ul class="list-disc pl-6 mb-4">
                        ${herb.properties.slice(0, 3).map(prop => `<li>${prop.charAt(0).toUpperCase() + prop.slice(1).replace('-', ' ')} effects that may reduce symptoms</li>`).join('\n                        ')}
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold mb-4">Recommended Dosage</h2>
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <h3 class="font-semibold mb-2">Tea Preparation:</h3>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Use 1-2 teaspoons of dried ${herb.name} per cup of hot water</li>
                            <li>Steep for 5-10 minutes</li>
                            <li>Drink 2-3 cups daily</li>
                        </ul>
                        
                        <h3 class="font-semibold mb-2">Other Forms:</h3>
                        <ul class="list-disc pl-6">
                            <li>Tincture: 2-4 ml, three times daily</li>
                            <li>Capsules: Follow manufacturer's instructions</li>
                            <li>Essential oil: For external use only, dilute before applying</li>
                        </ul>
                    </div>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold mb-4">Safety Considerations</h2>
                    <ul class="list-disc pl-6 mb-4">
                        <li>Consult a healthcare provider before use, especially if pregnant or nursing</li>
                        <li>May interact with certain medications</li>
                        <li>Start with small doses to test for allergic reactions</li>
                        <li>Discontinue use if adverse effects occur</li>
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold mb-4">Scientific Evidence</h2>
                    <p>While ${herb.name} has been used traditionally for ${condition.name}, scientific research is ongoing. Some studies have shown promising results, but more research is needed to fully understand its effectiveness.</p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold mb-4">Related Resources</h2>
                    <ul class="list-disc pl-6">
                        <li><a href="/herbs/${herb.slug}.html" class="text-green-600 hover:text-green-700">Complete ${herb.name} Guide</a></li>
                        <li><a href="/recipes.html?herb=${herb.slug}" class="text-green-600 hover:text-green-700">${herb.name} Recipes</a></li>
                        <li><a href="/herbs/${herb.slug}/growing-guide.html" class="text-green-600 hover:text-green-700">How to Grow ${herb.name}</a></li>
                    </ul>
                </section>
            </div>

            <!-- CTA Section -->
            <div class="bg-green-50 p-6 rounded-lg mt-8">
                <h3 class="text-xl font-semibold mb-3">Get Personalized Advice</h3>
                <p class="mb-4">Our AI Herbal Advisor can provide personalized recommendations based on your specific needs.</p>
                <a href="/ai-advisor.html" class="bg-green-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-green-700 transition">
                    Consult AI Advisor
                </a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">🌿 HerbCraft</h3>
                    <p class="text-gray-400">Your AI-powered herbal knowledge platform</p>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Explore</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/herbs.html" class="hover:text-white">Herb Database</a></li>
                        <li><a href="/recipes.html" class="hover:text-white">Recipes</a></li>
                        <li><a href="/ai-advisor.html" class="hover:text-white">AI Advisor</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Community</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Forums</a></li>
                        <li><a href="#" class="hover:text-white">Blog</a></li>
                        <li><a href="#" class="hover:text-white">Newsletter</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Legal</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/privacy.html" class="hover:text-white">Privacy Policy</a></li>
                        <li><a href="/terms.html" class="hover:text-white">Terms of Service</a></li>
                        <li><a href="/disclaimer.html" class="hover:text-white">Medical Disclaimer</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 HerbCraft. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Main JavaScript -->
    <script src="/js/main.js"></script>
</body>
</html>`;
};

// Generate all programmatic pages
async function generatePages() {
  console.log('🌿 Generating programmatic SEO pages...');
  
  const generatedPages = [];
  
  // Create herbs directory structure
  for (const herb of herbs) {
    const herbDir = path.join(__dirname, '..', 'herbs', herb.slug);
    
    try {
      await fs.mkdir(herbDir, { recursive: true });
      
      // Generate condition-specific pages
      for (const conditionSlug of herb.conditions) {
        const condition = conditions.find(c => c.slug === conditionSlug);
        if (condition) {
          const pageContent = generateHerbConditionPage(herb, condition);
          const fileName = `for-${condition.slug}.html`;
          const filePath = path.join(herbDir, fileName);
          
          await fs.writeFile(filePath, pageContent);
          generatedPages.push(`/herbs/${herb.slug}/${fileName}`);
          console.log(`✅ Generated: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error generating pages for ${herb.name}:`, error);
    }
  }
  
  // Update sitemap with new pages
  await updateSitemap(generatedPages);
  
  console.log(`\n✨ Successfully generated ${generatedPages.length} programmatic pages!`);
  return generatedPages;
}

// Update sitemap with programmatic pages
async function updateSitemap(pages) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  
  try {
    let sitemapContent = await fs.readFile(sitemapPath, 'utf-8');
    
    // Find the closing </urlset> tag
    const closingTag = '</urlset>';
    const insertPosition = sitemapContent.lastIndexOf(closingTag);
    
    // Generate new URL entries
    const newUrls = pages.map(page => `  <url>
    <loc>https://herbcraft.com${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');
    
    // Insert new URLs before closing tag
    sitemapContent = sitemapContent.slice(0, insertPosition) + 
                    '\n  <!-- Programmatic SEO Pages -->\n' + 
                    newUrls + '\n' + 
                    sitemapContent.slice(insertPosition);
    
    await fs.writeFile(sitemapPath, sitemapContent);
    console.log('✅ Updated sitemap.xml with programmatic pages');
  } catch (error) {
    console.error('❌ Error updating sitemap:', error);
  }
}

// Run the generator
if (require.main === module) {
  generatePages().catch(console.error);
}

module.exports = { generatePages, herbs, conditions };