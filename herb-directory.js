const herbs = [
    { name: 'Ashwagandha', url: '../herbs/ashwagandha' },
    { name: 'Basil', url: '../herbs/basil' },
    { name: 'Calendula', url: '../herbs/calendula' },
    { name: 'Chamomile', url: '../herbs/chamomile' },
    { name: 'Cinnamon', url: '../herbs/cinnamon' },
    { name: 'Dandelion', url: '../herbs/dandelion' },
    { name: 'Echinacea', url: '../herbs/echinacea' },
    { name: 'Elderberry', url: '../herbs/elderberry' },
    { name: 'Fennel', url: '../herbs/fennel' },
    { name: 'Garlic', url: '../herbs/garlic' },
    { name: 'Ginger', url: '../herbs/ginger' },
    { name: 'Ginkgo', url: '../herbs/ginkgo' },
    { name: 'Ginseng', url: '../herbs/ginseng' },
    { name: 'Lavender', url: '../herbs/lavender' },
    { name: 'Lemon Balm', url: '../herbs/lemon-balm' },
    { name: 'Licorice', url: '../herbs/licorice' },
    { name: 'Peppermint', url: '../herbs/peppermint' },
    { name: 'Rosemary', url: '../herbs/rosemary' },
    { name: 'Sage', url: '../herbs/sage' },
    { name: 'Turmeric', url: '../herbs/turmeric' }
];

function getSearchQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
}

function renderHerbs(filterLetter, searchQuery) {
    var grid = document.getElementById('herb-grid');
    var template = document.getElementById('herb-card-template');
    var resultsMsg = document.getElementById('search-results-message');

    grid.innerHTML = '';

    var filteredHerbs = herbs;

    if (searchQuery) {
        var q = searchQuery.toLowerCase();
        filteredHerbs = filteredHerbs.filter(function(herb) {
            return herb.name.toLowerCase().includes(q);
        });
    }

    if (filterLetter) {
        filteredHerbs = filteredHerbs.filter(function(herb) {
            return herb.name.charAt(0).toUpperCase() === filterLetter.toUpperCase();
        });
    }

    if (resultsMsg) {
        if (searchQuery) {
            resultsMsg.textContent = filteredHerbs.length + ' result' + (filteredHerbs.length !== 1 ? 's' : '') + " found for '" + searchQuery + "'";
            resultsMsg.hidden = false;
        } else {
            resultsMsg.textContent = '';
            resultsMsg.hidden = true;
        }
    }

    filteredHerbs.forEach(function(herb) {
        var card = template.content.cloneNode(true);
        var link = card.querySelector('.herb-card');
        var name = card.querySelector('.herb-card__name');

        link.href = herb.url;
        name.textContent = herb.name;

        grid.appendChild(card);
    });

    if (filteredHerbs.length === 0) {
        var msg = searchQuery
            ? "No herbs found matching '" + searchQuery + "'"
            : 'No herbs found starting with "' + filterLetter + '"';
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--secondary-text); padding: var(--spacing-xl);">' + msg + '</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var filterButtons = document.querySelectorAll('.az-filter__button');
    var searchQuery = getSearchQuery();
    var activeFilter = '';

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            filterButtons.forEach(function(btn) { btn.classList.remove('active'); });
            this.classList.add('active');
            activeFilter = this.getAttribute('data-letter');
            renderHerbs(activeFilter, searchQuery);
        });
    });

    renderHerbs(activeFilter, searchQuery);
});
