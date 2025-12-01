/**
 * NaturalHealth PWA - Holistic Wellness App
 * Main application logic
 */

// App State
const AppState = {
  currentView: 'homeView',
  todayData: {
    consumed: 0,
    burned: 0,
    logs: []
  },
  sleep: {
    hours: null,
    quality: null,
    bedtime: null
  }
};

// DOM Cache
const DOM = {};

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
  cacheDOMElements();
  loadAppState();
  setupEventListeners();
  updateGreeting();
  updateDate();
  loadDailyTip();
  loadDailyPrompt();
  updateTrackingDisplay();
}

function cacheDOMElements() {
  DOM.views = document.querySelectorAll('.view');
  DOM.navItems = document.querySelectorAll('.nav-item');
  DOM.pillarCards = document.querySelectorAll('.pillar-card');
  DOM.greeting = document.getElementById('greeting');
  DOM.currentDate = document.getElementById('currentDate');
  DOM.toast = document.getElementById('toast');
  DOM.toastMessage = document.getElementById('toastMessage');
  DOM.modalOverlay = document.getElementById('modalOverlay');
  DOM.modalTitle = document.getElementById('modalTitle');
  DOM.modalBody = document.getElementById('modalBody');
  DOM.modalClose = document.getElementById('modalClose');
  
  // Tracking
  DOM.showTrackingBtn = document.getElementById('showTrackingBtn');
  DOM.closeTrackingBtn = document.getElementById('closeTrackingBtn');
  DOM.trackingPanel = document.getElementById('trackingPanel');
  DOM.consumedCal = document.getElementById('consumedCal');
  DOM.burnedCal = document.getElementById('burnedCal');
  DOM.netCal = document.getElementById('netCal');
  
  // Daily tip
  DOM.dailyTipText = document.getElementById('dailyTipText');
  DOM.dailyTipCategory = document.getElementById('dailyTipCategory');
  DOM.todayPrompt = document.getElementById('todayPrompt');
}

function setupEventListeners() {
  // Navigation
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.view);
    });
  });
  
  // Pillar cards
  DOM.pillarCards.forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(card.dataset.view);
    });
  });
  
  // Mindset button
  document.querySelectorAll('.mindset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.view);
    });
  });
  
  // Tracking panel toggle
  if (DOM.showTrackingBtn) {
    DOM.showTrackingBtn.addEventListener('click', () => {
      DOM.trackingPanel.classList.add('active');
      DOM.showTrackingBtn.style.display = 'none';
    });
  }
  
  if (DOM.closeTrackingBtn) {
    DOM.closeTrackingBtn.addEventListener('click', () => {
      DOM.trackingPanel.classList.remove('active');
      DOM.showTrackingBtn.style.display = 'inline-flex';
    });
  }
  
  // Modal
  if (DOM.modalClose) {
    DOM.modalClose.addEventListener('click', closeModal);
  }
  if (DOM.modalOverlay) {
    DOM.modalOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.modalOverlay) closeModal();
    });
  }
  
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Navigation
function navigateTo(viewName) {
  // Update views
  DOM.views.forEach(view => {
    view.classList.toggle('active', view.id === viewName);
  });
  
  // Update nav items
  DOM.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });
  
  AppState.currentView = viewName;
  window.scrollTo(0, 0);
  
  // Load resources for pillar views
  loadPillarResources(viewName);
}

// Load resources and products for pillar views
function loadPillarResources(viewName) {
  const pillarMap = {
    'nutritionView': 'nutrition',
    'sleepView': 'sleep',
    'movementView': 'movement',
    'mindView': 'mind'
  };
  
  const pillar = pillarMap[viewName];
  
  // Initialize movement module when viewing movement
  if (viewName === 'movementView' && typeof MovementModule !== 'undefined') {
    MovementModule.init();
  }
  
  if (!pillar || typeof ResourcesModule === 'undefined') return;
  
  const container = document.getElementById(`${pillar}Resources`);
  if (!container || container.dataset.loaded === 'true') return;
  
  // Generate and insert resources HTML
  const resourcesHTML = ResourcesModule.renderResourcesSection(pillar);
  const productsHTML = ResourcesModule.renderProductsSection(pillar);
  
  container.innerHTML = resourcesHTML + productsHTML;
  container.dataset.loaded = 'true';
}

// Greeting
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 21) greeting = 'Good evening';
  else if (hour >= 21 || hour < 5) greeting = 'Good night';
  
  if (DOM.greeting) DOM.greeting.textContent = greeting;
}

// Date
function updateDate() {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('en-US', options);
  if (DOM.currentDate) DOM.currentDate.textContent = today;
}

