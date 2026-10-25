// Progressive enhancement: the complete directory remains usable without JavaScript.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const grid = document.getElementById('herb-grid');
        if (!grid) return;
        const cards = Array.from(grid.querySelectorAll('.herb-card'));
        const input = document.getElementById('directory-search');
        const form = document.getElementById('directory-search-form');
        const status = document.getElementById('search-results-message');
        const empty = document.getElementById('directory-empty');
        const buttons = document.querySelectorAll('.az-filter__button');
        const clear = document.getElementById('directory-clear');
        let letter = '';
        const normalize = value => value.trim().toLocaleLowerCase().replace(/[’']/g, '');
        input.value = new URLSearchParams(window.location.search).get('search') || '';

        function render() {
            const query = normalize(input.value);
            let count = 0;
            cards.forEach(card => {
                const name = card.dataset.name;
                const matchesQuery = normalize(name + ' ' + card.dataset.scientific).includes(query);
                card.hidden = !matchesQuery || (letter !== '' && !name.toUpperCase().startsWith(letter));
                if (!card.hidden) count++;
            });
            // Query text must never be interpreted as HTML.
            status.textContent = count + ' herb profile' + (count === 1 ? '' : 's') +
                (query ? ' matching “' + input.value.trim() + '”' : '') +
                (letter ? ' beginning with ' + letter : '');
            empty.hidden = count !== 0;
            clear.hidden = !query && !letter;
            buttons.forEach(button => {
                const active = button.dataset.letter === letter;
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', String(active));
            });
        }
        function saveQuery() {
            const url = new URL(window.location.href);
            if (input.value.trim()) url.searchParams.set('search', input.value.trim());
            else url.searchParams.delete('search');
            window.history.replaceState(null, '', url);
        }
        input.addEventListener('input', () => { render(); saveQuery(); });
        form.addEventListener('submit', event => { event.preventDefault(); render(); saveQuery(); });
        buttons.forEach(button => button.addEventListener('click', () => {
            letter = button.dataset.letter;
            render();
        }));
        clear.addEventListener('click', () => {
            input.value = ''; letter = ''; render(); saveQuery(); input.focus();
        });
        render();
    });
})();
