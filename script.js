var scriptEl = document.currentScript || document.querySelector('script[src*="script.js"]');
var basePath = (scriptEl && scriptEl.getAttribute('src').indexOf('../') === 0) ? '../' : '';

const herbs = [
    { name: 'Ashwagandha', url: basePath + 'herbs/ashwagandha' },
    { name: 'Basil', url: basePath + 'herbs/basil' },
    { name: 'Calendula', url: basePath + 'herbs/calendula' },
    { name: 'Chamomile', url: basePath + 'herbs/chamomile' },
    { name: 'Cinnamon', url: basePath + 'herbs/cinnamon' },
    { name: 'Dandelion', url: basePath + 'herbs/dandelion' },
    { name: 'Echinacea', url: basePath + 'herbs/echinacea' },
    { name: 'Elderberry', url: basePath + 'herbs/elderberry' },
    { name: 'Fennel', url: basePath + 'herbs/fennel' },
    { name: 'Garlic', url: basePath + 'herbs/garlic' },
    { name: 'Ginger', url: basePath + 'herbs/ginger' },
    { name: 'Ginkgo', url: basePath + 'herbs/ginkgo' },
    { name: 'Ginseng', url: basePath + 'herbs/ginseng' },
    { name: 'Lavender', url: basePath + 'herbs/lavender' },
    { name: 'Lemon Balm', url: basePath + 'herbs/lemon-balm' },
    { name: 'Licorice', url: basePath + 'herbs/licorice' },
    { name: 'Peppermint', url: basePath + 'herbs/peppermint' },
    { name: 'Rosemary', url: basePath + 'herbs/rosemary' },
    { name: 'Sage', url: basePath + 'herbs/sage' },
    { name: 'Turmeric', url: basePath + 'herbs/turmeric' }
];

document.addEventListener('DOMContentLoaded', () => {
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

    const citationLinks = document.querySelectorAll('.citation a');

    citationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                setTimeout(() => {
                    targetElement.focus({ preventScroll: true });
                }, 500);
            }
        });
    });

    const searchInput = document.getElementById('herb-search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchSubmit = document.getElementById('search-submit');

    function performSearch(query) {
        if (!query) return;
        var exactMatch = herbs.find(function(herb) {
            return herb.name.toLowerCase() === query.toLowerCase();
        });
        if (exactMatch) {
            window.location.href = exactMatch.url;
        } else {
            window.location.href = basePath + 'herb-directory/?search=' + encodeURIComponent(query);
        }
    }

    if (searchSubmit) {
        searchSubmit.addEventListener('click', function() {
            performSearch(searchInput ? searchInput.value.trim() : '');
        });
    }

    if (searchInput && searchDropdown) {
        let selectedIndex = -1;
        let currentMatches = [];
        const searchWrapper = searchInput.closest('.search-bar__input-wrapper') || searchInput.parentElement;

        function renderDropdown(matches) {
            currentMatches = matches;
            selectedIndex = -1;
            if (matches.length > 0) {
                searchDropdown.innerHTML = matches.map((herb, i) =>
                    `<a href="${herb.url}" id="search-item-${i}" class="search-dropdown__item">${herb.name}</a>`
                ).join('');
                searchDropdown.hidden = false;
            } else {
                searchDropdown.innerHTML = '<div class="search-dropdown__no-results">No herbs found</div>';
                searchDropdown.hidden = false;
            }
        }

        function updateSelection() {
            const items = searchDropdown.querySelectorAll('.search-dropdown__item');
            items.forEach((item, i) => {
                if (i === selectedIndex) {
                    item.classList.add('search-dropdown__item--selected');
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.classList.remove('search-dropdown__item--selected');
                }
            });
        }

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (query.length === 0) {
                currentMatches = [];
                selectedIndex = -1;
                searchDropdown.innerHTML = '';
                searchDropdown.hidden = true;
                return;
            }
            const matches = herbs.filter(herb => herb.name.toLowerCase().includes(query));
            renderDropdown(matches);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentMatches.length === 0) return;
                if (searchDropdown.hidden) searchDropdown.hidden = false;
                selectedIndex = (selectedIndex + 1) % currentMatches.length;
                updateSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentMatches.length === 0) return;
                if (searchDropdown.hidden) searchDropdown.hidden = false;
                selectedIndex = selectedIndex <= 0 ? currentMatches.length - 1 : selectedIndex - 1;
                updateSelection();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && currentMatches[selectedIndex]) {
                    window.location.href = currentMatches[selectedIndex].url;
                } else {
                    performSearch(searchInput.value.trim());
                }
            } else if (e.key === 'Escape') {
                currentMatches = [];
                selectedIndex = -1;
                searchDropdown.innerHTML = '';
                searchDropdown.hidden = true;
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchWrapper.contains(e.target)) {
                currentMatches = [];
                selectedIndex = -1;
                searchDropdown.innerHTML = '';
                searchDropdown.hidden = true;
            }
        });
    }
});