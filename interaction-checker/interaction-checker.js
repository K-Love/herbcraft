// HerbCraft Herb Interaction Checker
// Static interaction database + dynamic herb list from herbs.json

// ─── Interaction Database ────────────────────────────────────────────────────
// Keys are sorted herb IDs joined by '|'. Each entry has severity and description.
const INTERACTIONS = {
  // Herb-herb interactions
  'kava|valerian': {
    severity: 'moderate',
    pair: 'Valerian Root + Kava',
    description: 'Both herbs have sedative properties. Combining them may produce additive CNS depression, leading to excessive drowsiness, impaired coordination, or over-sedation.',
    consult: 'Consult your doctor before combining these herbs, especially if you drive or operate machinery.'
  },
  'kava|hops': {
    severity: 'moderate',
    pair: 'Kava + Hops',
    description: 'Both are sedative herbs. Combined use may amplify drowsiness and CNS depressant effects beyond what either herb produces alone.',
    consult: 'Consult your doctor before combining sedative herbs.'
  },
  'kava|passionflower': {
    severity: 'moderate',
    pair: 'Kava + Passionflower',
    description: 'Additive sedative effects possible. Both herbs act on GABA receptors and may cause excessive drowsiness when combined.',
    consult: 'Consult your doctor before combining sedative herbs.'
  },
  'kava|lemon-balm': {
    severity: 'moderate',
    pair: 'Kava + Lemon Balm',
    description: 'Lemon balm has mild sedative properties; combining with kava may increase sedation. Kava also carries hepatotoxicity risk that may be compounded by other herbs.',
    consult: 'Consult your doctor, especially if you have liver concerns.'
  },
  'kava|valerian|hops': {
    severity: 'high',
    pair: 'Kava + Valerian + Hops',
    description: 'Triple combination of sedative herbs carries significant risk of excessive CNS depression.',
    consult: 'Avoid this combination without direct medical supervision.'
  },
  'black-cohosh|dong-quai': {
    severity: 'moderate',
    pair: 'Black Cohosh + Dong Quai',
    description: 'Both herbs have estrogenic or hormone-modulating activity. Combined use may produce additive hormonal effects, particularly relevant for women with hormone-sensitive conditions.',
    consult: 'Consult your doctor if you have hormone-sensitive conditions or are on hormone therapy.'
  },
  'black-cohosh|st-johns-wort': {
    severity: 'moderate',
    pair: 'Black Cohosh + St. John\'s Wort',
    description: 'St. John\'s Wort is a potent CYP450 inducer that may alter the metabolism of black cohosh and reduce its effectiveness or change its safety profile.',
    consult: 'Consult your doctor before combining these herbs.'
  },
  'echinacea|cats-claw': {
    severity: 'moderate',
    pair: 'Echinacea + Cat\'s Claw',
    description: 'Both herbs stimulate immune function. Combined use may overstimulate the immune system, which could be problematic for people with autoimmune conditions.',
    consult: 'Consult your doctor if you have an autoimmune condition or take immunosuppressant medications.'
  },
  'ginseng|rhodiola': {
    severity: 'moderate',
    pair: 'Ginseng + Rhodiola',
    description: 'Both are stimulating adaptogens. Combining them may cause overstimulation, increased heart rate, anxiety, or insomnia, particularly in sensitive individuals.',
    consult: 'Start with low doses and consult your doctor if you have cardiovascular concerns.'
  },
  'ginseng|ashwagandha': {
    severity: 'moderate',
    pair: 'Ginseng + Ashwagandha',
    description: 'Both are adaptogens with stimulating properties. Combined use may cause overstimulation in some individuals. Effects may vary depending on the type of ginseng used.',
    consult: 'Consult your doctor before combining stimulating adaptogens.'
  },
  'licorice|black-cohosh': {
    severity: 'moderate',
    pair: 'Licorice Root + Black Cohosh',
    description: 'Both herbs have hormonal activity. Licorice can affect cortisol and aldosterone levels; combined with black cohosh\'s estrogenic effects, hormonal balance may be disrupted.',
    consult: 'Consult your doctor if you have hormone-sensitive conditions.'
  },
  'feverfew|white-willow-bark': {
    severity: 'moderate',
    pair: 'Feverfew + White Willow Bark',
    description: 'Both herbs have antiplatelet and anti-inflammatory properties similar to aspirin. Combined use may increase bleeding risk, especially in people on blood thinners.',
    consult: 'Consult your doctor before combining these herbs, especially if you take blood thinners or NSAIDs.'
  },
  'garlic|ginkgo': {
    severity: 'high',
    pair: 'Garlic + Ginkgo Biloba',
    description: 'Both herbs have significant antiplatelet (blood-thinning) effects. Combining them substantially increases the risk of bleeding, particularly in people already on anticoagulant medications.',
    consult: 'Consult your doctor before combining these herbs. Avoid if you take warfarin, aspirin, or other blood thinners.'
  },
  'dong-quai|ginkgo': {
    severity: 'high',
    pair: 'Dong Quai + Ginkgo Biloba',
    description: 'Both herbs have anticoagulant properties. Combined use significantly increases bleeding risk.',
    consult: 'Consult your doctor before combining. Avoid if on blood thinners.'
  },
  'dong-quai|garlic': {
    severity: 'high',
    pair: 'Dong Quai + Garlic',
    description: 'Both herbs have blood-thinning properties. Combined use may significantly increase bleeding risk.',
    consult: 'Consult your doctor before combining. Avoid if on blood thinners.'
  },
  'feverfew|ginkgo': {
    severity: 'high',
    pair: 'Feverfew + Ginkgo Biloba',
    description: 'Both herbs inhibit platelet aggregation. Combined use may substantially increase bleeding risk.',
    consult: 'Consult your doctor before combining. Avoid if on blood thinners.'
  },
  'cayenne|ginkgo': {
    severity: 'moderate',
    pair: 'Cayenne + Ginkgo Biloba',
    description: 'Cayenne has mild antiplatelet effects; combined with ginkgo\'s stronger anticoagulant activity, bleeding risk may be increased.',
    consult: 'Consult your doctor before combining, especially if on blood thinners.'
  },
  'cayenne|garlic': {
    severity: 'moderate',
    pair: 'Cayenne + Garlic',
    description: 'Both herbs have blood-thinning properties. Combined use may increase bleeding risk.',
    consult: 'Consult your doctor before combining, especially if on blood thinners.'
  },
  'milk-thistle|kava': {
    severity: 'moderate',
    pair: 'Milk Thistle + Kava',
    description: 'Kava carries hepatotoxicity risk. While milk thistle is hepatoprotective, combining them does not eliminate kava\'s liver risk and may create a false sense of safety.',
    consult: 'Consult your doctor if you have liver concerns. Kava should be used with caution regardless.'
  },
  'schisandra|kava': {
    severity: 'moderate',
    pair: 'Schisandra + Kava',
    description: 'Both herbs are metabolized by the liver. Kava carries hepatotoxicity risk; combining with schisandra may affect liver enzyme activity.',
    consult: 'Consult your doctor if you have liver concerns.'
  },

  // Drug category interactions (represented as special "drug" entries)
  // These appear when a single herb is selected that has known drug interactions
  '__drug__st-johns-wort': {
    severity: 'high',
    pair: 'St. John\'s Wort + Many Medications',
    description: 'St. John\'s Wort is a potent inducer of CYP450 enzymes (especially CYP3A4) and P-glycoprotein. It can significantly reduce blood levels of many medications including: antidepressants (SSRIs, MAOIs), birth control pills, HIV medications (antiretrovirals), cyclosporine (transplant rejection drugs), warfarin (blood thinner), digoxin (heart medication), and many others.',
    consult: 'If you take ANY prescription medication, consult your doctor or pharmacist before using St. John\'s Wort.'
  },
  '__drug__ginkgo': {
    severity: 'high',
    pair: 'Ginkgo Biloba + Blood Thinners / Antiplatelet Drugs',
    description: 'Ginkgo biloba has significant antiplatelet and anticoagulant effects. It can interact with warfarin, aspirin, clopidogrel (Plavix), NSAIDs, and other blood-thinning medications, substantially increasing bleeding risk.',
    consult: 'Consult your doctor before using ginkgo if you take any blood-thinning medications.'
  },
  '__drug__garlic': {
    severity: 'high',
    pair: 'Garlic + Blood Thinners',
    description: 'High-dose garlic supplements have significant antiplatelet effects and can interact with warfarin, aspirin, and other anticoagulants, increasing bleeding risk. Culinary amounts are generally safe.',
    consult: 'Consult your doctor before taking garlic supplements if you are on blood-thinning medications.'
  },
  '__drug__ginseng': {
    severity: 'moderate',
    pair: 'Ginseng + Stimulants / Diabetes Medications',
    description: 'Ginseng may interact with stimulant medications (caffeine, ADHD medications) causing overstimulation. It may also lower blood sugar, potentially enhancing the effects of diabetes medications and causing hypoglycemia. May also interact with warfarin and MAOIs.',
    consult: 'Consult your doctor if you take stimulants, diabetes medications, blood thinners, or antidepressants.'
  },
  '__drug__licorice': {
    severity: 'high',
    pair: 'Licorice Root + Blood Pressure Medications / Diuretics',
    description: 'Licorice root (non-DGL) contains glycyrrhizin, which can cause sodium retention, potassium loss, and elevated blood pressure. This can counteract antihypertensive medications and interact with diuretics, corticosteroids, and digoxin. Chronic use can cause serious cardiovascular effects.',
    consult: 'Consult your doctor before using licorice root if you take blood pressure medications, diuretics, or heart medications.'
  },
  '__drug__dong-quai': {
    severity: 'high',
    pair: 'Dong Quai + Blood Thinners / Hormone Therapies',
    description: 'Dong quai has anticoagulant properties and can increase bleeding risk when combined with warfarin, aspirin, or other blood thinners. It also has estrogenic activity that may interact with hormone therapies, birth control pills, and tamoxifen.',
    consult: 'Consult your doctor before using dong quai if you take blood thinners or hormone medications.'
  },
  '__drug__feverfew': {
    severity: 'moderate',
    pair: 'Feverfew + Blood Thinners / NSAIDs',
    description: 'Feverfew inhibits platelet aggregation and may increase bleeding risk when combined with warfarin, aspirin, or NSAIDs. Abrupt discontinuation after long-term use may cause "post-feverfew syndrome" (rebound headaches, anxiety).',
    consult: 'Consult your doctor before using feverfew if you take blood thinners or anti-inflammatory medications.'
  },
  '__drug__kava': {
    severity: 'high',
    pair: 'Kava + Alcohol / Sedatives / Liver-Metabolized Drugs',
    description: 'Kava combined with alcohol or sedative medications (benzodiazepines, barbiturates, sleep aids) significantly increases CNS depression and liver toxicity risk. Kava is metabolized by CYP450 enzymes and may interact with many medications processed by the liver.',
    consult: 'Consult your doctor before using kava if you drink alcohol, take sedatives, or take any medications metabolized by the liver.'
  },
  '__drug__echinacea': {
    severity: 'moderate',
    pair: 'Echinacea + Immunosuppressants',
    description: 'Echinacea stimulates immune function, which may counteract immunosuppressant medications (cyclosporine, tacrolimus, corticosteroids) used after organ transplants or for autoimmune conditions.',
    consult: 'Consult your doctor before using echinacea if you take immunosuppressant medications.'
  },
  '__drug__black-cohosh': {
    severity: 'moderate',
    pair: 'Black Cohosh + Hormone Therapies / Liver-Metabolized Drugs',
    description: 'Black cohosh has estrogenic activity that may produce additive effects with hormone replacement therapy, birth control pills, or tamoxifen. Rare cases of liver injury have been reported; use caution with other hepatotoxic substances.',
    consult: 'Consult your doctor before using black cohosh if you take hormone medications or have liver concerns.'
  },
  '__drug__cayenne': {
    severity: 'moderate',
    pair: 'Cayenne + Blood Thinners / ACE Inhibitors',
    description: 'Cayenne (capsaicin) has mild antiplatelet effects that may increase bleeding risk with blood thinners. It may also interact with ACE inhibitors (blood pressure medications), potentially worsening cough side effects.',
    consult: 'Consult your doctor before using cayenne supplements if you take blood thinners or blood pressure medications.'
  },
  '__drug__valerian': {
    severity: 'moderate',
    pair: 'Valerian + Sedatives / CNS Depressants',
    description: 'Valerian has sedative properties that may be additive with benzodiazepines, barbiturates, sleep medications, alcohol, and other CNS depressants. May also interact with anesthesia.',
    consult: 'Consult your doctor before using valerian if you take sedative medications or plan to have surgery.'
  },
  '__drug__st-johns-wort|ginseng': {
    severity: 'high',
    pair: 'St. John\'s Wort + Ginseng',
    description: 'St. John\'s Wort can induce CYP450 enzymes affecting ginseng metabolism. Both may affect serotonin levels, increasing risk of serotonin syndrome when combined with antidepressants.',
    consult: 'Consult your doctor before combining these herbs, especially if you take antidepressants.'
  }
};

