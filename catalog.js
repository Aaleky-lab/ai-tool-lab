(() => {
  'use strict';

  const form = document.getElementById('catalog-filters');
  const search = document.getElementById('tool-search');
  const category = document.getElementById('tool-category');
  const access = document.getElementById('tool-access');
  const grid = document.getElementById('tool-grid');
  const count = document.getElementById('results-count');
  const empty = document.getElementById('no-results');
  const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const accessLabels = { free: 'Free access available', trial: 'Paid / trial available', unknown: 'Check current plans' };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  // Create each card once; filtering only toggles its visibility.
  const entries = window.aiTools.map(tool => {
    const card = element('a', 'tool-card', '');
    card.href = 'tool.html?tool=' + encodeURIComponent(tool.id);
    card.setAttribute('aria-label', 'View ' + tool.name + ' overview');
    const top = element('div', 'tool-card-top', '');
    const rating = element('span', 'rating', '★'.repeat(tool.rating) + '☆'.repeat(5 - tool.rating));
    rating.setAttribute('aria-label', tool.rating + ' out of 5 stars');
    top.append(element('span', 'tool-monogram', tool.short), rating);
    const tags = element('div', 'tags', '');
    for (const tag of tool.category.split(' / ')) tags.append(element('span', 'tag', tag));
    tags.append(element('span', 'tag access-tag', accessLabels[tool.access]));
    card.append(top, element('h3', '', tool.name), element('p', '', tool.description), tags);
    grid.append(card);
    return {
      tool, card,
      text: normalize([tool.name, tool.description, tool.category, tool.bestFor, ...tool.categories, ...(tool.tags || [])].join(' '))
    };
  });
  document.getElementById('tool-count').textContent = entries.length;

  function render() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const entry of entries) {
      const matches = terms.every(term => entry.text.includes(term))
        && (!category.value || entry.tool.categories.includes(category.value))
        && (!access.value || entry.tool.access === access.value);
      entry.card.hidden = !matches;
      if (matches) visible++;
    }
    count.textContent = visible + ' of ' + entries.length + ' tools';
    empty.hidden = visible !== 0;
  }

  form.addEventListener('submit', event => event.preventDefault());
  search.addEventListener('input', render);
  category.addEventListener('change', render);
  access.addEventListener('change', render);
  form.addEventListener('reset', () => {
    // Reset values explicitly before rendering (native reset runs after this event).
    search.value = '';
    category.value = '';
    access.value = '';
    render();
    search.focus();
  });
  window.addEventListener('pageshow', render);
  render();
})();
