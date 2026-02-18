const herbs = [
    { name: 'Ashwagandha', url: 'herb-directory.html' },
    { name: 'Basil', url: 'herb-directory.html' },
    { name: 'Calendula', url: 'herb-directory.html' },
    { name: 'Chamomile', url: 'herb-directory.html' },
    { name: 'Cinnamon', url: 'herb-directory.html' },
    { name: 'Dandelion', url: 'herb-directory.html' },
    { name: 'Echinacea', url: 'herb-directory.html' },
    { name: 'Elderberry', url: 'herb-directory.html' },
    { name: 'Fennel', url: 'herb-directory.html' },
    { name: 'Garlic', url: 'herb-directory.html' },
    { name: 'Ginger', url: 'herb-directory.html' },
    { name: 'Ginkgo', url: 'herb-directory.html' },
    { name: 'Ginseng', url: 'herb-directory.html' },
    { name: 'Lavender', url: 'herb-directory.html' },
    { name: 'Lemon Balm', url: 'herb-directory.html' },
    { name: 'Licorice', url: 'herb-directory.html' },
    { name: 'Peppermint', url: 'herb-directory.html' },
    { name: 'Rosemary', url: 'herb-directory.html' },
    { name: 'Sage', url: 'herb-directory.html' },
    { name: 'Turmeric', url: 'herb-directory.html' }
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

    if (searchInput && searchDropdown) {
        let selectedIndex = -1;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            selectedIndex = -1;

            if (query.length === 0) {
                searchDropdown.innerHTML = '';
                searchDropdown.hidden = true;
                return;
            }

            const matches = herbs.filter(herb =>
                herb.name.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                searchDropdown.innerHTML = matches.map((herb, index) =>
                    `<a href="${herb.url}" class="search-dropdown__item" data-index="${index}">${herb.name}</a>`
                ).join('');
                searchDropdown.hidden = false;
            } else {
                searchDropdown.innerHTML = '<div class="search-dropdown__no-results">No herbs found</div>';
                searchDropdown.hidden = false;
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            const items = searchDropdown.querySelectorAll('.search-dropdown__item');

            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
                updateSelection(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    items[selectedIndex].click();
                }
            } else if (e.key === 'Escape') {
                searchDropdown.innerHTML = '';
                searchDropdown.hidden = true;
                selectedIndex = -1;
            }
        });

        function updateSelection(items) {
            items.forEach((item, index) => {
                if (index === selectedIndex) {
                    item.classList.add('search-dropdown__item--selected');
                } else {
                    item.classList.remove('search-dropdown__item--selected');
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.innerHTML = '';
                searchDropdown.hidden = true;
                selectedIndex = -1;
            }
        });
    }
});
