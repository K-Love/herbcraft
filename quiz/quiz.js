// HerbCraft Herb Finder Quiz
// Loads herbs.json and scores each herb against quiz answers

const QUESTIONS = [
  {
    id: 'goal',
    text: "What's your primary wellness goal?",
    options: [
      { label: 'Sleep & Relaxation', value: 'sleep' },
      { label: 'Stress & Anxiety', value: 'stress' },
      { label: 'Energy & Focus', value: 'energy' },
      { label: 'Digestion', value: 'digestion' },
      { label: 'Immune Support', value: 'immune' },
      { label: 'Pain & Inflammation', value: 'pain' },
      { label: "Women's Health", value: 'womens' },
      { label: "Men's Health", value: 'mens' }
    ]
  },
  {
    id: 'form',
    text: 'Do you prefer supplements or teas?',
    options: [
      { label: 'Supplements (capsules/tablets)', value: 'supplements' },
      { label: 'Teas & infusions', value: 'teas' },
      { label: 'Either works for me', value: 'either' }
    ]
  },
  {
    id: 'sensitivity',
    text: 'Any sensitivities or special considerations?',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Pregnant or nursing', value: 'pregnant' },
      { label: 'On blood thinners', value: 'blood_thinners' },
      { label: 'Liver concerns', value: 'liver' }
    ]
  },
  {
    id: 'speed',
    text: 'How quickly do you want to notice results?',
    options: [
      { label: 'Fast-acting (same day)', value: 'fast' },
      { label: 'Gradual over weeks', value: 'gradual' },
      { label: "Don't mind either way", value: 'any' }
    ]
  },
  {
    id: 'experience',
    text: 'What is your experience level with herbs?',
    options: [
      { label: 'Beginner — just starting out', value: 'beginner' },
      { label: 'Some experience', value: 'intermediate' },
      { label: 'Advanced — familiar with many herbs', value: 'advanced' }
    ]
  }
];

// Category → goal mapping
const GOAL_CATEGORY_MAP = {
  sleep:     ['Sleep & Relaxation', 'Calming & Sleep', 'Nervine & Cognitive Support', 'Anxiety Relief & Relaxation', 'Nervine and Anxiety Relief'],
  stress:    ['Stress & Adaptogen', 'Adaptogen & Stress Relief', 'Adaptogen and Energy', 'Adaptogen and Liver Support', 'Calming & Sleep', 'Emotional Support'],
  energy:    ['Energy & Vitality', 'Adaptogen & Stress Relief', 'Adaptogen and Energy', 'Nootropic & Culinary', 'Cognitive & Neurological Health', 'Cognitive & Skin Health'],
  digestion: ['Digestive Health', 'Digestive & Anti-inflammatory', 'Digestive & Reproductive Health', 'Gastrointestinal & Respiratory', 'Digestive and Throat Soothing', 'Liver & Digestive Support'],
  immune:    ['Immune Support', 'Immune Support & Anti-inflammatory'],
  pain:      ['Anti-inflammatory', 'Pain Relief & Circulatory Health', 'Pain Relief & Anti-inflammatory', 'Anti-inflammatory & Joint Health'],
  womens:    ["Women's Health & Menopause", "Women's Health & Blood Tonic", 'Cognitive & Menopausal Support', 'Digestive & Reproductive Health'],
  mens:      ['Athletic Performance and Men Health', 'Prostate and Men Health']
};

// Herbs to avoid for each sensitivity (by herb id)
const SENSITIVITY_EXCLUSIONS = {
  pregnant: ['kava', 'dong-quai', 'motherwort', 'black-cohosh', 'feverfew', 'sage', 'fennel', 'ashwagandha', 'cats-claw', 'tribulus'],
  blood_thinners: ['ginkgo', 'garlic', 'dong-quai', 'feverfew', 'cayenne', 'white-willow-bark', 'ginger', 'ginseng', 'holy-basil'],
  liver: ['kava', 'black-cohosh', 'gotu-kola', 'skullcap']
};

// Fast-acting herbs (tend to work quickly)
const FAST_ACTING = ['valerian', 'kava', 'passionflower', 'chamomile', 'lavender', 'peppermint', 'ginger', 'cayenne', 'lemon-balm', 'hops'];

// Beginner-friendly herbs (gentle, well-studied)
const BEGINNER_FRIENDLY = ['chamomile', 'ginger', 'peppermint', 'lavender', 'echinacea', 'elderberry', 'turmeric', 'garlic', 'lemon-balm', 'rosemary', 'dandelion', 'calendula', 'fennel', 'cinnamon'];

// Tea-friendly herbs
const TEA_FRIENDLY = ['chamomile', 'peppermint', 'ginger', 'lavender', 'lemon-balm', 'nettle', 'dandelion', 'rosemary', 'sage', 'fennel', 'holy-basil', 'passionflower', 'hops', 'marshmallow-root', 'slippery-elm', 'mullein', 'skullcap', 'motherwort', 'hawthorn', 'elderberry'];

