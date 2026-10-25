(() => {
const herbs = window.HerbCraftSearchIndex || [];

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (menuToggle && nav) {
        nav.dataset.enhanced = 'true';
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

            menuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('nav--open');

            if (!isExpanded) {
                if (!document.body.classList.contains('discovery-page')) document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('nav--open');
                document.body.style.overflow = '';
                menuToggle.focus();
            }
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('nav--open');
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
    const searchForm = searchInput ? searchInput.closest('form') : null;

    if (searchInput && searchDropdown) {
        let selectedIndex = -1;
        let currentMatches = [];
        const searchWrapper = searchInput.closest('.search-bar__input-wrapper') || searchInput.parentElement;
        const normalize = value => value.trim().toLocaleLowerCase().replace(/[’']/g, '');
        searchInput.setAttribute('role', 'combobox');
        searchInput.setAttribute('aria-autocomplete', 'list');
        searchInput.setAttribute('aria-controls', 'search-dropdown');
        searchInput.setAttribute('aria-expanded', 'false');
        searchDropdown.setAttribute('role', 'listbox');
        searchDropdown.setAttribute('aria-label', 'Matching herbs');

        function closeDropdown() {
            currentMatches = [];
            selectedIndex = -1;
            searchDropdown.innerHTML = '';
            searchDropdown.hidden = true;
            searchInput.setAttribute('aria-expanded', 'false');
            searchInput.removeAttribute('aria-activedescendant');
        }

        function renderDropdown(matches) {
            currentMatches = matches;
            selectedIndex = -1;
            searchInput.removeAttribute('aria-activedescendant');
            searchDropdown.innerHTML = '';
            if (matches.length > 0) {
                matches.forEach(function(herb, i) {
                    const a = document.createElement('a');
                    a.href = herb.url;
                    a.id = 'search-item-' + i;
                    a.className = 'search-dropdown__item';
                    a.textContent = herb.name + ' — ' + herb.scientific;
                    a.setAttribute('role', 'option');
                    a.setAttribute('aria-selected', 'false');
                    a.tabIndex = -1;
                    a.addEventListener('pointerdown', function(e) {
                        if (e.button !== 0) return;
                        e.preventDefault();
                        window.location.href = herb.url;
                    });
                    searchDropdown.appendChild(a);
                });
                searchDropdown.hidden = false;
                searchInput.setAttribute('aria-expanded', 'true');
            } else {
                const div = document.createElement('div');
                div.className = 'search-dropdown__no-results';
                div.textContent = 'No matching profiles. Search the directory or try another name.';
                div.setAttribute('role', 'status');
                searchDropdown.appendChild(div);
                searchDropdown.hidden = false;
                searchInput.setAttribute('aria-expanded', 'true');
            }
        }

        function updateSelection() {
            const items = searchDropdown.querySelectorAll('.search-dropdown__item');
            items.forEach(function(item, i) {
                item.setAttribute('aria-selected', String(i === selectedIndex));
                if (i === selectedIndex) {
                    item.classList.add('search-dropdown__item--selected');
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.classList.remove('search-dropdown__item--selected');
                }
            });
            if (selectedIndex >= 0) searchInput.setAttribute('aria-activedescendant', 'search-item-' + selectedIndex);
            else searchInput.removeAttribute('aria-activedescendant');
        }

        searchInput.addEventListener('input', function() {
            const query = normalize(searchInput.value);
            if (query.length === 0) {
                closeDropdown();
                return;
            }
            const matches = herbs.filter(function(herb) {
                return normalize(herb.name + ' ' + herb.scientific).includes(query);
            });
            renderDropdown(matches);
        });

        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                if (currentMatches.length === 0) return;
                if (searchDropdown.hidden) searchDropdown.hidden = false;
                searchInput.setAttribute('aria-expanded', 'true');
                selectedIndex = selectedIndex < currentMatches.length - 1 ? selectedIndex + 1 : 0;
                updateSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
                if (currentMatches.length === 0) return;
                if (searchDropdown.hidden) searchDropdown.hidden = false;
                searchInput.setAttribute('aria-expanded', 'true');
                selectedIndex = selectedIndex <= 0 ? currentMatches.length - 1 : selectedIndex - 1;
                updateSelection();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                if (selectedIndex >= 0 && currentMatches[selectedIndex]) {
                    window.location.href = currentMatches[selectedIndex].url;
                } else {
                    if (searchForm) searchForm.requestSubmit();
                }
            } else if (e.key === 'Escape') {
                closeDropdown();
            }
        });

        searchInput.addEventListener('blur', closeDropdown);

        document.addEventListener('click', function(e) {
            if (!searchWrapper.contains(e.target)) {
                closeDropdown();
            }
        });
    }
});
})();