// Daily Tip
async function loadDailyTip() {
  try {
    const response = await fetch('/data/tips.json');
    const data = await response.json();
    const tips = data.tips;
    
    // Get tip based on day of year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const tip = tips[dayOfYear % tips.length];
    
    if (DOM.dailyTipText) DOM.dailyTipText.textContent = tip.text;
    if (DOM.dailyTipCategory) DOM.dailyTipCategory.textContent = tip.category;
  } catch (error) {
    console.log('Using default tip');
    if (DOM.dailyTipText) DOM.dailyTipText.textContent = 'Take a moment to breathe deeply and appreciate this present moment.';
    if (DOM.dailyTipCategory) DOM.dailyTipCategory.textContent = 'mindfulness';
  }
}

// Daily Journal Prompt
function loadDailyPrompt() {
  const prompts = [
    '"How am I feeling right now?"',
    '"What do I need today?"',
    '"What am I grateful for?"',
    '"What would make today great?"',
    '"What can I let go of today?"',
    '"How can I show myself kindness?"',
    '"What gives me energy?"'
  ];
  
  const dayOfWeek = new Date().getDay();
  if (DOM.todayPrompt) {
    DOM.todayPrompt.textContent = prompts[dayOfWeek];
  }
}

// Tracking display
function updateTrackingDisplay() {
  if (DOM.consumedCal) DOM.consumedCal.textContent = AppState.todayData.consumed;
  if (DOM.burnedCal) DOM.burnedCal.textContent = AppState.todayData.burned;
  if (DOM.netCal) DOM.netCal.textContent = AppState.todayData.consumed - AppState.todayData.burned;
}

// Add calories
function addCalories(type, amount, name) {
  if (type === 'consumed') {
    AppState.todayData.consumed += amount;
  } else {
    AppState.todayData.burned += amount;
  }
  
  AppState.todayData.logs.push({
    type,
    name,
    calories: amount,
    time: new Date().toISOString()
  });
  
  updateTrackingDisplay();
  saveAppState();
  showToast(`Added ${name}`);
}