let herbs = [];
let answers = {};
let currentQ = 0;

async function loadHerbs() {
  try {
    const res = await fetch('../herbs.json');
    herbs = await res.json();
  } catch (e) {
    console.error('Failed to load herbs.json', e);
    herbs = [];
  }
}

function scoreHerb(herb, ans) {
  let score = 0;

  // 1. Goal match (highest weight)
  const goalCategories = GOAL_CATEGORY_MAP[ans.goal] || [];
  if (goalCategories.some(cat => herb.category && herb.category.includes(cat.split(' ')[0]))) {
    score += 10;
  }
  // Also check if herb category exactly matches any goal category
  if (goalCategories.includes(herb.category)) {
    score += 5;
  }

  // 2. Form preference
  if (ans.form === 'teas' && TEA_FRIENDLY.includes(herb.id)) score += 3;
  if (ans.form === 'supplements') score += 1; // most herbs available as supplements
  if (ans.form === 'either') score += 1;

  // 3. Speed preference
  if (ans.speed === 'fast' && FAST_ACTING.includes(herb.id)) score += 3;
  if (ans.speed === 'gradual' && !FAST_ACTING.includes(herb.id)) score += 2;
  if (ans.speed === 'any') score += 1;

  // 4. Experience level
  if (ans.experience === 'beginner' && BEGINNER_FRIENDLY.includes(herb.id)) score += 3;
  if (ans.experience === 'intermediate') score += 1;
  if (ans.experience === 'advanced') score += 1;

  return score;
}

function getResults() {
  const excluded = SENSITIVITY_EXCLUSIONS[answers.sensitivity] || [];
  const eligible = herbs.filter(h => !excluded.includes(h.id));

  const scored = eligible.map(h => ({ herb: h, score: scoreHerb(h, answers) }));
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map(s => s.herb);
}

function renderQuestion() {
  const q = QUESTIONS[currentQ];
  const total = QUESTIONS.length;
  const pct = Math.round(((currentQ + 1) / total) * 100);

  document.getElementById('progress-label').textContent = `Question ${currentQ + 1} of ${total}`;
  document.getElementById('progress-pct').textContent = `${pct}%`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('question-number').textContent = `Question ${currentQ + 1}`;
  document.getElementById('question-text').textContent = q.text;

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (answers[q.id] === opt.value ? ' selected' : '');
    btn.textContent = opt.label;
    btn.addEventListener('click', () => selectOption(q.id, opt.value));
    grid.appendChild(btn);
  });

  const backBtn = document.getElementById('btn-back');
  backBtn.style.visibility = currentQ === 0 ? 'hidden' : 'visible';

  const nextBtn = document.getElementById('btn-next');
  nextBtn.textContent = currentQ === total - 1 ? 'See My Results' : 'Next \u2192';
  nextBtn.disabled = !answers[q.id];
}

function selectOption(qId, value) {
  answers[qId] = value;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.textContent === QUESTIONS[currentQ].options.find(o => o.value === value).label);
  });
  document.getElementById('btn-next').disabled = false;
}

function showResults() {
  document.getElementById('quiz-section').style.display = 'none';
  const resultsSection = document.getElementById('results-section');
  resultsSection.classList.add('visible');

  const top3 = getResults();
  const container = document.getElementById('results-cards');
  container.innerHTML = '';

  const ranks = ['Top Match', '2nd Match', '3rd Match'];
  top3.forEach((herb, i) => {
    const overview = herb.overview ? herb.overview.split('. ').slice(0, 2).join('. ') + '.' : '';
    const safetySnippet = herb.safety_info ? herb.safety_info.split('. ').slice(0, 2).join('. ') + '.' : '';
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(herb.amazon_search_term || herb.name)}&tag=herbcraft0a-20`;

    const card = document.createElement('div');
    card.className = 'herb-result-card';
    card.innerHTML = `
      <div class="herb-result-card__header">
        <div class="herb-result-card__name">${herb.name}</div>
        <div class="herb-result-card__rank">${ranks[i]}</div>
      </div>
      <div class="herb-result-card__overview">${overview}</div>
      ${safetySnippet ? `<div class="herb-result-card__safety"><strong>Safety note:</strong> ${safetySnippet}</div>` : ''}
      <a href="${amazonUrl}" class="herb-result-card__cta" target="_blank" rel="noopener noreferrer sponsored">Shop on Amazon &#8599;</a>
    `;
    container.appendChild(card);
  });
}

function resetQuiz() {
  answers = {};
  currentQ = 0;
  document.getElementById('quiz-section').style.display = 'block';
  document.getElementById('results-section').classList.remove('visible');
  renderQuestion();
}

// Event listeners
document.getElementById('btn-next').addEventListener('click', () => {
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    showResults();
  }
});

document.getElementById('btn-back').addEventListener('click', () => {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
});

document.getElementById('btn-retake').addEventListener('click', resetQuiz);

// Init
loadHerbs().then(() => renderQuestion());
