/**
 * ==============================================
 * NaturalHealth PWA - אפליקציית בריאות הוליסטית
 * ==============================================
 * 
 * זהו הקובץ הראשי של האפליקציה.
 * הוא מכיל את כל הלוגיקה הבסיסית: ניווט, מצב, אירועים, שמירה.
 * 
 * מבנה הקובץ:
 * 1. State - מצב האפליקציה (נתונים)
 * 2. DOM Cache - שמירת אלמנטים מה-HTML
 * 3. Initialization - אתחול כשהדף נטען
 * 4. Event Listeners - מאזינים ללחיצות ואירועים
 * 5. Navigation - מעבר בין מסכים
 * 6. UI Functions - פונקציות תצוגה
 * 7. LocalStorage - שמירה וטעינה מהדפדפן
 * 8. Export - חשיפת פונקציות לשימוש חיצוני
 */


// ===========================================
// === 1. STATE - מצב האפליקציה ===
// ===========================================
// אובייקט שמחזיק את כל הנתונים של האפליקציה במקום אחד.
// זה נקרא "Single Source of Truth" - מקור אמת יחיד.

const AppState = {
  currentView: 'homeView',  // איזה מסך מוצג כרגע
  todayData: {              // נתוני היום
    consumed: 0,            // קלוריות שנאכלו
    burned: 0,              // קלוריות שנשרפו
    logs: []                // רשימת כל הפעולות
  },
  sleep: {                  // נתוני שינה
    hours: null,            // שעות שינה
    quality: null,          // איכות השינה
    bedtime: null           // שעת שינה
  }
};


// ===========================================
// === 2. DOM CACHE - שמירת אלמנטים ===
// ===========================================
// אובייקט ריק שישמור רפרנסים לאלמנטים מה-HTML.
// למה? כי חיפוש באלמנטים (getElementById) הוא יקר,
// אז עדיף לעשות את זה פעם אחת ולשמור.

const DOM = {};


// ===========================================
// === 3. INITIALIZATION - אתחול ===
// ===========================================
// כשהדף נטען לגמרי, מפעילים את פונקציית init.
// DOMContentLoaded = אירוע שקורה כשה-HTML נטען (לפני תמונות).

document.addEventListener('DOMContentLoaded', init);

/**
 * פונקציית האתחול הראשית
 * קוראת לכל הפונקציות שצריכות לרוץ בהתחלה
 */
function init() {
  cacheDOMElements();      // שמור אלמנטים מה-HTML
  loadAppState();          // טען נתונים שמורים מ-LocalStorage
  setupEventListeners();   // הגדר מאזינים לאירועים (קליקים וכו')
  updateGreeting();        // עדכן את הברכה (Good morning וכו')
  updateDate();            // עדכן את התאריך
  loadDailyTip();          // טען את הטיפ היומי
  loadDailyPrompt();       // טען את השאלה ליומן
  updateTrackingDisplay(); // עדכן תצוגת קלוריות
}

/**
 * שמירת רפרנסים לאלמנטים מה-HTML
 * במקום לחפש כל פעם, שומרים פעם אחת ומשתמשים
 */
function cacheDOMElements() {
  // אלמנטים של ניווט ותצוגה
  DOM.views = document.querySelectorAll('.view');           // כל המסכים
  DOM.navItems = document.querySelectorAll('.nav-item');    // כפתורי הניווט
  DOM.pillarCards = document.querySelectorAll('.pillar-card'); // כרטיסי ה-4 עמודים
  DOM.greeting = document.getElementById('greeting');        // אלמנט הברכה
  DOM.currentDate = document.getElementById('currentDate');  // אלמנט התאריך
  
  // אלמנטים של הודעות וחלונות קופצים
  DOM.toast = document.getElementById('toast');              // הודעה קופצת
  DOM.toastMessage = document.getElementById('toastMessage');
  DOM.modalOverlay = document.getElementById('modalOverlay'); // רקע של חלון קופץ
  DOM.modalTitle = document.getElementById('modalTitle');     // כותרת החלון
  DOM.modalBody = document.getElementById('modalBody');       // תוכן החלון
  DOM.modalClose = document.getElementById('modalClose');     // כפתור סגירה
  
  // אלמנטים של מעקב קלוריות
  DOM.showTrackingBtn = document.getElementById('showTrackingBtn');
  DOM.closeTrackingBtn = document.getElementById('closeTrackingBtn');
  DOM.trackingPanel = document.getElementById('trackingPanel');
  DOM.consumedCal = document.getElementById('consumedCal');   // קלוריות שנאכלו
  DOM.burnedCal = document.getElementById('burnedCal');       // קלוריות שנשרפו
  DOM.netCal = document.getElementById('netCal');             // הפרש
  
  // אלמנטים של טיפ יומי ושאלת יומן
  DOM.dailyTipText = document.getElementById('dailyTipText');
  DOM.dailyTipCategory = document.getElementById('dailyTipCategory');
  DOM.todayPrompt = document.getElementById('todayPrompt');
}


