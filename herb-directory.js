const herbs = [
    { name: 'Ashwagandha', url: 'herb-detail.html?herb=ashwagandha' },
    { name: 'Basil', url: 'herb-detail.html?herb=basil' },
    { name: 'Calendula', url: 'herb-detail.html?herb=calendula' },
    { name: 'Chamomile', url: 'herb-detail.html?herb=chamomile' },
    { name: 'Cinnamon', url: 'herb-detail.html?herb=cinnamon' },
    { name: 'Dandelion', url: 'herb-detail.html?herb=dandelion' },
    { name: 'Echinacea', url: 'herb-detail.html?herb=echinacea' },
    { name: 'Elderberry', url: 'herb-detail.html?herb=elderberry' },
    { name: 'Fennel', url: 'herb-detail.html?herb=fennel' },
    { name: 'Garlic', url: 'herb-detail.html?herb=garlic' },
    { name: 'Ginger', url: 'herb-detail.html?herb=ginger' },
    { name: 'Ginkgo', url: 'herb-detail.html?herb=ginkgo' },
    { name: 'Ginseng', url: 'herb-detail.html?herb=ginseng' },
    { name: 'Lavender', url: 'herb-detail.html?herb=lavender' },
    { name: 'Lemon Balm', url: 'herb-detail.html?herb=lemon-balm' },
    { name: 'Licorice', url: 'herb-detail.html?herb=licorice' },
    { name: 'Peppermint', url: 'herb-detail.html?herb=peppermint' },
    { name: 'Rosemary', url: 'herb-detail.html?herb=rosemary' },
    { name: 'Sage', url: 'herb-detail.html?herb=sage' },
    { name: 'Turmeric', url: 'herb-detail.html?herb=turmeric' }
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
