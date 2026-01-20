/**
 * ==============================================
 * NaturalHealth PWA - מודול משאבים ומוצרים
 * ==============================================
 * 
 * מודול זה מטפל ב:
 * - פודקאסטים וסרטונים מומלצים
 * - המלצות מוצרים לפי מדינה
 * - קישורים לחנויות מקומיות
 */

const ResourcesModule = (function() {
  
  // ===========================================
  // === משתנים פרטיים ===
  // ===========================================
  
  // מדינה נבחרת (ברירת מחדל: ארה"ב)
  let selectedCountry = localStorage.getItem('naturalhealth_country') || 'US';
  
  // ===========================================
  // === מאגר משאבים (פודקאסטים וסרטונים) ===
  // ===========================================
  // משאבים לפי עמוד (pillar)
  
  const resourcesDB = {
    nutrition: {
      podcasts: [
        { name: 'The Model Health Show', host: 'Shawn Stevenson', description: 'Science-backed nutrition and wellness insights', url: 'https://themodelhealthshow.com/', platform: 'Apple/Spotify' },
        { name: 'Food Heaven Podcast', host: 'Wendy & Jess', description: 'Intuitive eating and nutrition without diet culture', url: 'https://foodheaven.com/podcast/', platform: 'Apple/Spotify' },
        { name: 'The Doctor\'s Kitchen', host: 'Dr. Rupy Aujla', description: 'Culinary medicine and plant-based nutrition', url: 'https://thedoctorskitchen.com/podcast', platform: 'Apple/Spotify' },
        { name: 'Nutrition Facts Podcast', host: 'Dr. Michael Greger', description: 'Evidence-based nutrition research', url: 'https://nutritionfacts.org/audio/', platform: 'Apple/Spotify' }
      ],
      videos: [
        { name: 'What I\'ve Learned', description: 'Deep dives into nutrition science and metabolism', url: 'https://www.youtube.com/@WhatIveLearned', platform: 'YouTube' },
        { name: 'Dr. Eric Berg', description: 'Keto, fasting, and nutritional healing', url: 'https://www.youtube.com/@DrEricBergDC', platform: 'YouTube' },
        { name: 'Pick Up Limes', description: 'Plant-based nutrition and mindful eating', url: 'https://www.youtube.com/@PickUpLimes', platform: 'YouTube' }
      ]
    },
    sleep: {
      podcasts: [
        { name: 'Sleep With Me', host: 'Drew Ackerman', description: 'Boring bedtime stories to help you fall asleep', url: 'https://www.sleepwithmepodcast.com/', platform: 'Apple/Spotify' },
        { name: 'The Sleep Doctor Podcast', host: 'Dr. Michael Breus', description: 'Science of sleep and circadian rhythms', url: 'https://thesleepdoctor.com/podcast/', platform: 'Apple/Spotify' },
        { name: 'Nothing Much Happens', host: 'Kathryn Nicolai', description: 'Calming bedtime stories for grown-ups', url: 'https://www.nothingmuchhappens.com/', platform: 'Apple/Spotify' }
      ],
      videos: [
        { name: 'Andrew Huberman - Sleep Toolkit', description: 'Neuroscience protocols for optimal sleep', url: 'https://www.youtube.com/watch?v=h2aWYjSA1Jc', platform: 'YouTube' },
        { name: 'Matthew Walker - TED Talk', description: 'Sleep is your superpower', url: 'https://www.youtube.com/watch?v=5MuIMqhT8DM', platform: 'YouTube' },
        { name: 'Yoga With Adriene - Bedtime Yoga', description: 'Gentle yoga for better sleep', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', platform: 'YouTube' }
      ]
    },
    movement: {
      podcasts: [
        { name: 'The Rich Roll Podcast', host: 'Rich Roll', description: 'Fitness, nutrition, and human potential', url: 'https://www.richroll.com/podcast/', platform: 'Apple/Spotify' },
        { name: 'The Mindful Movement', host: 'Sara & Les Raymond', description: 'Movement, meditation, and mindfulness', url: 'https://www.youtube.com/@TheMindfulMovement', platform: 'YouTube' },
        { name: 'Move Your DNA', host: 'Katy Bowman', description: 'Biomechanics and natural movement', url: 'https://www.nutritiousmovement.com/podcasts/', platform: 'Apple/Spotify' }
      ],
      videos: [
        { name: 'Yoga With Adriene', description: 'Free yoga for all levels', url: 'https://www.youtube.com/@yogawithadriene', platform: 'YouTube' },
        { name: 'Blogilates', description: 'Fun pilates and fitness workouts', url: 'https://www.youtube.com/@blogilates', platform: 'YouTube' },
        { name: 'Tom Merrick - Flexibility', description: 'Mobility and flexibility routines', url: 'https://www.youtube.com/@TomMerrick', platform: 'YouTube' }
      ]
    },
    mind: {
      podcasts: [
        { name: 'Ten Percent Happier', host: 'Dan Harris', description: 'Meditation for skeptics', url: 'https://www.tenpercent.com/podcast', platform: 'Apple/Spotify' },
        { name: 'The Happiness Lab', host: 'Dr. Laurie Santos', description: 'Science of happiness and wellbeing', url: 'https://www.happinesslab.fm/', platform: 'Apple/Spotify' },
        { name: 'On Being', host: 'Krista Tippett', description: 'Deep conversations on meaning and life', url: 'https://onbeing.org/series/podcast/', platform: 'Apple/Spotify' },
        { name: 'Huberman Lab', host: 'Dr. Andrew Huberman', description: 'Neuroscience tools for mental health', url: 'https://hubermanlab.com/', platform: 'Apple/Spotify' }
      ],
      videos: [
        { name: 'Headspace Animations', description: 'Mindfulness explainers and meditations', url: 'https://www.youtube.com/@Headspace', platform: 'YouTube' },
        { name: 'The School of Life', description: 'Emotional intelligence and self-development', url: 'https://www.youtube.com/@theschooloflifetv', platform: 'YouTube' },
        { name: 'Great Meditation', description: 'Guided meditations for various needs', url: 'https://www.youtube.com/@GreatMeditation', platform: 'YouTube' }
      ]
    }
  };
  
  // ===========================================
  // === מאגר מוצרים ===
  // ===========================================
  // מוצרים מומלצים לפי עמוד
  
  const productsDB = {
    nutrition: {
      categories: ['Vitamins & Supplements', 'Superfoods', 'Digestive Health', 'Herbal Teas'],
      products: [
        { name: 'Magnesium Glycinate', description: 'For relaxation, sleep, and muscle recovery', keywords: ['magnesium', 'sleep', 'stress'] },
        { name: 'Omega-3 Fish Oil', description: 'Brain health and inflammation support', keywords: ['omega', 'brain', 'mood'] },
        { name: 'Vitamin D3 + K2', description: 'Immune support and mood regulation', keywords: ['vitamin d', 'immunity', 'mood'] },
        { name: 'Probiotics', description: 'Gut health and immune function', keywords: ['gut', 'digestion', 'immunity'] },
        { name: 'Chamomile Tea', description: 'Calming and sleep support', keywords: ['sleep', 'calm', 'anxiety'] },
        { name: 'Ginger Root', description: 'Digestive aid and anti-nausea', keywords: ['nausea', 'digestion', 'stomach'] },
        { name: 'B-Complex Vitamins', description: 'Energy and nervous system support', keywords: ['energy', 'fatigue', 'stress'] },
        { name: 'Iron Supplements', description: 'Energy and oxygen transport', keywords: ['fatigue', 'energy', 'tired'] }
      ]
    },
    sleep: {
      categories: ['Sleep Supplements', 'Essential Oils', 'Sleep Accessories'],
      products: [
        { name: 'Melatonin', description: 'Natural sleep hormone support', keywords: ['sleep', 'insomnia', 'jet lag'] },
        { name: 'Valerian Root', description: 'Herbal sleep aid', keywords: ['sleep', 'insomnia', 'anxiety'] },
        { name: 'Lavender Essential Oil', description: 'Aromatherapy for relaxation', keywords: ['sleep', 'calm', 'anxiety'] },
        { name: 'Magnesium Glycinate', description: 'Promotes relaxation and sleep', keywords: ['sleep', 'muscle', 'relaxation'] },
        { name: 'L-Theanine', description: 'Calm focus without drowsiness', keywords: ['calm', 'focus', 'anxiety'] },
        { name: 'Tart Cherry Extract', description: 'Natural melatonin source', keywords: ['sleep', 'melatonin'] },
        { name: 'Passionflower', description: 'Herbal anxiety and sleep support', keywords: ['anxiety', 'sleep', 'calm'] }
      ]
    },
    movement: {
      categories: ['Recovery', 'Energy', 'Joint Support', 'Workout Supplements'],
      products: [
        { name: 'Collagen Peptides', description: 'Joint and tissue support', keywords: ['joints', 'recovery', 'skin'] },
        { name: 'Turmeric/Curcumin', description: 'Anti-inflammatory for recovery', keywords: ['inflammation', 'pain', 'joints'] },
        { name: 'BCAA (Amino Acids)', description: 'Muscle recovery and energy', keywords: ['muscle', 'recovery', 'energy'] },
        { name: 'Electrolytes', description: 'Hydration and performance', keywords: ['hydration', 'energy', 'exercise'] },
        { name: 'Magnesium Spray', description: 'Topical muscle relaxation', keywords: ['muscle', 'cramps', 'tension'] },
        { name: 'MSM', description: 'Joint and connective tissue support', keywords: ['joints', 'pain', 'flexibility'] }
      ]
    },
    mind: {
      categories: ['Stress Support', 'Mood Support', 'Adaptogens', 'Focus'],
      products: [
        { name: 'Ashwagandha', description: 'Adaptogen for stress and anxiety', keywords: ['stress', 'anxiety', 'calm'] },
        { name: 'Rhodiola Rosea', description: 'Energy and stress resilience', keywords: ['stress', 'energy', 'fatigue'] },
        { name: 'Lion\'s Mane Mushroom', description: 'Cognitive support and focus', keywords: ['focus', 'brain', 'memory'] },
        { name: 'L-Theanine', description: 'Calm focus and relaxation', keywords: ['focus', 'calm', 'anxiety'] },
        { name: 'GABA', description: 'Neurotransmitter for calm', keywords: ['anxiety', 'calm', 'sleep'] },
        { name: '5-HTP', description: 'Serotonin support for mood', keywords: ['mood', 'depression', 'sleep'] },
        { name: 'CBD Oil', description: 'Calm and relaxation support', keywords: ['anxiety', 'pain', 'sleep'] }
      ]
    }
  };
  
  // ===========================================
  // === מאגר חנויות לפי מדינה ===
  // ===========================================
  // קישורים לחנויות בריאות בכל מדינה
  
  const storesDB = {
    'US': { name: 'United States', stores: [
      { name: 'iHerb', url: 'https://www.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon', url: 'https://www.amazon.com/s?k=', icon: '📦' },
      { name: 'Vitacost', url: 'https://www.vitacost.com/search?t=', icon: '💊' },
      { name: 'Thrive Market', url: 'https://thrivemarket.com/search?search=', icon: '🥗' }
    ]},
    'IL': { name: 'Israel', stores: [
      { name: 'iHerb Israel', url: 'https://il.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Altman Health', url: 'https://www.altman-health.co.il/catalogsearch/result/?q=', icon: '💚' },
      { name: 'Bara Herbs', url: 'https://www.bara.co.il/catalogsearch/result/?q=', icon: '🌱' },
      { name: 'Super-Pharm', url: 'https://www.super-pharm.co.il/search?q=', icon: '💊' },
      { name: 'Life (LifeOnline)', url: 'https://www.life-online.co.il/search?q=', icon: '🏪' }
    ]},
    'UK': { name: 'United Kingdom', stores: [
      { name: 'iHerb UK', url: 'https://uk.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Holland & Barrett', url: 'https://www.hollandandbarrett.com/search/?query=', icon: '🍃' },
      { name: 'Amazon UK', url: 'https://www.amazon.co.uk/s?k=', icon: '📦' },
      { name: 'Boots', url: 'https://www.boots.com/search?text=', icon: '💊' }
    ]},
    'DE': { name: 'Germany', stores: [
      { name: 'iHerb Germany', url: 'https://de.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon DE', url: 'https://www.amazon.de/s?k=', icon: '📦' },
      { name: 'DocMorris', url: 'https://www.docmorris.de/search?query=', icon: '💊' },
      { name: 'dm', url: 'https://www.dm.de/search?query=', icon: '🏪' }
    ]},
    'CA': { name: 'Canada', stores: [
      { name: 'iHerb Canada', url: 'https://ca.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon CA', url: 'https://www.amazon.ca/s?k=', icon: '📦' },
      { name: 'Well.ca', url: 'https://well.ca/searchresult.html?keyword=', icon: '🍃' }
    ]},
    'AU': { name: 'Australia', stores: [
      { name: 'iHerb Australia', url: 'https://au.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Chemist Warehouse', url: 'https://www.chemistwarehouse.com.au/search?searchtext=', icon: '💊' },
      { name: 'Amazon AU', url: 'https://www.amazon.com.au/s?k=', icon: '📦' }
    ]},
    'FR': { name: 'France', stores: [
      { name: 'iHerb France', url: 'https://fr.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon FR', url: 'https://www.amazon.fr/s?k=', icon: '📦' }
    ]},
    'ES': { name: 'Spain', stores: [
      { name: 'iHerb Spain', url: 'https://es.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon ES', url: 'https://www.amazon.es/s?k=', icon: '📦' }
    ]},
    'IT': { name: 'Italy', stores: [
      { name: 'iHerb Italy', url: 'https://it.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon IT', url: 'https://www.amazon.it/s?k=', icon: '📦' }
    ]},
    'NL': { name: 'Netherlands', stores: [
      { name: 'iHerb Netherlands', url: 'https://nl.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon NL', url: 'https://www.amazon.nl/s?k=', icon: '📦' }
    ]},
    'SE': { name: 'Sweden', stores: [
      { name: 'iHerb Sweden', url: 'https://se.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon SE', url: 'https://www.amazon.se/s?k=', icon: '📦' }
    ]},
    'NO': { name: 'Norway', stores: [
      { name: 'iHerb Norway', url: 'https://no.iherb.com/search?kw=', icon: '🌿' }
    ]},
    'DK': { name: 'Denmark', stores: [
      { name: 'iHerb Denmark', url: 'https://dk.iherb.com/search?kw=', icon: '🌿' }
    ]},
    'PL': { name: 'Poland', stores: [
      { name: 'iHerb Poland', url: 'https://pl.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon PL', url: 'https://www.amazon.pl/s?k=', icon: '📦' }
    ]},
    'JP': { name: 'Japan', stores: [
      { name: 'iHerb Japan', url: 'https://jp.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon JP', url: 'https://www.amazon.co.jp/s?k=', icon: '📦' }
    ]},
    'KR': { name: 'South Korea', stores: [
      { name: 'iHerb Korea', url: 'https://kr.iherb.com/search?kw=', icon: '🌿' }
    ]},
    'IN': { name: 'India', stores: [
      { name: 'iHerb India', url: 'https://in.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon IN', url: 'https://www.amazon.in/s?k=', icon: '📦' }
    ]},
    'BR': { name: 'Brazil', stores: [
      { name: 'iHerb Brazil', url: 'https://br.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon BR', url: 'https://www.amazon.com.br/s?k=', icon: '📦' }
    ]},
    'MX': { name: 'Mexico', stores: [
      { name: 'iHerb Mexico', url: 'https://mx.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon MX', url: 'https://www.amazon.com.mx/s?k=', icon: '📦' }
    ]},
    'ZA': { name: 'South Africa', stores: [
      { name: 'iHerb', url: 'https://www.iherb.com/search?kw=', icon: '🌿' }
    ]},
    'NZ': { name: 'New Zealand', stores: [
      { name: 'iHerb NZ', url: 'https://nz.iherb.com/search?kw=', icon: '🌿' }
    ]},
    'SG': { name: 'Singapore', stores: [
      { name: 'iHerb Singapore', url: 'https://sg.iherb.com/search?kw=', icon: '🌿' }
    ]},
    'AE': { name: 'UAE', stores: [
      { name: 'iHerb UAE', url: 'https://ae.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon AE', url: 'https://www.amazon.ae/s?k=', icon: '📦' }
    ]},
    'SA': { name: 'Saudi Arabia', stores: [
      { name: 'iHerb Saudi', url: 'https://sa.iherb.com/search?kw=', icon: '🌿' },
      { name: 'Amazon SA', url: 'https://www.amazon.sa/s?k=', icon: '📦' }
    ]}
  };
  
  // ===========================================
  // === פונקציות ===
  // ===========================================

  /** אתחול המודול */
  function init() {
    selectedCountry = localStorage.getItem('naturalhealth_country') || 'US';
  }

  /** קבלת המדינה הנבחרת */
  function getCountry() { return selectedCountry; }

  /** הגדרת מדינה */
  function setCountry(countryCode) {
    selectedCountry = countryCode;
    localStorage.setItem('naturalhealth_country', countryCode);
    App.showToast(`Region set to ${storesDB[countryCode]?.name || countryCode}`);
  }

  /** קבלת חנויות למדינה הנוכחית */
  function getStores() { return storesDB[selectedCountry] || storesDB['US']; }

  /** קבלת רשימת כל המדינות */
  function getCountries() {
    return Object.entries(storesDB).map(([code, data]) => ({ code, name: data.name }));
  }

  /** קבלת משאבים לעמוד מסוים */
  function getResources(pillar) { return resourcesDB[pillar] || { podcasts: [], videos: [] }; }

  /** קבלת מוצרים לעמוד מסוים */
  function getProducts(pillar) { return productsDB[pillar] || { categories: [], products: [] }; }

  /** יצירת URL לחיפוש מוצר בחנות */
  function getProductSearchUrl(storeName, productName) {
    const stores = getStores().stores;
    const store = stores.find(s => s.name === storeName);
    return store ? store.url + encodeURIComponent(productName) : '#';
  }

  /** יצירת HTML לבוחר מדינה */
  function renderCountrySelector() {
    const countries = getCountries();
    return `
      <div class="country-selector" style="margin-bottom: var(--space-lg);">
        <label style="font-size: 0.8125rem; color: var(--color-text-muted); display: block; margin-bottom: var(--space-sm);">
          Your Region (for store recommendations):
        </label>
        <select id="countrySelect" onchange="ResourcesModule.setCountry(this.value)" 
                style="width: 100%; padding: var(--space-sm) var(--space-md); background: var(--color-bg-input); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.9375rem; color: var(--color-text-primary);">
          ${countries.map(c => `<option value="${c.code}" ${c.code === selectedCountry ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>
    `;
  }

  /** יצירת HTML לסקשן משאבים */
  function renderResourcesSection(pillar) {
    const resources = getResources(pillar);
    let html = `<div class="resources-media-section" style="margin-top: var(--space-xl);">
      <h3 class="section-title" style="display: flex; align-items: center; gap: var(--space-sm);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        Learn More: Podcasts & Videos
      </h3>`;
    
    // פודקאסטים
    if (resources.podcasts.length > 0) {
      html += `<h4 style="font-size: 0.9375rem; color: var(--color-text-secondary); margin: var(--space-lg) 0 var(--space-md); display: flex; align-items: center; gap: var(--space-sm);"><span style="font-size: 1.25rem;">🎙️</span> Podcasts</h4><div style="display: flex; flex-direction: column; gap: var(--space-sm);">`;
      resources.podcasts.forEach(p => {
        html += `<a href="${p.url}" target="_blank" rel="noopener noreferrer" style="display: block; padding: var(--space-md); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-decoration: none; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent-primary)'" onmouseout="this.style.borderColor='var(--color-border)'"><div style="font-weight: 500; color: var(--color-text-primary); margin-bottom: 2px;">${p.name}</div><div style="font-size: 0.8125rem; color: var(--color-text-muted);">${p.host} · ${p.platform}</div><div style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-top: 4px;">${p.description}</div></a>`;
      });
      html += '</div>';
    }
    
    // סרטונים
    if (resources.videos.length > 0) {
      html += `<h4 style="font-size: 0.9375rem; color: var(--color-text-secondary); margin: var(--space-lg) 0 var(--space-md); display: flex; align-items: center; gap: var(--space-sm);"><span style="font-size: 1.25rem;">📺</span> YouTube Channels & Videos</h4><div style="display: flex; flex-direction: column; gap: var(--space-sm);">`;
      resources.videos.forEach(v => {
        html += `<a href="${v.url}" target="_blank" rel="noopener noreferrer" style="display: block; padding: var(--space-md); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-decoration: none; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent-primary)'" onmouseout="this.style.borderColor='var(--color-border)'"><div style="font-weight: 500; color: var(--color-text-primary); margin-bottom: 2px;">${v.name}</div><div style="font-size: 0.8125rem; color: var(--color-text-muted);">${v.platform}</div><div style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-top: 4px;">${v.description}</div></a>`;
      });
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }

  /** יצירת HTML לסקשן מוצרים */
  function renderProductsSection(pillar) {
    const products = getProducts(pillar);
    const stores = getStores();
    
    let html = `<div class="products-section" style="margin-top: var(--space-xl);">
      <h3 class="section-title" style="display: flex; align-items: center; gap: var(--space-sm);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Recommended Products
      </h3>
      ${renderCountrySelector()}
      <p style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: var(--space-lg);">
        Shop from ${stores.name} natural health stores:
        ${stores.stores.map(s => `<span style="margin-right: var(--space-sm);">${s.icon} ${s.name}</span>`).join('')}
      </p>
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">`;
    
    products.products.forEach(product => {
      html += `<div style="padding: var(--space-md); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
        <div style="font-weight: 500; color: var(--color-text-primary); margin-bottom: 4px;">${product.name}</div>
        <div style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-bottom: var(--space-sm);">${product.description}</div>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
          ${stores.stores.map(store => `<a href="${store.url}${encodeURIComponent(product.name)}" target="_blank" rel="noopener noreferrer" style="padding: 4px 10px; background: var(--color-accent-light); border-radius: var(--radius-full); font-size: 0.75rem; color: var(--color-accent-secondary); text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='var(--color-accent-primary)'; this.style.color='white';" onmouseout="this.style.background='var(--color-accent-light)'; this.style.color='var(--color-accent-secondary)';">${store.icon} ${store.name}</a>`).join('')}
        </div>
      </div>`;
    });
    
    html += '</div></div>';
    return html;
  }

  /** פתיחת מודאל בחירת מדינה */
  function openCountryModal() {
    const countries = getCountries();
    const currentStores = getStores();
    
    const content = `<div style="text-align: center; margin-bottom: var(--space-lg);"><p style="color: var(--color-text-secondary); margin-bottom: var(--space-lg);">Select your region to see product recommendations from local natural health stores.</p></div>
      <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
        ${countries.map(c => `<button onclick="ResourcesModule.selectCountryAndClose('${c.code}')" style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: var(--space-md); background: ${c.code === selectedCountry ? 'var(--color-accent-light)' : 'var(--color-bg-input)'}; border: 1px solid ${c.code === selectedCountry ? 'var(--color-accent-primary)' : 'var(--color-border)'}; border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s; text-align: left;"><span style="font-weight: 500; color: var(--color-text-primary);">${c.name}</span>${c.code === selectedCountry ? '<span style="color: var(--color-accent-primary);">✓</span>' : ''}</button>`).join('')}
      </div>
      <div style="margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid var(--color-border);">
        <p style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: var(--space-sm);"><strong>Currently showing stores for ${currentStores.name}:</strong></p>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">${currentStores.stores.map(s => `<span style="padding: 4px 10px; background: var(--color-bg-input); border-radius: var(--radius-full); font-size: 0.75rem; color: var(--color-text-secondary);">${s.icon} ${s.name}</span>`).join('')}</div>
      </div>`;
    
    App.openModal('Select Your Region', content);
  }

  /** בחירת מדינה וסגירת מודאל */
  function selectCountryAndClose(countryCode) {
    setCountry(countryCode);
    App.closeModal();
    
    // רענון המשאבים במסך הנוכחי
    const pillarMap = { 'nutritionView': 'nutrition', 'sleepView': 'sleep', 'movementView': 'movement', 'mindView': 'mind' };
    const currentView = App.state?.currentView;
    const pillar = pillarMap[currentView];
    
    if (pillar) {
      const container = document.getElementById(`${pillar}Resources`);
      if (container) {
        container.dataset.loaded = 'false';
        container.innerHTML = renderResourcesSection(pillar) + renderProductsSection(pillar);
        container.dataset.loaded = 'true';
      }
    }
  }

  // אתחול בטעינת הדף
  document.addEventListener('DOMContentLoaded', init);

  // חשיפת פונקציות ציבוריות
  return {
    init, getCountry, setCountry, getStores, getCountries, getResources, getProducts,
    getProductSearchUrl, renderCountrySelector, renderResourcesSection, renderProductsSection,
    openCountryModal, selectCountryAndClose
  };
})();