// ===========================================
// === 4. EVENT LISTENERS - מאזינים לאירועים ===
// ===========================================
// הגדרת כל המאזינים לקליקים ואירועים אחרים.
// מרוכז במקום אחד לסדר ותחזוקה.

function setupEventListeners() {
  
  // --- מאזינים לניווט ---
  // כשלוחצים על כפתור בתפריט התחתון, עוברים למסך המתאים
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.view);  // dataset.view = הערך של data-view ב-HTML
    });
  });
  
  // כשלוחצים על כרטיס של עמוד (Nutrition, Sleep וכו')
  DOM.pillarCards.forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(card.dataset.view);
    });
  });
  
  // כפתור "Start Journaling" במסך הבית
  document.querySelectorAll('.mindset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.view);
    });
  });
  
  // --- מאזינים לפאנל מעקב קלוריות ---
  // פתיחת הפאנל
  if (DOM.showTrackingBtn) {
    DOM.showTrackingBtn.addEventListener('click', () => {
      DOM.trackingPanel.classList.add('active');    // הצג את הפאנל
      DOM.showTrackingBtn.style.display = 'none';   // הסתר את הכפתור
    });
  }
  
  // סגירת הפאנל
  if (DOM.closeTrackingBtn) {
    DOM.closeTrackingBtn.addEventListener('click', () => {
      DOM.trackingPanel.classList.remove('active'); // הסתר את הפאנל
      DOM.showTrackingBtn.style.display = 'inline-flex'; // הצג את הכפתור
    });
  }
  
  // --- מאזינים לחלון קופץ (Modal) ---
  // סגירה בלחיצה על X
  if (DOM.modalClose) {
    DOM.modalClose.addEventListener('click', closeModal);
  }
  
  // סגירה בלחיצה על הרקע (מחוץ לחלון)
  if (DOM.modalOverlay) {
    DOM.modalOverlay.addEventListener('click', (e) => {
      // רק אם לחצו על הרקע עצמו, לא על התוכן
      if (e.target === DOM.modalOverlay) closeModal();
    });
  }
  
  // סגירה בלחיצה על מקש Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}


// ===========================================
// === 5. NAVIGATION - ניווט בין מסכים ===
// ===========================================
// האפליקציה היא SPA (Single Page Application).
// כל המסכים קיימים ב-HTML, ורק אחד מוצג בכל רגע.
// הניווט פשוט מחליף איזה מסך מקבל class="active".

/**
 * מעבר למסך אחר
 * @param {string} viewName - שם המסך (למשל: 'nutritionView')
 */
function navigateTo(viewName) {
  // עדכון המסכים - רק המסך הנבחר מקבל active
  DOM.views.forEach(view => {
    // classList.toggle(class, condition) - מוסיף אם true, מסיר אם false
    view.classList.toggle('active', view.id === viewName);
  });
  
  // עדכון כפתורי הניווט - רק הכפתור המתאים מקבל active
  DOM.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });
  
  // שמירת המסך הנוכחי ב-State
  AppState.currentView = viewName;
  
  // גלילה לראש העמוד
  window.scrollTo(0, 0);
  
  // טעינת משאבים למסך אם צריך
  loadPillarResources(viewName);
}

/**
 * טעינת משאבים ומוצרים עבור מסכי העמודים
 * נקראת אוטומטית כשעוברים למסך
 */
function loadPillarResources(viewName) {
  // מיפוי בין שם המסך לשם העמוד
  const pillarMap = {
    'nutritionView': 'nutrition',
    'sleepView': 'sleep',
    'movementView': 'movement',
    'mindView': 'mind'
  };
  
  const pillar = pillarMap[viewName];
  
  // אתחול מודול התנועה אם צריך
  if (viewName === 'movementView' && typeof MovementModule !== 'undefined') {
    MovementModule.init();
  }
  
  // אם זה לא מסך עמוד או שאין מודול משאבים, צא
  if (!pillar || typeof ResourcesModule === 'undefined') return;
  
  // מצא את המיכל למשאבים
  const container = document.getElementById(`${pillar}Resources`);
  
  // אם כבר נטען, אל תטען שוב
  if (!container || container.dataset.loaded === 'true') return;
  
  // יצירת HTML למשאבים ומוצרים
  const resourcesHTML = ResourcesModule.renderResourcesSection(pillar);
  const productsHTML = ResourcesModule.renderProductsSection(pillar);
  
  // הכנסה למיכל וסימון שנטען
  container.innerHTML = resourcesHTML + productsHTML;
  container.dataset.loaded = 'true';
}


