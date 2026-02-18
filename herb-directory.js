const herbs = [
    { name: 'Ashwagandha', url: '/herbs/ashwagandha' },
    { name: 'Basil', url: '/herbs/basil' },
    { name: 'Calendula', url: '/herbs/calendula' },
    { name: 'Chamomile', url: '/herbs/chamomile' },
    { name: 'Cinnamon', url: '/herbs/cinnamon' },
    { name: 'Dandelion', url: '/herbs/dandelion' },
    { name: 'Echinacea', url: '/herbs/echinacea' },
    { name: 'Elderberry', url: '/herbs/elderberry' },
    { name: 'Fennel', url: '/herbs/fennel' },
    { name: 'Garlic', url: '/herbs/garlic' },
    { name: 'Ginger', url: '/herbs/ginger' },
    { name: 'Ginkgo', url: '/herbs/ginkgo' },
    { name: 'Ginseng', url: '/herbs/ginseng' },
    { name: 'Lavender', url: '/herbs/lavender' },
    { name: 'Lemon Balm', url: '/herbs/lemon-balm' },
    { name: 'Licorice', url: '/herbs/licorice' },
    { name: 'Peppermint', url: '/herbs/peppermint' },
    { name: 'Rosemary', url: '/herbs/rosemary' },
    { name: 'Sage', url: '/herbs/sage' },
    { name: 'Turmeric', url: '/herbs/turmeric' }
];

function renderHerbs(filterLetter) {
    const grid = document.getElementById('herb-grid');
    const template = document.getElementById('herb-card-template');
    
    grid.innerHTML = '';
    
    const filteredHerbs = filterLetter 
        ? herbs.filter(herb => herb.name.charAt(0).toUpperCase() === filterLetter.toUpperCase())
        : herbs;
    
    filteredHerbs.forEach(herb => {
        const card = template.content.cloneNode(true);
        const link = card.querySelector('.herb-card');
        const name = card.querySelector('.herb-card__name');
        
        link.href = herb.url;
        name.textContent = herb.name;
        
        grid.appendChild(card);
    });
    
    if (filteredHerbs.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--secondary-text); padding: var(--spacing-xl);">No herbs found starting with "' + filterLetter + '"</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.az-filter__button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');
            
            const letter = this.getAttribute('data-letter');
            renderHerbs(letter);
        });
    });
    
    renderHerbs(null);
});