// Modal
function openModal(title, content) {
  DOM.modalTitle.textContent = title;
  DOM.modalBody.innerHTML = content;
  DOM.modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  DOM.modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Show resource detail
function showResourceDetail(resourceId) {
  const resources = {
    'hydration': {
      title: 'Hydration Guide',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Water is essential for every cell in your body. Proper hydration affects energy levels, 
          cognitive function, digestion, and even mood.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Daily Tips:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Start your day with a glass of water before anything else</li>
          <li style="margin-bottom: var(--space-sm);">Aim for 8 glasses (2 liters) throughout the day</li>
          <li style="margin-bottom: var(--space-sm);">Infuse water with lemon, cucumber, or mint for variety</li>
          <li style="margin-bottom: var(--space-sm);">Eat water-rich foods: cucumbers, watermelon, oranges</li>
          <li style="margin-bottom: var(--space-sm);">Reduce caffeine and alcohol which dehydrate</li>
        </ul>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Signs of Dehydration:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Fatigue and low energy</li>
          <li style="margin-bottom: var(--space-sm);">Headaches</li>
          <li style="margin-bottom: var(--space-sm);">Dark urine</li>
          <li style="margin-bottom: var(--space-sm);">Difficulty concentrating</li>
        </ul>
      `
    },
    'breathing': {
      title: 'Breathing Exercises',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Conscious breathing is one of the most powerful tools to instantly calm your nervous system 
          and reduce stress.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">4-7-8 Breathing:</h4>
        <ol style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Breathe in through your nose for 4 seconds</li>
          <li style="margin-bottom: var(--space-sm);">Hold your breath for 7 seconds</li>
          <li style="margin-bottom: var(--space-sm);">Exhale slowly through your mouth for 8 seconds</li>
          <li style="margin-bottom: var(--space-sm);">Repeat 4 times</li>
        </ol>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Box Breathing:</h4>
        <ol style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Inhale for 4 seconds</li>
          <li style="margin-bottom: var(--space-sm);">Hold for 4 seconds</li>
          <li style="margin-bottom: var(--space-sm);">Exhale for 4 seconds</li>
          <li style="margin-bottom: var(--space-sm);">Hold for 4 seconds</li>
          <li style="margin-bottom: var(--space-sm);">Repeat 4-6 times</li>
        </ol>
        <p style="color: var(--color-text-muted); font-style: italic;">
          Practice these exercises whenever you feel stressed, anxious, or before sleep.
        </p>
      `
    },
    'sleep-hygiene': {
      title: 'Sleep Hygiene Guide',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Quality sleep is the foundation of wellness. Creating the right environment and routine 
          can dramatically improve your rest.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Environment:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Keep your bedroom cool (65-68°F / 18-20°C)</li>
          <li style="margin-bottom: var(--space-sm);">Make it completely dark - use blackout curtains</li>
          <li style="margin-bottom: var(--space-sm);">Remove electronic devices from the bedroom</li>
          <li style="margin-bottom: var(--space-sm);">Use your bed only for sleep</li>
        </ul>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Evening Routine:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">No screens 1 hour before bed</li>
          <li style="margin-bottom: var(--space-sm);">No caffeine after 2 PM</li>
          <li style="margin-bottom: var(--space-sm);">Dim lights in the evening</li>
          <li style="margin-bottom: var(--space-sm);">Take a warm bath or shower</li>
          <li style="margin-bottom: var(--space-sm);">Read a physical book or journal</li>
        </ul>
      `
    },
    'mindful-eating': {
      title: 'Mindful Eating',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Mindful eating transforms meals into opportunities for presence, gratitude, and better digestion.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Practice:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Eat without screens or distractions</li>
          <li style="margin-bottom: var(--space-sm);">Take 3 deep breaths before starting</li>
          <li style="margin-bottom: var(--space-sm);">Chew each bite 20-30 times</li>
          <li style="margin-bottom: var(--space-sm);">Put your fork down between bites</li>
          <li style="margin-bottom: var(--space-sm);">Notice colors, textures, and flavors</li>
          <li style="margin-bottom: var(--space-sm);">Express gratitude for your food</li>
          <li style="margin-bottom: var(--space-sm);">Stop eating when 80% full</li>
        </ul>
      `
    },
    'natural-remedies': {
      title: 'Natural Remedies',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Nature provides gentle remedies for common ailments.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">For Energy:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Green tea - sustained energy without jitters</li>
          <li style="margin-bottom: var(--space-sm);">Ginger - stimulates circulation</li>
          <li style="margin-bottom: var(--space-sm);">Ashwagandha - adaptogenic stress relief</li>
        </ul>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">For Calm:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Chamomile tea - relaxation</li>
          <li style="margin-bottom: var(--space-sm);">Lavender - anxiety relief</li>
          <li style="margin-bottom: var(--space-sm);">Magnesium - muscle relaxation</li>
        </ul>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">For Digestion:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Peppermint - soothes stomach</li>
          <li style="margin-bottom: var(--space-sm);">Ginger - reduces nausea</li>
          <li style="margin-bottom: var(--space-sm);">Fennel - relieves bloating</li>
        </ul>
      `
    },
    'gentle-movement': {
      title: 'Gentle Movement',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Movement doesn't need to be intense to be beneficial. Gentle, consistent movement 
          supports overall health.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Morning Stretch Routine (5 min):</h4>
        <ol style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Cat-cow stretches (1 min)</li>
          <li style="margin-bottom: var(--space-sm);">Gentle neck rolls (30 sec each direction)</li>
          <li style="margin-bottom: var(--space-sm);">Standing forward fold (1 min)</li>
          <li style="margin-bottom: var(--space-sm);">Hip circles (30 sec each direction)</li>
          <li style="margin-bottom: var(--space-sm);">Shoulder shrugs and rolls (1 min)</li>
        </ol>
        <p style="color: var(--color-text-muted); font-style: italic;">
          Listen to your body. Never force a stretch. Breathe into each movement.
        </p>
      `
    },
    'meditation': {
      title: 'Meditation Guide',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Meditation is the practice of training your attention and awareness. Start simple and build from there.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Simple Breath Meditation (5-10 min):</h4>
        <ol style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Find a comfortable seated position</li>
          <li style="margin-bottom: var(--space-sm);">Close your eyes or soften your gaze</li>
          <li style="margin-bottom: var(--space-sm);">Breathe naturally, don't try to control it</li>
          <li style="margin-bottom: var(--space-sm);">Focus attention on the sensation of breathing</li>
          <li style="margin-bottom: var(--space-sm);">When your mind wanders (it will!), gently return to breath</li>
          <li style="margin-bottom: var(--space-sm);">Start with 5 minutes, gradually increase</li>
        </ol>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Tips for Beginners:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Consistency matters more than duration</li>
          <li style="margin-bottom: var(--space-sm);">There's no "wrong" way - wandering thoughts are normal</li>
          <li style="margin-bottom: var(--space-sm);">Try guided meditations at first</li>
          <li style="margin-bottom: var(--space-sm);">Same time each day helps build habit</li>
        </ul>
      `
    },
    'natural-sleep': {
      title: 'Natural Sleep Aids',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Nature provides gentle remedies to help you fall asleep and stay asleep without medication.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Herbal Teas:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);"><strong>Chamomile</strong> - Binds to GABA receptors, promotes calm</li>
          <li style="margin-bottom: var(--space-sm);"><strong>Valerian Root</strong> - Increases GABA, reduces time to fall asleep</li>
          <li style="margin-bottom: var(--space-sm);"><strong>Passionflower</strong> - Calms racing thoughts</li>
          <li style="margin-bottom: var(--space-sm);"><strong>Lavender</strong> - Aromatherapy reduces anxiety</li>
        </ul>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Supplements:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);"><strong>Magnesium Glycinate</strong> (200-400mg) - Relaxes muscles and nervous system</li>
          <li style="margin-bottom: var(--space-sm);"><strong>L-Theanine</strong> (100-200mg) - Promotes calm without drowsiness</li>
          <li style="margin-bottom: var(--space-sm);"><strong>Melatonin</strong> (0.5-3mg) - Start low, use short-term</li>
        </ul>
        <p style="color: var(--color-text-muted); font-style: italic;">
          Consult a healthcare provider before starting supplements, especially if taking medications.
        </p>
      `
    },
    'walking': {
      title: 'Walking for Wellness',
      content: `
        <p style="margin-bottom: var(--space-lg); color: var(--color-text-secondary); line-height: 1.7;">
          Walking is perhaps the most underrated form of exercise. It's free, accessible, and profoundly beneficial.
        </p>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">Benefits of Daily Walking:</h4>
        <ul style="color: var(--color-text-secondary); margin-left: var(--space-lg); margin-bottom: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Reduces risk of heart disease by 31%</li>
          <li style="margin-bottom: var(--space-sm);">Improves mood and reduces depression</li>
          <li style="margin-bottom: var(--space-sm);">Boosts creativity and problem-solving</li>
          <li style="margin-bottom: var(--space-sm);">Supports healthy digestion</li>
          <li style="margin-bottom: var(--space-sm);">Improves sleep quality</li>
        </ul>
        <h4 style="font-family: var(--font-display); margin-bottom: var(--space-sm);">How to Start:</h4>
        <ol style="color: var(--color-text-secondary); margin-left: var(--space-lg);">
          <li style="margin-bottom: var(--space-sm);">Start with 10 minutes daily</li>
          <li style="margin-bottom: var(--space-sm);">Gradually increase to 30 minutes</li>
          <li style="margin-bottom: var(--space-sm);">Walk after meals for added digestive benefits</li>
          <li style="margin-bottom: var(--space-sm);">Try walking meetings or phone calls</li>
          <li style="margin-bottom: var(--space-sm);">Walk in nature when possible for extra benefits</li>
        </ol>
      `
    }
  };
  
  const resource = resources[resourceId];
  if (resource) {
    openModal(resource.title, resource.content);
  }
}

// Toast notification
function showToast(message, duration = 2500) {
  DOM.toastMessage.textContent = message;
  DOM.toast.classList.add('show');
  setTimeout(() => DOM.toast.classList.remove('show'), duration);
}

// Local Storage
function saveAppState() {
  const dataToSave = {
    todayData: AppState.todayData,
    sleep: AppState.sleep,
    lastSaved: new Date().toDateString()
  };
  localStorage.setItem('naturalhealth_holistic', JSON.stringify(dataToSave));
}

function loadAppState() {
  const saved = localStorage.getItem('naturalhealth_holistic');
  if (saved) {
    const data = JSON.parse(saved);
    const today = new Date().toDateString();
    
    // Only load if from today
    if (data.lastSaved === today) {
      AppState.todayData = data.todayData || { consumed: 0, burned: 0, logs: [] };
      AppState.sleep = data.sleep || {};
    }
  }
}

// Utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed'));
  });
}

// Export
window.App = {
  state: AppState,
  navigateTo,
  openModal,
  closeModal,
  showToast,
  addCalories,
  showResourceDetail,
  saveAppState,
  debounce,
  // User module functions (delegated)
  showSignup: () => UserModule.showSignup(),
  showLogin: () => UserModule.showLogin(),
  closeAuthModal: () => UserModule.closeAuthModal(),
  handleSignup: (e) => UserModule.handleSignup(e),
  handleLogin: (e) => UserModule.handleLogin(e),
  enterAsGuest: () => UserModule.enterAsGuest(),
  logout: () => UserModule.logout(),
  toggleUserMenu: () => UserModule.toggleUserMenu(),
  clearAllData: () => UserModule.clearAllData()
};