// ===========================================
// === 6. UI FUNCTIONS - פונקציות תצוגה ===
// ===========================================
// פונקציות שמעדכנות את מה שהמשתמש רואה.

/**
 * עדכון הברכה לפי השעה
 * בוקר/צהריים/ערב/לילה
 */
function updateGreeting() {
  const hour = new Date().getHours();  // קבל את השעה הנוכחית (0-23)
  let greeting = 'Good morning';       // ברירת מחדל
  
  // בחירת ברכה לפי השעה
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 21) greeting = 'Good evening';
  else if (hour >= 21 || hour < 5) greeting = 'Good night';
  
  // עדכון האלמנט ב-HTML
  if (DOM.greeting) DOM.greeting.textContent = greeting;
}

/**
 * עדכון התאריך
 * מציג יום בשבוע, חודש ומספר
 */
function updateDate() {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('en-US', options);
  if (DOM.currentDate) DOM.currentDate.textContent = today;
}

/**
 * טעינת הטיפ היומי מקובץ JSON
 * משתמש ב-async/await לקריאה אסינכרונית
 */
async function loadDailyTip() {
  try {
    // קריאת קובץ ה-JSON
    const response = await fetch('/data/tips.json');
    const data = await response.json();
    const tips = data.tips;
    
    // בחירת טיפ לפי היום בשנה (כך כל יום יש טיפ אחר)
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const tip = tips[dayOfYear % tips.length];  // מודולו כדי לחזור למעגל
    
    // עדכון התצוגה
    if (DOM.dailyTipText) DOM.dailyTipText.textContent = tip.text;
    if (DOM.dailyTipCategory) DOM.dailyTipCategory.textContent = tip.category;
  } catch (error) {
    // אם נכשל, הצג טיפ ברירת מחדל
    console.log('Using default tip');
    if (DOM.dailyTipText) DOM.dailyTipText.textContent = 'Take a moment to breathe deeply and appreciate this present moment.';
    if (DOM.dailyTipCategory) DOM.dailyTipCategory.textContent = 'mindfulness';
  }
}

/**
 * טעינת שאלת היומן היומית
 * שאלה שונה לכל יום בשבוע
 */
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
  
  const dayOfWeek = new Date().getDay();  // 0 = ראשון, 6 = שבת
  if (DOM.todayPrompt) {
    DOM.todayPrompt.textContent = prompts[dayOfWeek];
  }
}

/**
 * עדכון תצוגת מעקב קלוריות
 */
function updateTrackingDisplay() {
  if (DOM.consumedCal) DOM.consumedCal.textContent = AppState.todayData.consumed;
  if (DOM.burnedCal) DOM.burnedCal.textContent = AppState.todayData.burned;
  if (DOM.netCal) DOM.netCal.textContent = AppState.todayData.consumed - AppState.todayData.burned;
}

/**
 * הוספת קלוריות (נאכלו או נשרפו)
 * @param {string} type - 'consumed' או 'burned'
 * @param {number} amount - כמות קלוריות
 * @param {string} name - שם הפריט
 */
function addCalories(type, amount, name) {
  // עדכון הסכום המתאים
  if (type === 'consumed') {
    AppState.todayData.consumed += amount;
  } else {
    AppState.todayData.burned += amount;
  }
  
  // הוספה ללוג
  AppState.todayData.logs.push({
    type,
    name,
    calories: amount,
    time: new Date().toISOString()
  });
  
  // עדכון התצוגה ושמירה
  updateTrackingDisplay();
  saveAppState();
  showToast(`Added ${name}`);
}


// ===========================================
// === MODAL - חלון קופץ ===
// ===========================================

/**
 * פתיחת חלון קופץ
 * @param {string} title - כותרת החלון
 * @param {string} content - תוכן HTML
 */
function openModal(title, content) {
  DOM.modalTitle.textContent = title;
  DOM.modalBody.innerHTML = content;
  DOM.modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';  // מניעת גלילה ברקע
}

/**
 * סגירת חלון קופץ
 */
function closeModal() {
  DOM.modalOverlay.classList.remove('active');
  document.body.style.overflow = '';  // החזרת גלילה
}

