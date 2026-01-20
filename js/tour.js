/**
 * ==============================================
 * Interactive Tour - סיור אינטראקטיבי למשתמשים חדשים
 * ==============================================
 * 
 * מודול זה מציג סיור מודרך באפליקציה למשתמשים חדשים.
 * הוא מדגיש אלמנטים שונים ומסביר את הפיצ'רים.
 * 
 * איך זה עובד:
 * 1. בדיקה אם המשתמש כבר ראה את הסיור (localStorage)
 * 2. אם לא - מציג overlay עם הדגשה של אלמנט ספציפי
 * 3. כל צעד מסביר פיצ'ר אחר
 * 4. בסיום - שומר שהמשתמש סיים את הסיור
 * 
 * ==============================================
 */

const AppTour = (function() {
  
  // ===========================================
  // === הגדרות הסיור ===
  // ===========================================
  
  // Tour steps - comprehensive tour through all features and categories
  const tourSteps = [
    // === WELCOME ===
    {
      target: null,
      title: '🌿 Welcome to NaturalHealth!',
      content: 'Your personal holistic wellness companion. Let\'s explore all the natural tools to help you feel your best.',
      position: 'center'
    },
    
    // === AI ADVISOR ===
    {
      target: '#wellnessInput',
      title: '🤖 Smart Wellness Advisor',
      content: 'Describe how you\'re feeling - tired, stressed, headache - and get personalized natural recommendations instantly!',
      position: 'bottom'
    },
    
    // === NAVIGATION ===
    {
      target: '.bottom-nav',
      title: '🧭 Your Wellness Pillars',
      content: 'Navigate between the four pillars of holistic health: Nutrition, Sleep, Movement, and Mind.',
      position: 'top'
    },
    
    // === NUTRITION SECTION ===
    {
      target: '[data-view="nutritionView"]',
      title: '🥗 Nutrition Hub',
      content: 'Tap here to explore healthy eating! Track calories, discover superfoods, and get personalized meal suggestions.',
      position: 'top',
      action: () => { if (typeof App !== 'undefined') App.navigateTo('nutritionView'); }
    },
    {
      target: '.calorie-tracker',
      title: '📊 Calorie Tracker',
      content: 'Log your meals and track daily calories. Search thousands of foods with accurate nutritional data.',
      position: 'bottom'
    },
    
    // === SLEEP SECTION ===
    {
      target: '[data-view="sleepView"]',
      title: '😴 Sleep Sanctuary',
      content: 'Tap here to improve your sleep! Track sleep quality, discover relaxation techniques, and build healthy bedtime habits.',
      position: 'top',
      action: () => { if (typeof App !== 'undefined') App.navigateTo('sleepView'); }
    },
    {
      target: '.sleep-tracker',
      title: '🌙 Sleep Journal',
      content: 'Log your sleep hours and quality. See patterns and get tips for better rest.',
      position: 'bottom'
    },
    
    // === MOVEMENT SECTION ===
    {
      target: '[data-view="movementView"]',
      title: '🏃 Movement Center',
      content: 'Tap here to get moving! Track steps, follow workout routines, and stay active every day.',
      position: 'top',
      action: () => { if (typeof App !== 'undefined') App.navigateTo('movementView'); }
    },
    {
      target: '.step-tracker',
      title: '👟 Step Counter',
      content: 'Track your daily steps and set goals. Every step counts towards a healthier you!',
      position: 'bottom'
    },
    
    // === MIND SECTION ===
    {
      target: '[data-view="mindView"]',
      title: '🧘 Mindfulness Corner',
      content: 'Tap here to nurture your mind! Practice gratitude, journal your thoughts, and find inner peace.',
      position: 'top',
      action: () => { if (typeof App !== 'undefined') App.navigateTo('mindView'); }
    },
    {
      target: '.journal-section',
      title: '📝 Gratitude Journal',
      content: 'Write down what you\'re grateful for. Daily journaling boosts happiness and reduces stress.',
      position: 'bottom'
    },
    
    // === BACK TO HOME ===
    {
      target: '[data-view="homeView"]',
      title: '🏠 Home Dashboard',
      content: 'Return to your personalized dashboard anytime to see your progress and daily recommendations.',
      position: 'top',
      action: () => { if (typeof App !== 'undefined') App.navigateTo('homeView'); }
    },
    
    // === HEADER FEATURES ===
    {
      target: '#darkModeToggle',
      title: '🌙 Dark Mode',
      content: 'Easy on the eyes! Toggle dark mode for a comfortable viewing experience, especially at night.',
      position: 'bottom'
    },
    {
      target: '#userMenuBtn',
      title: '👤 Your Profile',
      content: 'View your streak, track progress over time, and customize your wellness journey.',
      position: 'bottom'
    },
    
    // === FINISH ===
    {
      target: null,
      title: '🌟 You\'re Ready!',
      content: 'That\'s everything! Start your wellness journey today. Remember: small daily habits lead to big transformations.',
      position: 'center'
    }
  ];
  
  // משתנים פנימיים
  let currentStep = 0;
  let tourOverlay = null;
  let tourTooltip = null;
  let isActive = false;
  
  
  // ===========================================
  // === בדיקה אם להציג את הסיור ===
  // ===========================================
  
  /**
   * בודק אם המשתמש כבר ראה את הסיור
   */
  function shouldShowTour() {
    return !localStorage.getItem('tourCompleted');
  }
  
  /**
   * מסמן שהסיור הושלם
   */
  function markTourComplete() {
    localStorage.setItem('tourCompleted', 'true');
  }
  
  /**
   * מאפס את הסיור (לבדיקות)
   */
  function resetTour() {
    localStorage.removeItem('tourCompleted');
  }
  
  
  // ===========================================
  // === יצירת אלמנטי הסיור ===
  // ===========================================
  
  /**
   * יוצר את ה-overlay והטולטיפ
   */
  function createTourElements() {
    // יצירת Overlay (רקע כהה) - נפרד מה-spotlight
    tourOverlay = document.createElement('div');
    tourOverlay.className = 'tour-overlay';
    
    // יצירת Spotlight בנפרד (כדי שה-box-shadow יעבוד)
    const spotlight = document.createElement('div');
    spotlight.className = 'tour-spotlight';
    spotlight.id = 'tourSpotlight';
    
    // יצירת Tooltip (תיבת ההסבר)
    tourTooltip = document.createElement('div');
    tourTooltip.className = 'tour-tooltip';
    tourTooltip.innerHTML = `
      <div class="tour-tooltip-arrow"></div>
      <div class="tour-tooltip-content">
        <h3 class="tour-title"></h3>
        <p class="tour-content"></p>
        <div class="tour-progress">
          <div class="tour-dots"></div>
        </div>
        <div class="tour-actions">
          <button class="tour-btn tour-btn-skip">Skip</button>
          <button class="tour-btn tour-btn-next">Next →</button>
        </div>
      </div>
    `;
    
    // הוספה לדף - spotlight חייב להיות נפרד
    document.body.appendChild(spotlight);
    document.body.appendChild(tourOverlay);
    document.body.appendChild(tourTooltip);
    
    // הוספת מאזינים לכפתורים
    tourTooltip.querySelector('.tour-btn-skip').addEventListener('click', endTour);
    tourTooltip.querySelector('.tour-btn-next').addEventListener('click', nextStep);
    
    // לחיצה על ה-spotlight מקדמת
    spotlight.addEventListener('click', nextStep);
  }
  
  /**
   * יוצר את נקודות ההתקדמות
   */
  function createProgressDots() {
    const dotsContainer = tourTooltip.querySelector('.tour-dots');
    dotsContainer.innerHTML = tourSteps.map((_, index) => 
      `<span class="tour-dot ${index === currentStep ? 'active' : ''}"></span>`
    ).join('');
  }
  
  
  // ===========================================
  // === הצגת צעד בסיור ===
  // ===========================================
  
  /**
   * מציג צעד ספציפי בסיור
   */
  function showStep(stepIndex) {
    const step = tourSteps[stepIndex];
    if (!step) return;
    
    currentStep = stepIndex;
    
    // אם יש פעולה (כמו ניווט לדף אחר) - בצע אותה קודם
    if (step.action && typeof step.action === 'function') {
      step.action();
      // המתנה קצרה לסיום הניווט
      setTimeout(() => continueShowStep(step, stepIndex), 400);
    } else {
      continueShowStep(step, stepIndex);
    }
  }
  
  /**
   * ממשיך את הצגת הצעד אחרי ניווט (אם היה)
   */
  function continueShowStep(step, stepIndex) {
    // עדכון תוכן הטולטיפ
    tourTooltip.querySelector('.tour-title').textContent = step.title;
    tourTooltip.querySelector('.tour-content').textContent = step.content;
    
    // עדכון נקודות התקדמות
    createProgressDots();
    
    // עדכון כפתור (אם זה הצעד האחרון)
    const nextBtn = tourTooltip.querySelector('.tour-btn-next');
    if (stepIndex === tourSteps.length - 1) {
      nextBtn.textContent = '🎉 Finish';
    } else {
      nextBtn.textContent = 'Next →';
    }
    
    // הדגשת האלמנט המתאים
    if (step.target) {
      const targetEl = document.querySelector(step.target);
      if (targetEl) {
        highlightElement(targetEl, step.position);
      } else {
        // אלמנט לא נמצא - מרכז
        centerTooltip();
      }
    } else {
      // אין אלמנט - מרכז את הטולטיפ
      centerTooltip();
    }
    
    // אנימציית כניסה
    tourTooltip.classList.add('visible');
  }
  
  /**
   * מדגיש אלמנט ומציב את הטולטיפ לידו
   */
  function highlightElement(element, position) {
    const spotlight = document.getElementById('tourSpotlight');
    
    // גלילה לאלמנט אם צריך (לפני קבלת המיקום)
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // המתנה קצרה לסיום הגלילה ואז מיקום
    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      
      // מיקום ה-Spotlight מעל האלמנט עם padding
      const padding = 10;
      spotlight.style.top = `${rect.top - padding}px`;
      spotlight.style.left = `${rect.left - padding}px`;
      spotlight.style.width = `${rect.width + padding * 2}px`;
      spotlight.style.height = `${rect.height + padding * 2}px`;
      spotlight.style.opacity = '1';
      spotlight.classList.add('visible');
      
      // מיקום הטולטיפ
      positionTooltip(rect, position);
    }, 400);
  }
  
  /**
   * ממקם את הטולטיפ ביחס לאלמנט
   * מתאים אוטומטית אם אין מקום
   */
  function positionTooltip(rect, position) {
    const tooltip = tourTooltip;
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const margin = 20;
    
    // איפוס transform
    tooltip.style.transform = '';
    
    let top, left;
    let actualPosition = position;
    
    // בדיקה אם יש מקום למיקום המבוקש, אחרת התאמה
    if (position === 'bottom' && rect.bottom + tooltipRect.height + margin > windowHeight) {
      actualPosition = 'top';
    } else if (position === 'top' && rect.top - tooltipRect.height - margin < 0) {
      actualPosition = 'bottom';
    }
    
    switch (actualPosition) {
      case 'top':
        top = rect.top - tooltipRect.height - margin;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        tooltip.setAttribute('data-position', 'top');
        break;
      case 'bottom':
        top = rect.bottom + margin;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        tooltip.setAttribute('data-position', 'bottom');
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left - tooltipRect.width - margin;
        tooltip.setAttribute('data-position', 'left');
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + margin;
        tooltip.setAttribute('data-position', 'right');
        break;
      default:
        centerTooltip();
        return;
    }
    
    // וידוא שהטולטיפ לא יוצא מהמסך
    left = Math.max(16, Math.min(left, windowWidth - tooltipRect.width - 16));
    top = Math.max(80, Math.min(top, windowHeight - tooltipRect.height - 16)); // מינימום 80px מלמעלה
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
  
  /**
   * ממרכז את הטולטיפ במסך (כשאין אלמנט להדגיש)
   */
  function centerTooltip() {
    const spotlight = document.getElementById('tourSpotlight');
    if (spotlight) {
      spotlight.style.opacity = '0';
      spotlight.classList.remove('visible');
    }
    
    tourTooltip.style.top = '50%';
    tourTooltip.style.left = '50%';
    tourTooltip.style.transform = 'translate(-50%, -50%)';
    tourTooltip.setAttribute('data-position', 'center');
  }
  
  
  // ===========================================
  // === ניווט בסיור ===
  // ===========================================
  
  /**
   * מעבר לצעד הבא
   */
  function nextStep() {
    if (currentStep < tourSteps.length - 1) {
      tourTooltip.classList.remove('visible');
      setTimeout(() => {
        showStep(currentStep + 1);
      }, 200);
    } else {
      endTour();
    }
  }
  
  /**
   * מעבר לצעד הקודם
   */
  function prevStep() {
    if (currentStep > 0) {
      tourTooltip.classList.remove('visible');
      setTimeout(() => {
        showStep(currentStep - 1);
      }, 200);
    }
  }
  
  
  // ===========================================
  // === התחלה וסיום הסיור ===
  // ===========================================
  
  /**
   * מתחיל את הסיור
   */
  function startTour() {
    if (isActive) return;
    
    isActive = true;
    currentStep = 0;
    
    // יצירת אלמנטים
    createTourElements();
    
    // הצגת ה-overlay
    setTimeout(() => {
      tourOverlay.classList.add('visible');
      showStep(0);
    }, 100);
    
    // מניעת גלילה
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * מסיים את הסיור
   */
  function endTour() {
    if (!isActive) return;
    
    isActive = false;
    
    // אנימציית יציאה
    const spotlight = document.getElementById('tourSpotlight');
    if (spotlight) spotlight.classList.remove('visible');
    tourOverlay.classList.remove('visible');
    tourTooltip.classList.remove('visible');
    
    // הסרת אלמנטים
    setTimeout(() => {
      if (spotlight) spotlight.remove();
      if (tourOverlay) tourOverlay.remove();
      if (tourTooltip) tourTooltip.remove();
      tourOverlay = null;
      tourTooltip = null;
    }, 300);
    
    // שמירה שהסיור הושלם
    markTourComplete();
    
    // החזרת גלילה
    document.body.style.overflow = '';
    
    // Show completion message
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('🎉 Awesome! You\'re ready to explore the app');
    }
  }
  
  
  // ===========================================
  // === אתחול ===
  // ===========================================
  
  /**
   * מאתחל את מודול הסיור
   * מתחיל אוטומטית אם המשתמש חדש
   */
  function init() {
    // בדיקה אם להציג את הסיור (רק למשתמשים חדשים)
    if (shouldShowTour()) {
      // המתנה קצרה עד שהדף נטען
      setTimeout(startTour, 1500);
    }
  }
  
  // אתחול כשהדף נטען
  document.addEventListener('DOMContentLoaded', init);
  
  
  // ===========================================
  // === חשיפת פונקציות ציבוריות ===
  // ===========================================
  
  return {
    start: startTour,     // התחלת סיור ידנית
    end: endTour,         // סיום הסיור
    reset: resetTour,     // איפוס (יציג שוב בפעם הבאה)
    next: nextStep,       // צעד הבא
    prev: prevStep        // צעד קודם
  };
  
})();

// חשיפה גלובלית
window.AppTour = AppTour;

