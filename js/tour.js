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
  
  // צעדי הסיור - כל צעד מדגיש אלמנט ומסביר אותו
  const tourSteps = [
    {
      // צעד 1: ברוכים הבאים
      target: null, // אין אלמנט ספציפי - מסך פתיחה
      title: '👋 ברוכים הבאים ל-NaturalHealth!',
      content: 'בואו נעשה סיור קצר באפליקציה כדי שתכירו את כל הפיצ\'רים המגניבים.',
      position: 'center'
    },
    {
      // צעד 2: תיבת הקלט של ה-AI
      target: '#wellnessInput',
      title: '🤖 ייעוץ בריאות חכם',
      content: 'ספרו לנו מה מפריע לכם - כאב ראש, עייפות, סטרס - ונקבל המלצות מותאמות אישית! אפשר לכתוב בעברית או באנגלית.',
      position: 'bottom'
    },
    {
      // צעד 3: ניווט תחתון
      target: '.bottom-nav',
      title: '🧭 ניווט קל',
      content: 'כאן תוכלו לעבור בין הקטגוריות: תזונה, שינה, תנועה ומיינד.',
      position: 'top'
    },
    {
      // צעד 4: כפתור Dark Mode
      target: '#darkModeToggle',
      title: '🌙 מצב לילה',
      content: 'לחצו כאן כדי להפעיל מצב כהה - נוח יותר לעיניים בלילה!',
      position: 'bottom'
    },
    {
      // צעד 5: תפריט משתמש
      target: '#userMenuBtn',
      title: '👤 הפרופיל שלכם',
      content: 'כאן תוכלו לראות את הסטטיסטיקות שלכם, רצף הימים, והגדרות אישיות.',
      position: 'bottom'
    },
    {
      // צעד 6: סיום
      target: null,
      title: '🎉 מוכנים להתחיל!',
      content: 'זהו! עכשיו אתם מכירים את האפליקציה. התחילו לחקור ולשפר את הבריאות שלכם!',
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
    // יצירת Overlay (רקע כהה)
    tourOverlay = document.createElement('div');
    tourOverlay.className = 'tour-overlay';
    tourOverlay.innerHTML = `
      <div class="tour-spotlight"></div>
    `;
    
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
          <button class="tour-btn tour-btn-skip">דלג</button>
          <button class="tour-btn tour-btn-next">הבא →</button>
        </div>
      </div>
    `;
    
    // הוספה לדף
    document.body.appendChild(tourOverlay);
    document.body.appendChild(tourTooltip);
    
    // הוספת מאזינים לכפתורים
    tourTooltip.querySelector('.tour-btn-skip').addEventListener('click', endTour);
    tourTooltip.querySelector('.tour-btn-next').addEventListener('click', nextStep);
    
    // לחיצה על ה-overlay גם מקדמת
    tourOverlay.addEventListener('click', nextStep);
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
    
    // עדכון תוכן הטולטיפ
    tourTooltip.querySelector('.tour-title').textContent = step.title;
    tourTooltip.querySelector('.tour-content').textContent = step.content;
    
    // עדכון נקודות התקדמות
    createProgressDots();
    
    // עדכון כפתור (אם זה הצעד האחרון)
    const nextBtn = tourTooltip.querySelector('.tour-btn-next');
    if (stepIndex === tourSteps.length - 1) {
      nextBtn.textContent = '🎉 סיום';
    } else {
      nextBtn.textContent = 'הבא →';
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
    const rect = element.getBoundingClientRect();
    const spotlight = tourOverlay.querySelector('.tour-spotlight');
    
    // מיקום ה-Spotlight מעל האלמנט
    spotlight.style.top = `${rect.top - 8}px`;
    spotlight.style.left = `${rect.left - 8}px`;
    spotlight.style.width = `${rect.width + 16}px`;
    spotlight.style.height = `${rect.height + 16}px`;
    spotlight.style.opacity = '1';
    
    // גלילה לאלמנט אם צריך
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // מיקום הטולטיפ
    setTimeout(() => positionTooltip(rect, position), 300);
  }
  
  /**
   * ממקם את הטולטיפ ביחס לאלמנט
   */
  function positionTooltip(rect, position) {
    const tooltip = tourTooltip;
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top, left;
    
    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 20;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        tooltip.setAttribute('data-position', 'top');
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        tooltip.setAttribute('data-position', 'bottom');
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left - tooltipRect.width - 20;
        tooltip.setAttribute('data-position', 'left');
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + 20;
        tooltip.setAttribute('data-position', 'right');
        break;
      default:
        centerTooltip();
        return;
    }
    
    // וידוא שהטולטיפ לא יוצא מהמסך
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16));
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipRect.height - 16));
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
  
  /**
   * ממרכז את הטולטיפ במסך
   */
  function centerTooltip() {
    const spotlight = tourOverlay.querySelector('.tour-spotlight');
    spotlight.style.opacity = '0';
    
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
    tourOverlay.classList.remove('visible');
    tourTooltip.classList.remove('visible');
    
    // הסרת אלמנטים
    setTimeout(() => {
      if (tourOverlay) tourOverlay.remove();
      if (tourTooltip) tourTooltip.remove();
      tourOverlay = null;
      tourTooltip = null;
    }, 300);
    
    // שמירה שהסיור הושלם
    markTourComplete();
    
    // החזרת גלילה
    document.body.style.overflow = '';
    
    // הודעה למשתמש
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('🎉 מעולה! עכשיו אתם מכירים את האפליקציה');
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