/**
 * הצגת פרטי משאב (מדריך)
 * כשלוחצים על כרטיס משאב, נפתח חלון עם המידע המלא
 * @param {string} resourceId - מזהה המשאב
 */
function showResourceDetail(resourceId) {
  // מאגר כל המשאבים עם התוכן שלהם
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
  
  // מציאת המשאב ופתיחת המודאל
  const resource = resources[resourceId];
  if (resource) {
    openModal(resource.title, resource.content);
  }
}


// ===========================================
// === TOAST - הודעה קופצת ===
// ===========================================

/**
 * הצגת הודעה קופצת (toast notification)
 * @param {string} message - ההודעה להצגה
 * @param {number} duration - משך הזמן במילישניות (ברירת מחדל: 2500)
 */
function showToast(message, duration = 2500) {
  DOM.toastMessage.textContent = message;
  DOM.toast.classList.add('show');
  // הסתרה אוטומטית אחרי הזמן שנקבע
  setTimeout(() => DOM.toast.classList.remove('show'), duration);
}


// ===========================================
// === 7. LOCAL STORAGE - שמירה מקומית ===
// ===========================================
// LocalStorage שומר נתונים בדפדפן גם אחרי סגירה.
// הנתונים נשמרים כטקסט, לכן משתמשים ב-JSON.stringify/parse.

/**
 * שמירת מצב האפליקציה ל-LocalStorage
 */
function saveAppState() {
  const dataToSave = {
    todayData: AppState.todayData,
    sleep: AppState.sleep,
    lastSaved: new Date().toDateString()  // תאריך השמירה
  };
  // המרה לטקסט ושמירה
  localStorage.setItem('naturalhealth_holistic', JSON.stringify(dataToSave));
}

/**
 * טעינת מצב האפליקציה מ-LocalStorage
 */
function loadAppState() {
  const saved = localStorage.getItem('naturalhealth_holistic');
  if (saved) {
    const data = JSON.parse(saved);  // המרה מטקסט לאובייקט
    const today = new Date().toDateString();
    
    // טעינה רק אם הנתונים מהיום (לא מאתמול)
    if (data.lastSaved === today) {
      AppState.todayData = data.todayData || { consumed: 0, burned: 0, logs: [] };
      AppState.sleep = data.sleep || {};
    }
  }
}


// ===========================================
// === UTILITY - פונקציות עזר ===
// ===========================================

/**
 * Debounce - מניעת קריאות חוזרות מהירות
 * משמש למשל בחיפוש - מחכה שהמשתמש יסיים להקליד
 * @param {Function} func - הפונקציה להרצה
 * @param {number} wait - זמן המתנה במילישניות
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);  // ביטול טיימר קודם
    timeout = setTimeout(() => func(...args), wait);  // הגדרת טיימר חדש
  };
}


// ===========================================
// === SERVICE WORKER - עבודה אופליין ===
// ===========================================
// Service Worker מאפשר לאפליקציה לעבוד גם בלי אינטרנט.
// הוא שומר קבצים ב-cache ומגיש אותם כשאין רשת.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))  // הרשמה הצליחה
      .catch(err => console.log('SW registration failed'));  // הרשמה נכשלה
  });
}


// ===========================================
// === 8. EXPORT - חשיפה לשימוש חיצוני ===
// ===========================================
// window.App הוא אובייקט גלובלי שמכיל את כל הפונקציות
// שרוצים לחשוף לשימוש מקבצים אחרים או מה-HTML.
// זה נקרא "Module Pattern" - תבנית מודול.

window.App = {
  // נתונים
  state: AppState,
  
  // פונקציות ניווט ותצוגה
  navigateTo,
  openModal,
  closeModal,
  showToast,
  addCalories,
  showResourceDetail,
  saveAppState,
  debounce,
  
  // פונקציות משתמש (מועברות למודול UserModule)
  // האצלה (delegation) - App קורא לפונקציות של מודול אחר
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


// ===========================================
// === DARK MODE - מצב כהה ===
// ===========================================
// תכונה שהוספנו - מאפשרת למשתמש לעבור לצבעים כהים.

/**
 * החלפת מצב כהה/בהיר
 * toggle = אם יש מסיר, אם אין מוסיף
 */
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  // שמירת הבחירה ל-LocalStorage
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

/**
 * טעינת העדפת מצב כהה בעת הפעלה
 */
function loadDarkMode() {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
  }
}

// הוספת מאזין לכפתור Dark Mode
document.addEventListener('DOMContentLoaded', function() {
  loadDarkMode();  // טען העדפה שמורה
  
  // חבר את הכפתור לפונקציה
  const darkModeBtn = document.getElementById('darkModeToggle');
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
  }
});
