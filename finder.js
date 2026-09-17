(() => {
  'use strict';

  const form = document.getElementById('tool-finder');
  if (!form || !window.aiTools) return;

  const steps = [...form.querySelectorAll('.finder-step')];
  const next = form.querySelector('.finder-next');
  const back = form.querySelector('.finder-back');
  const progress = document.getElementById('finder-progress-bar');
  const result = document.getElementById('finder-result');
  let step = 0;

  const creativeIds = new Set(['runway', 'leonardo', 'ideogram', 'midjourney', 'pika', 'firefly']);
  const easyIds = new Set(['canva', 'capcut', 'chatgpt', 'grammarly', 'veed']);
  const workIds = new Set(['chatgpt', 'claude', 'perplexity', 'notion-ai', 'otter']);

  function showStep(index) {
    step = index;
    steps.forEach((item, position) => { item.hidden = position !== step; });
    result.hidden = true;
    back.hidden = step === 0;
    next.textContent = step === steps.length - 1 ? 'Show my matches' : 'Next';
    progress.style.width = ((step + 1) / steps.length * 100) + '%';
  }

  function selected(name) {
    return form.querySelector(`input[name="${name}"]:checked`)?.value;
  }

  function score(tool, goal, priority, budget) {
    let value = tool.categories.includes(goal) ? 10 : 0;
    if (budget === 'free' && tool.access === 'free') value += 4;
    if (budget === 'free' && tool.access !== 'free') value -= 5;
    if (priority === 'quality') value += tool.rating;
    if (priority === 'easy' && easyIds.has(tool.id)) value += 4;
    if (priority === 'creative' && creativeIds.has(tool.id)) value += 4;
    if (priority === 'work' && workIds.has(tool.id)) value += 4;
    return value;
  }

  function renderResult() {
    const goal = selected('goal');
    const priority = selected('priority');
    const budget = selected('budget');
    const matches = [...aiTools]
      .map(tool => ({ tool, score: score(tool, goal, priority, budget) }))
      .filter(item => item.tool.categories.includes(goal))
      .sort((a, b) => b.score - a.score || b.tool.rating - a.tool.rating)
      .slice(0, 3)
      .map(item => item.tool);
    const [winner, ...alternatives] = matches;

    steps.forEach(item => { item.hidden = true; });
    result.hidden = false;
    back.hidden = false;
    next.hidden = true;
    progress.style.width = '100%';
    result.innerHTML = `<div class="eyebrow">Your strongest match</div><h3>${winner.name}</h3><p>${winner.description} Best for ${winner.bestFor.toLowerCase()}</p><div class="finder-result-links"><a class="primary-button" href="tool.html?tool=${encodeURIComponent(winner.id)}">See ${winner.name}</a>${alternatives.map(tool => `<a class="secondary-button" href="tool.html?tool=${encodeURIComponent(tool.id)}">Also ${tool.name}</a>`).join('')}</div>`;
    window.aiToolLabTrack?.('finder_result', { result: winner.id, goal, priority, budget });
  }

  next.addEventListener('click', () => {
    const current = steps[step];
    const checked = current.querySelector('input:checked');
    if (!checked) {
      current.querySelector('input')?.focus();
      current.classList.add('needs-choice');
      return;
    }
    current.classList.remove('needs-choice');
    if (step < steps.length - 1) showStep(step + 1);
    else renderResult();
  });

  back.addEventListener('click', () => {
    next.hidden = false;
    if (!result.hidden) showStep(steps.length - 1);
    else showStep(Math.max(0, step - 1));
  });

  showStep(0);
})();
