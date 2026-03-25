const safetyData = {
    'Ginger': [
        { 
            snippet: 'May interact with blood-thinning medications.', 
            source: 'NCCIH' 
        },
        { 
            snippet: 'Generally recognized as safe (GRAS) by the FDA for culinary use.', 
            source: 'FDA' 
        },
        {
            snippet: 'May cause mild heartburn, diarrhea, or stomach upset in some people.',
            source: 'NIH'
        }
    ],
    'Echinacea': [
        {
            snippet: 'May cause allergic reactions in people who are allergic to plants in the daisy family.',
            source: 'NCCIH'
        },
        {
            snippet: 'Not recommended for people with autoimmune disorders or those taking immunosuppressants.',
            source: 'Mayo Clinic'
        },
        {
            snippet: 'Generally well-tolerated for short-term use (up to 10 days).',
            source: 'NIH'
        }
    ],
    'Turmeric': [
        {
            snippet: 'May interact with blood-thinning medications and increase bleeding risk.',
            source: 'NCCIH'
        },
        {
            snippet: 'High doses may cause gastrointestinal upset.',
            source: 'NIH'
        },
        {
            snippet: 'Generally recognized as safe when used as a spice in food.',
            source: 'FDA'
        }
    ],
    'Chamomile': [
        {
            snippet: 'May cause allergic reactions in people sensitive to plants in the daisy family.',
            source: 'NCCIH'
        },
        {
            snippet: 'May interact with blood-thinning medications and sedatives.',
            source: 'NIH'
        },
        {
            snippet: 'Generally recognized as safe for most adults when consumed in moderate amounts.',
            source: 'FDA'
        }
    ],
    'Peppermint': [
        {
            snippet: 'Peppermint oil should not be used on the face or chest of infants or young children.',
            source: 'NCCIH'
        },
        {
            snippet: 'May worsen symptoms of gastroesophageal reflux disease (GERD).',
            source: 'Mayo Clinic'
        },
        {
            snippet: 'Generally recognized as safe when used in amounts commonly found in foods.',
            source: 'FDA'
        }
    ],
    'St. John\'s Wort': [
        {
            snippet: 'Can interact with many medications, including antidepressants, birth control pills, and blood thinners.',
            source: 'NCCIH'
        },
        {
            snippet: 'May cause increased sensitivity to sunlight.',
            source: 'NIH'
        },
        {
            snippet: 'Not recommended during pregnancy or while breastfeeding.',
            source: 'FDA'
        }
    ],
    'Lavender': [
        {
            snippet: 'Generally considered safe when used in small amounts in food or aromatherapy.',
            source: 'NCCIH'
        },
        {
            snippet: 'May cause skin irritation in some people when applied topically.',
            source: 'NIH'
        },
        {
            snippet: 'May cause drowsiness when taken orally; avoid driving after use.',
            source: 'Mayo Clinic'
        }
    ],
    'Garlic': [
        {
            snippet: 'May increase bleeding risk, especially when combined with blood-thinning medications.',
            source: 'NCCIH'
        },
        {
            snippet: 'May cause bad breath, body odor, and gastrointestinal upset.',
            source: 'NIH'
        },
        {
            snippet: 'Generally recognized as safe when used as food.',
            source: 'FDA'
        }
    ]
};

const searchForm = document.getElementById('safety-search-form');
const searchInput = document.getElementById('herb-safety-search');
const resultsContainer = document.getElementById('safety-results');

function normalizeHerbName(name) {
    return name.trim().toLowerCase();
}

function findHerbData(searchTerm) {
    const normalized = normalizeHerbName(searchTerm);
    
    for (const [herbName, data] of Object.entries(safetyData)) {
        if (normalizeHerbName(herbName) === normalized) {
            return { name: herbName, data: data };
        }
    }
    return null;
}

function displayResults(herbName, safetyNotes) {
    resultsContainer.innerHTML = '';
    
    const resultHeader = document.createElement('h2');
    resultHeader.className = 'safety-results__title';
    resultHeader.textContent = `Safety Notes for ${herbName}`;
    resultsContainer.appendChild(resultHeader);
    
    safetyNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'safety-note-card';
        
        const noteText = document.createElement('blockquote');
        noteText.className = 'safety-note-card__text';
        noteText.textContent = note.snippet;
        
        const noteSource = document.createElement('cite');
        noteSource.className = 'safety-note-card__source';
        noteSource.textContent = `Source: ${note.source}`;
        
        noteCard.appendChild(noteText);
        noteCard.appendChild(noteSource);
        resultsContainer.appendChild(noteCard);
    });
}

function displayNoResults(searchTerm) {
    resultsContainer.innerHTML = '';
    
    const message = document.createElement('div');
    message.className = 'safety-results__message';
    message.textContent = `No safety notes for "${searchTerm}" were found in our aggregated data.`;
    resultsContainer.appendChild(message);
}

function handleSearch(event) {
    event.preventDefault();
    
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const result = findHerbData(searchTerm);
    
    if (result) {
        displayResults(result.name, result.data);
    } else {
        displayNoResults(searchTerm);
    }
}

searchForm.addEventListener('submit', handleSearch);

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const result = findHerbData(searchTerm);
    
    if (result) {
        displayResults(result.name, result.data);
    } else {
        displayNoResults(searchTerm);
    }
});

const menuToggle = document.querySelector('.header__menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('nav--active');
    });
}