// Herbs with known drug interactions (shown as individual warnings)
const DRUG_INTERACTION_HERBS = ['st-johns-wort', 'ginkgo', 'garlic', 'ginseng', 'licorice', 'dong-quai', 'feverfew', 'kava', 'echinacea', 'black-cohosh', 'cayenne', 'valerian'];

let allHerbs = [];
let selectedHerbs = new Set();

async function loadHerbs() {
  try {
    const res = await fetch('../herbs.json');
    allHerbs = await res.json();
    allHerbs.sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    console.error('Failed to load herbs.json', e);
    allHerbs = [];
  }
  renderHerbList('');
}

function renderHerbList(filter) {
  const list = document.getElementById('herb-list');
  list.innerHTML = '';
  const filtered = allHerbs.filter(h => h.name.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(herb => {
    const isSelected = selectedHerbs.has(herb.id);
    const isDisabled = !isSelected && selectedHerbs.size >= 5;
    const item = document.createElement('div');
    item.className = 'ic-herb-item' + (isDisabled ? ' disabled' : '');
    item.innerHTML = `
      <input type="checkbox" id="herb-${herb.id}" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label for="herb-${herb.id}">${herb.name}</label>
    `;
    if (!isDisabled) {
      item.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          const cb = item.querySelector('input');
          cb.checked = !cb.checked;
          toggleHerb(herb.id, cb.checked);
        } else {
          toggleHerb(herb.id, e.target.checked);
        }
      });
    }
    list.appendChild(item);
  });
}

