const explorerData = {
    'Calmness': [
        {
            herb: 'Lemon Balm',
            claim: 'Traditionally used to soothe tension.',
            source: 'Univ. of Maryland Medical Center'
        },
        {
            herb: 'Chamomile',
            claim: 'Commonly used for relaxation.',
            source: 'NCCIH'
        },
        {
            herb: 'Lavender',
            claim: 'Traditionally associated with promoting a sense of calm.',
            source: 'Mount Sinai Health System'
        }
    ],
    'Digestion': [
        {
            herb: 'Ginger',
            claim: 'Traditionally used to support digestive comfort.',
            source: 'NCCIH'
        },
        {
            herb: 'Peppermint',
            claim: 'Commonly used for digestive wellness.',
            source: 'Univ. of Maryland Medical Center'
        },
        {
            herb: 'Fennel',
            claim: 'Traditionally used to support digestive function.',
            source: 'Memorial Sloan Kettering Cancer Center'
        }
    ],
    'Energy': [
        {
            herb: 'Ginseng',
            claim: 'Traditionally used to support vitality.',
            source: 'NCCIH'
        },
        {
            herb: 'Rhodiola',
            claim: 'Traditionally used to support physical performance.',
            source: 'Mount Sinai Health System'
        },
        {
            herb: 'Green Tea',
            claim: 'Contains natural compounds associated with alertness.',
            source: 'NIH Office of Dietary Supplements'
        }
    ],
    'Sleep Support': [
        {
            herb: 'Valerian Root',
            claim: 'Traditionally used to support restful sleep.',
            source: 'NCCIH'
        },
        {
            herb: 'Passionflower',
            claim: 'Traditionally associated with promoting relaxation before sleep.',
            source: 'Univ. of Maryland Medical Center'
        },
        {
            herb: 'Chamomile',
            claim: 'Commonly used to support bedtime routines.',
            source: 'Memorial Sloan Kettering Cancer Center'
        }
    ]
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

        document.addEventListener('click', (e) => {
            const isClickInsideNav = nav.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);
            const isNavOpen = nav.classList.contains('nav--open');

            if (!isClickInsideNav && !isClickOnToggle && isNavOpen) {
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('nav--open');
                document.body.style.overflow = '';
            }
        });
    }

    const conceptSelect = document.getElementById('concept-select');
    const resultsContainer = document.getElementById('explorer-results');

    conceptSelect.addEventListener('change', function() {
        const selectedConcept = this.value;

        resultsContainer.innerHTML = '';

        if (!selectedConcept) {
            return;
        }

        const results = explorerData[selectedConcept];

        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<div class="explorer-results__message">No results found for this concept.</div>';
            return;
        }

        results.forEach(function(item) {
            const resultItem = document.createElement('div');
            resultItem.className = 'explorer-result-item';

            const herbName = document.createElement('h3');
            herbName.className = 'explorer-result-item__name';
            herbName.textContent = item.herb;

            const claim = document.createElement('p');
            claim.className = 'explorer-result-item__claim';
            claim.textContent = item.claim;

            const source = document.createElement('p');
            source.className = 'explorer-result-item__source';
            source.textContent = item.source;

            resultItem.appendChild(herbName);
            resultItem.appendChild(claim);
            resultItem.appendChild(source);

            resultsContainer.appendChild(resultItem);
        });
    });
});
