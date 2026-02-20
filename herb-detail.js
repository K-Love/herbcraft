const herbData = {
    'ashwagandha': {
        name: 'Ashwagandha',
        scientificName: 'Withania somnifera',
        overview: 'Ashwagandha is an adaptogenic herb traditionally used in Ayurvedic medicine.',
        traditionalUses: 'Traditionally used to support stress management and overall vitality.',
        activeCompounds: 'Contains withanolides, alkaloids, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for stress response and cognitive function.',
        safety: 'Generally considered safe when used appropriately. May interact with certain medications.'
    },
    'basil': {
        name: 'Basil',
        scientificName: 'Ocimum basilicum',
        overview: 'Basil is a culinary herb that has also been used traditionally in herbal medicine.',
        traditionalUses: 'Traditionally used to support digestive health and overall wellness.',
        activeCompounds: 'Contains essential oils including eugenol, linalool, and other compounds.',
        potentialBenefits: 'Research suggests potential antioxidant and anti-inflammatory properties.',
        safety: 'Generally safe when used as a food or culinary herb. Consult healthcare provider for medicinal use.'
    },
    'calendula': {
        name: 'Calendula',
        scientificName: 'Calendula officinalis',
        overview: 'Calendula, also known as pot marigold, has been used traditionally for skin care.',
        traditionalUses: 'Traditionally used topically to support skin health and wound healing.',
        activeCompounds: 'Contains flavonoids, triterpenoids, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for skin health and minor skin irritations.',
        safety: 'Generally considered safe for topical use. May cause allergic reactions in some individuals.'
    },
    'chamomile': {
        name: 'Chamomile',
        scientificName: 'Matricaria chamomilla',
        overview: 'Chamomile is a popular herb traditionally used for relaxation and digestive support.',
        traditionalUses: 'Traditionally used to promote relaxation and support digestive comfort.',
        activeCompounds: 'Contains apigenin, bisabolol, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for sleep quality and digestive wellness.',
        safety: 'Generally safe for most people. May cause allergic reactions in those sensitive to ragweed.'
    },
    'cinnamon': {
        name: 'Cinnamon',
        scientificName: 'Cinnamomum verum',
        overview: 'Cinnamon is a widely used spice with traditional medicinal applications.',
        traditionalUses: 'Traditionally used to support digestive health and overall wellness.',
        activeCompounds: 'Contains cinnamaldehyde, eugenol, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for blood sugar management and antioxidant support.',
        safety: 'Generally safe in culinary amounts. High doses may interact with certain medications.'
    },
    'dandelion': {
        name: 'Dandelion',
        scientificName: 'Taraxacum officinale',
        overview: 'Dandelion is a common plant with traditional medicinal uses for various health conditions.',
        traditionalUses: 'Traditionally used to support liver health and digestive function.',
        activeCompounds: 'Contains sesquiterpene lactones, phenolic compounds, and other bioactive substances.',
        potentialBenefits: 'Research suggests potential benefits for liver health and digestive wellness.',
        safety: 'Generally safe for most people. May interact with certain medications.'
    },
    'echinacea': {
        name: 'Echinacea',
        scientificName: 'Echinacea purpurea',
        overview: 'Echinacea is a popular herb traditionally used to support immune function.',
        traditionalUses: 'Traditionally used to support the immune system and overall health.',
        activeCompounds: 'Contains alkamides, polysaccharides, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for immune system support.',
        safety: 'Generally safe for short-term use. Not recommended for those with autoimmune conditions.'
    },
    'elderberry': {
        name: 'Elderberry',
        scientificName: 'Sambucus nigra',
        overview: 'Elderberry has been used traditionally to support immune health and respiratory wellness.',
        traditionalUses: 'Traditionally used to support immune function and respiratory health.',
        activeCompounds: 'Contains anthocyanins, flavonoids, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for immune system support.',
        safety: 'Generally safe when properly prepared. Raw berries should not be consumed.'
    },
    'fennel': {
        name: 'Fennel',
        scientificName: 'Foeniculum vulgare',
        overview: 'Fennel is an aromatic herb traditionally used for digestive support.',
        traditionalUses: 'Traditionally used to support digestive comfort and overall wellness.',
        activeCompounds: 'Contains anethole, fenchone, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for digestive health.',
        safety: 'Generally safe in food amounts. May interact with certain medications.'
    },
    'garlic': {
        name: 'Garlic',
        scientificName: 'Allium sativum',
        overview: 'Garlic is a widely used culinary herb with traditional medicinal applications.',
        traditionalUses: 'Traditionally used to support cardiovascular health and immune function.',
        activeCompounds: 'Contains allicin, sulfur compounds, and other bioactive substances.',
        potentialBenefits: 'Research suggests potential benefits for cardiovascular health and immune support.',
        safety: 'Generally safe in food amounts. May interact with blood-thinning medications.'
    },
    'ginger': {
        name: 'Ginger',
        scientificName: 'Zingiber officinale',
        overview: 'Ginger is a popular spice traditionally used for digestive support and nausea relief.',
        traditionalUses: 'Traditionally used to support digestive comfort and ease occasional nausea.',
        activeCompounds: 'Contains gingerols, shogaols, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for digestive health and nausea management.',
        safety: 'Generally safe in food amounts. High doses may interact with blood-thinning medications.'
    },
    'ginkgo': {
        name: 'Ginkgo',
        scientificName: 'Ginkgo biloba',
        overview: 'Ginkgo is an ancient tree species with traditional uses for cognitive support.',
        traditionalUses: 'Traditionally used to support cognitive function and circulation.',
        activeCompounds: 'Contains flavonoids, terpenoids, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for cognitive function and circulation.',
        safety: 'Generally safe for most people. May interact with blood-thinning medications.'
    },
    'ginseng': {
        name: 'Ginseng',
        scientificName: 'Panax ginseng',
        overview: 'Ginseng is a traditional adaptogenic herb used to support energy and vitality.',
        traditionalUses: 'Traditionally used to support energy, vitality, and overall wellness.',
        activeCompounds: 'Contains ginsenosides, polysaccharides, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for energy levels and cognitive function.',
        safety: 'Generally safe for short-term use. May interact with certain medications.'
    },
    'lavender': {
        name: 'Lavender',
        scientificName: 'Lavandula angustifolia',
        overview: 'Lavender is a popular aromatic herb traditionally used for relaxation and stress management.',
        traditionalUses: 'Traditionally used to promote relaxation and support restful sleep.',
        activeCompounds: 'Contains linalool, linalyl acetate, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for relaxation and sleep quality.',
        safety: 'Generally safe for aromatherapy and topical use. Consult healthcare provider for internal use.'
    },
    'lemon-balm': {
        name: 'Lemon Balm',
        scientificName: 'Melissa officinalis',
        overview: 'Lemon balm is a calming herb traditionally used to support relaxation and digestive comfort.',
        traditionalUses: 'Traditionally used to promote calmness and support digestive wellness.',
        activeCompounds: 'Contains rosmarinic acid, flavonoids, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for stress management and sleep quality.',
        safety: 'Generally safe for most people. May interact with thyroid medications.'
    },
    'licorice': {
        name: 'Licorice',
        scientificName: 'Glycyrrhiza glabra',
        overview: 'Licorice root has been used traditionally for respiratory and digestive support.',
        traditionalUses: 'Traditionally used to support respiratory health and digestive comfort.',
        activeCompounds: 'Contains glycyrrhizin, flavonoids, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for respiratory and digestive health.',
        safety: 'Use with caution. High doses or long-term use may affect blood pressure and potassium levels.'
    },
    'peppermint': {
        name: 'Peppermint',
        scientificName: 'Mentha × piperita',
        overview: 'Peppermint is a popular herb traditionally used for digestive support.',
        traditionalUses: 'Traditionally used to support digestive comfort and ease occasional digestive discomfort.',
        activeCompounds: 'Contains menthol, menthone, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for digestive health and IBS symptoms.',
        safety: 'Generally safe for most people. May worsen heartburn in some individuals.'
    },
    'rosemary': {
        name: 'Rosemary',
        scientificName: 'Rosmarinus officinalis',
        overview: 'Rosemary is an aromatic herb traditionally used for cognitive support and overall wellness.',
        traditionalUses: 'Traditionally used to support memory, concentration, and overall vitality.',
        activeCompounds: 'Contains rosmarinic acid, carnosic acid, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for cognitive function and antioxidant support.',
        safety: 'Generally safe in culinary amounts. High medicinal doses should be used with caution.'
    },
    'sage': {
        name: 'Sage',
        scientificName: 'Salvia officinalis',
        overview: 'Sage is a traditional herb used for cognitive support and overall wellness.',
        traditionalUses: 'Traditionally used to support memory, cognitive function, and digestive health.',
        activeCompounds: 'Contains rosmarinic acid, salvianolic acid, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for cognitive function and oral health.',
        safety: 'Generally safe in culinary amounts. High doses should be used with caution.'
    },
    'turmeric': {
        name: 'Turmeric',
        scientificName: 'Curcuma longa',
        overview: 'Turmeric is a popular spice traditionally used for anti-inflammatory and antioxidant support.',
        traditionalUses: 'Traditionally used to support joint health, digestive wellness, and overall vitality.',
        activeCompounds: 'Contains curcumin, turmerones, and other bioactive compounds.',
        potentialBenefits: 'Research suggests potential benefits for inflammation management and joint health.',
        safety: 'Generally safe in food amounts. High doses may interact with certain medications.'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('nav--open');
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('nav--open');
                document.body.style.overflow = '';
            });
        });
    }

    var herbSlug = null;
    var path = window.location.pathname.replace(/\/$/, '');
    var pathParts = path.split('/');
    var herbsIndex = pathParts.indexOf('herbs');
    if (herbsIndex !== -1 && pathParts.length > herbsIndex + 1) {
        herbSlug = pathParts[herbsIndex + 1];
    }
    if (!herbSlug) {
        var urlParams = new URLSearchParams(window.location.search);
        herbSlug = urlParams.get('herb');
    }

    var isSubdir = window.location.pathname.indexOf('/herbs/') !== -1;
    var dirPrefix = isSubdir ? '../' : '';

    const contentDiv = document.getElementById('herb-content');

    if (!herbSlug || !herbData[herbSlug]) {
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h1>Herb Not Found</h1>
                <p style="color: var(--secondary-text); margin: 1rem 0 2rem 0;">The herb you're looking for doesn't exist or hasn't been added yet.</p>
                <a href="../herb-directory/" style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--primary-green); color: white; text-decoration: none; border-radius: 4px;">Back to Herb Directory</a>
            </div>
        `;
        document.title = 'Herb Not Found | herbcraft.app';
        return;
    }

    const herb = herbData[herbSlug];
    document.title = `${herb.name} | herbcraft.app`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `${herb.name} - Educational research on ${herb.name.toLowerCase()} including uses, benefits, and safety information.`);
    }

    contentDiv.innerHTML = `
        <header class="herb-header">
            <h1>${herb.name}</h1>
            <p class="herb-scientific-name"><em>${herb.scientificName}</em></p>
        </header>

        <section class="herb-content">
            <h2>Overview</h2>
            <p>${herb.overview}</p>

            <h2>Traditional Uses</h2>
            <p>${herb.traditionalUses}</p>

            <h2>Active Compounds</h2>
            <p>${herb.activeCompounds}</p>

            <h2>Potential Benefits</h2>
            <p>${herb.potentialBenefits}</p>

            <h2>Safety & Side Effects</h2>
            <p>${herb.safety}</p>

            <div class="when-to-see-doctor">
                <h3>When to See a Doctor</h3>
                <p><strong>Seek immediate medical attention if you experience:</strong></p>
                <ul>
                    <li>Severe allergic reactions (difficulty breathing, swelling of face or throat, severe rash)</li>
                    <li>Chest pain or irregular heartbeat</li>
                    <li>Severe digestive issues (persistent vomiting, bloody stools)</li>
                    <li>Severe headache or dizziness</li>
                    <li>Any symptoms that worsen or do not improve</li>
                </ul>
                <p><strong>Always consult a healthcare professional before using herbal supplements if you:</strong></p>
                <ul>
                    <li>Are pregnant, nursing, or planning to become pregnant</li>
                    <li>Are taking prescription medications</li>
                    <li>Have a chronic health condition</li>
                    <li>Are scheduled for surgery</li>
                    <li>Are giving herbs to children</li>
                </ul>
            </div>
        </section>

        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">
            <a href="../herb-directory/" style="display: inline-block; color: var(--primary-green); text-decoration: none;">&larr; Back to Herb Directory</a>
        </div>
    `;
});