function toggleHerb(herbId, checked) {
  if (checked) {
    if (selectedHerbs.size < 5) selectedHerbs.add(herbId);
  } else {
    selectedHerbs.delete(herbId);
  }
  const filter = document.getElementById('herb-search').value;
  renderHerbList(filter);
  updateSelectedCount();
  renderTags();
  renderResults();
}

function updateSelectedCount() {
  document.getElementById('selected-count').textContent = `${selectedHerbs.size} of 5 selected`;
}

function renderTags() {
  const container = document.getElementById('selected-tags');
  container.innerHTML = '';
  selectedHerbs.forEach(id => {
    const herb = allHerbs.find(h => h.id === id);
    if (!herb) return;
    const tag = document.createElement('span');
    tag.className = 'ic-tag';
    tag.innerHTML = `${herb.name} <span class="ic-tag__remove" data-id="${id}" title="Remove">&#10005;</span>`;
    tag.querySelector('.ic-tag__remove').addEventListener('click', () => {
      toggleHerb(id, false);
    });
    container.appendChild(tag);
  });
}

function getInteractionKey(ids) {
  return [...ids].sort().join('|');
}

function renderResults() {
  const panel = document.getElementById('results-panel');
  panel.innerHTML = '';

  if (selectedHerbs.size === 0) {
    panel.innerHTML = '<div class="ic-empty"><div class="ic-empty-icon">&#127807;</div>Select herbs on the left to check for interactions.</div>';
    return;
  }

  const warnings = [];
  const herbArr = [...selectedHerbs];

  // Check herb-herb pairs
  for (let i = 0; i < herbArr.length; i++) {
    for (let j = i + 1; j < herbArr.length; j++) {
      const key = getInteractionKey([herbArr[i], herbArr[j]]);
      if (INTERACTIONS[key]) {
        warnings.push(INTERACTIONS[key]);
      }
    }
  }

  // Check herb-drug interactions for each selected herb
  herbArr.forEach(id => {
    const drugKey = `__drug__${id}`;
    if (INTERACTIONS[drugKey]) {
      warnings.push(INTERACTIONS[drugKey]);
    }
  });

  // Check triple combos
  if (herbArr.length >= 3) {
    for (let i = 0; i < herbArr.length; i++) {
      for (let j = i + 1; j < herbArr.length; j++) {
        for (let k = j + 1; k < herbArr.length; k++) {
          const key = getInteractionKey([herbArr[i], herbArr[j], herbArr[k]]);
          if (INTERACTIONS[key]) {
            // Avoid duplicate if already added via pair
            const alreadyAdded = warnings.some(w => w.pair === INTERACTIONS[key].pair);
            if (!alreadyAdded) warnings.push(INTERACTIONS[key]);
          }
        }
      }
    }
  }

  // Sort: high severity first
  warnings.sort((a, b) => {
    if (a.severity === 'high' && b.severity !== 'high') return -1;
    if (b.severity === 'high' && a.severity !== 'high') return 1;
    return 0;
  });

  if (warnings.length === 0) {
    panel.innerHTML = `
      <div class="ic-no-interactions">
        <div class="ic-no-interactions-icon">&#10003;</div>
        <strong>No known interactions found</strong>
        <p>No interactions were found in our database for this combination. This does not mean the combination is safe — our database is not exhaustive.</p>
      </div>`;
    return;
  }

  warnings.forEach(w => {
    const card = document.createElement('div');
    card.className = `ic-warning-card severity-${w.severity}`;
    card.innerHTML = `
      <div class="ic-warning-card__header">
        <div class="ic-warning-card__pair">${w.pair}</div>
        <span class="ic-badge ${w.severity}">${w.severity === 'high' ? '&#9888; High' : 'Moderate'}</span>
      </div>
      <div class="ic-warning-card__desc">${w.description}</div>
      <div class="ic-warning-card__consult">&#9432; ${w.consult}</div>
    `;
    panel.appendChild(card);
  });
}

// Search
document.getElementById('herb-search').addEventListener('input', (e) => {
  renderHerbList(e.target.value);
});

// Init
loadHerbs();
