/**
 * ==============================================
 * NaturalHealth PWA - מודול תנועה וכושר
 * ==============================================
 * 
 * מודול זה מטפל במעקב תנועה:
 * - מונה צעדים יומי
 * - לוח אימונים (קלנדר)
 * - סרטוני אימון מומלצים (YouTube)
 * 
 * הנתונים נשמרים ב-LocalStorage.
 */

const MovementModule = (function() {
  

  // ===========================================
  // === State - מצב המודול ===
  // ===========================================
  
  let state = {
    dailyStepGoal: 10000,     // יעד צעדים יומי
    todaySteps: 0,            // צעדים שנספרו היום
    workoutDays: {},          // ימי אימון: { '2024-01-15': { completed: true, type: 'strength' } }
    currentMonth: new Date()  // החודש המוצג בקלנדר
  };
  

  // ===========================================
  // === מאגר סרטוני אימון ===
  // ===========================================
  // סרטוני YouTube מומלצים לפי קטגוריה
  
  const workoutVideos = {
    // אימונים למתחילים
    beginner: [
      { name: '20 Min Full Body Workout - No Equipment', channel: 'MadFit', url: 'https://www.youtube.com/watch?v=UItWltVZZmE', duration: '20 min' },
      { name: 'Beginner HIIT Workout', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI', duration: '30 min' },
      { name: '30 Min Walking Workout', channel: 'Grow with Jo', url: 'https://www.youtube.com/watch?v=X3gBiF-Ey1U', duration: '30 min' },
      { name: 'Yoga for Complete Beginners', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', duration: '20 min' }
    ],
    // אימוני כוח
    strength: [
      { name: 'Full Body Strength - No Equipment', channel: 'Sydney Cummings', url: 'https://www.youtube.com/watch?v=UBMk30rjy0o', duration: '40 min' },
      { name: 'Dumbbell Full Body Workout', channel: 'Caroline Girvan', url: 'https://www.youtube.com/watch?v=Z8_PggYXbIg', duration: '45 min' },
      { name: 'Bodyweight Strength Training', channel: 'Fitness Blender', url: 'https://www.youtube.com/watch?v=9FBIaqr7TjQ', duration: '35 min' },
      { name: 'Upper Body Strength', channel: 'Heather Robertson', url: 'https://www.youtube.com/watch?v=Ek_9K8j8r2Q', duration: '30 min' }
    ],
    // אימוני קרדיו
    cardio: [
      { name: '30 Min Dance Cardio', channel: 'MadFit', url: 'https://www.youtube.com/watch?v=ZWk19OVon2k', duration: '30 min' },
      { name: 'Low Impact Cardio', channel: 'Team Body Project', url: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8', duration: '30 min' },
      { name: 'Tabata HIIT Cardio', channel: 'THENX', url: 'https://www.youtube.com/watch?v=Mvo2snJGhtM', duration: '20 min' },
      { name: 'Boxing Cardio Workout', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=sE3CkqyJ6gc', duration: '30 min' }
    ],
    // יוגה
    yoga: [
      { name: 'Morning Yoga Flow', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=4pKly2JojMw', duration: '20 min' },
      { name: 'Yoga for Flexibility', channel: 'Boho Beautiful', url: 'https://www.youtube.com/watch?v=Yzm3fA2HhkQ', duration: '30 min' },
      { name: 'Power Yoga', channel: 'Yoga With Tim', url: 'https://www.youtube.com/watch?v=9kOCY0KNByw', duration: '45 min' },
      { name: 'Bedtime Yoga', channel: 'Yoga With Kassandra', url: 'https://www.youtube.com/watch?v=v7SN-d4qXx0', duration: '15 min' }
    ],
    // מתיחות
    stretching: [
      { name: 'Full Body Stretch', channel: 'MadFit', url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A', duration: '15 min' },
      { name: 'Mobility Routine', channel: 'Tom Merrick', url: 'https://www.youtube.com/watch?v=SsT_go-LBQU', duration: '20 min' },
      { name: 'Hip Opening Stretches', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=Ho8rEY8O0_Y', duration: '20 min' },
      { name: 'Office Stretches', channel: 'Tone It Up', url: 'https://www.youtube.com/watch?v=M-8FvC3GD8c', duration: '10 min' }
    ]
  };
  

  // ===========================================
  // === אתחול ===
  // ===========================================

  /**
   * מאתחל את המודול
   */
  function init() {
    loadState();             // טען נתונים שמורים
    renderStepTracker();     // צייר את מונה הצעדים
    renderCalendar();        // צייר את הקלנדר
    renderWorkoutVideos();   // צייר את רשימת הסרטונים
    setupEventListeners();   // הגדר מאזינים
  }
  

  // ===========================================
  // === LocalStorage ===
  // ===========================================

  /**
   * טוען את המצב מ-LocalStorage
   */
  function loadState() {
    const saved = localStorage.getItem('naturalhealth_movement');
    if (saved) {
      const data = JSON.parse(saved);
      state.dailyStepGoal = data.dailyStepGoal || 10000;
      state.workoutDays = data.workoutDays || {};
      
      // טען צעדים רק אם נשמרו היום
      const today = new Date().toISOString().split('T')[0];
      if (data.lastStepDate === today) {
        state.todaySteps = data.todaySteps || 0;
      }
    }
  }

  /**
   * שומר את המצב ל-LocalStorage
   */
  function saveState() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('naturalhealth_movement', JSON.stringify({
      dailyStepGoal: state.dailyStepGoal,
      todaySteps: state.todaySteps,
      lastStepDate: today,        // תאריך השמירה (לבדיקה אם זה היום)
      workoutDays: state.workoutDays
    }));
  }
  

  // ===========================================
  // === Event Listeners - מאזינים ===
  // ===========================================

  /**
   * הגדרת מאזינים לאירועים
   */
  function setupEventListeners() {
    // --- שדה יעד צעדים ---
    const goalInput = document.getElementById('stepGoalInput');
    if (goalInput) {
      goalInput.addEventListener('change', (e) => {
        const newGoal = parseInt(e.target.value);
        if (newGoal > 0) {
          state.dailyStepGoal = newGoal;
          saveState();
          renderStepTracker();
          App.showToast(`Step goal set to ${newGoal.toLocaleString()}`);
        }
      });
    }
    
    // --- כפתור הוספת צעדים ---
    const addStepsBtn = document.getElementById('addStepsBtn');
    if (addStepsBtn) {
      addStepsBtn.addEventListener('click', openAddStepsModal);
    }
    
    // --- ניווט בקלנדר ---
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
        renderCalendar();
      });
    }
    
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
        renderCalendar();
      });
    }
  }
  

  // ===========================================
  // === מונה צעדים ===
  // ===========================================

  /**
   * מצייר את מונה הצעדים עם עיגול התקדמות
   */
  function renderStepTracker() {
    const container = document.getElementById('stepTrackerContent');
    if (!container) return;
    
    // חישוב אחוז ההתקדמות (מקסימום 100%)
    const progress = Math.min((state.todaySteps / state.dailyStepGoal) * 100, 100);
    
    // חישובים לעיגול SVG
    const circumference = 2 * Math.PI * 45;  // היקף העיגול
    const offset = circumference - (progress / 100) * circumference;  // כמה "להסתיר"
    
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: var(--space-lg);">
        <!-- עיגול התקדמות SVG -->
        <div style="position: relative; width: 140px; height: 140px; margin: 0 auto var(--space-md);">
          <svg viewBox="0 0 100 100" style="transform: rotate(-90deg);">
            <!-- רקע (עיגול אפור) -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-bg-elevated)" stroke-width="8"/>
            <!-- התקדמות (עיגול כתום) -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-movement)" stroke-width="8" 
                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"
                    style="transition: stroke-dashoffset 0.5s ease;"/>
          </svg>
          <!-- מספר הצעדים באמצע -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary);">${state.todaySteps.toLocaleString()}</div>
            <div style="font-size: 0.6875rem; color: var(--color-text-muted); text-transform: uppercase;">steps</div>
          </div>
        </div>
        
        <!-- הודעת יעד -->
        <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: var(--space-md);">
          Goal: <strong>${state.dailyStepGoal.toLocaleString()}</strong> steps
          ${progress >= 100 ? ' ✅ Goal reached!' : ` (${Math.round(progress)}%)`}
        </p>
        
        <!-- כפתור הוספת צעדים -->
        <button id="addStepsBtn" class="wellness-submit-btn" style="background: var(--color-movement);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Log Steps
        </button>
      </div>
      
      <!-- שדה לשינוי יעד -->
      <div style="background: var(--color-bg-input); padding: var(--space-md); border-radius: var(--radius-md); margin-top: var(--space-lg);">
        <label style="font-size: 0.8125rem; color: var(--color-text-muted); display: block; margin-bottom: var(--space-sm);">
          Daily Step Goal:
        </label>
        <input type="number" id="stepGoalInput" value="${state.dailyStepGoal}" min="1000" step="500"
               style="width: 100%; padding: var(--space-sm); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 1rem; color: var(--color-text-primary);">
      </div>
      
      <!-- טיפ -->
      <div style="margin-top: var(--space-lg); padding: var(--space-md); background: rgba(245, 169, 98, 0.1); border-radius: var(--radius-md); border-left: 3px solid var(--color-movement);">
        <p style="font-size: 0.8125rem; color: var(--color-text-secondary); margin: 0;">
          <strong>Tip:</strong> Connect your phone's health app or Apple Watch for automatic step tracking. 
          Manual entry is available above.
        </p>
      </div>
    `;
    
    // חיבור מאזינים מחדש (כי ה-HTML נוצר מחדש)
    setTimeout(setupEventListeners, 0);
  }
  

  // ===========================================
  // === מודאל הוספת צעדים ===
  // ===========================================

  /**
   * פותח מודאל להוספת צעדים
   */
  function openAddStepsModal() {
    const content = `
      <form id="addStepsForm" style="display: flex; flex-direction: column; gap: var(--space-lg);">
        <div>
          <label style="font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); display: block; margin-bottom: var(--space-sm);">
            Number of Steps
          </label>
          <input type="number" id="stepsInput" placeholder="e.g., 5000" min="1" required
                 style="width: 100%; padding: var(--space-md); background: var(--color-bg-input); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 1.25rem; color: var(--color-text-primary);">
        </div>
        
        <!-- כפתורי הוספה מהירה -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm);">
          <button type="button" class="quick-step-btn" data-steps="1000" style="padding: var(--space-sm); background: var(--color-bg-input); border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer;">+1,000</button>
          <button type="button" class="quick-step-btn" data-steps="2500" style="padding: var(--space-sm); background: var(--color-bg-input); border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer;">+2,500</button>
          <button type="button" class="quick-step-btn" data-steps="5000" style="padding: var(--space-sm); background: var(--color-bg-input); border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer;">+5,000</button>
        </div>
        
        <button type="submit" class="form-submit" style="background: var(--color-movement);">Add Steps</button>
      </form>
    `;
    
    App.openModal('Log Steps', content);
    
    // הגדרת מאזינים לטופס
    setTimeout(() => {
      const form = document.getElementById('addStepsForm');
      const input = document.getElementById('stepsInput');
      
      // כפתורי הוספה מהירה
      document.querySelectorAll('.quick-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const steps = parseInt(btn.dataset.steps);
          input.value = (parseInt(input.value) || 0) + steps;
        });
      });
      
      // שליחת הטופס
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const steps = parseInt(input.value);
        if (steps > 0) {
          addSteps(steps);
          App.closeModal();
        }
      });
      
      input.focus();
    }, 100);
  }

  /**
   * מוסיף צעדים למונה
   * @param {number} steps - מספר צעדים להוספה
   */
  function addSteps(steps) {
    state.todaySteps += steps;
    saveState();
    renderStepTracker();
    
    // הודעה מיוחדת אם הגיע ליעד
    if (state.todaySteps >= state.dailyStepGoal) {
      App.showToast('🎉 Congratulations! You reached your step goal!');
    } else {
      App.showToast(`Added ${steps.toLocaleString()} steps`);
    }
  }
  

  // ===========================================
  // === לוח אימונים (קלנדר) ===
  // ===========================================

  /**
   * מצייר את לוח האימונים
   */
  function renderCalendar() {
    const container = document.getElementById('workoutCalendar');
    if (!container) return;
    
    // חישוב נתוני החודש
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);        // יום ראשון בחודש
    const lastDay = new Date(year, month + 1, 0);     // יום אחרון בחודש
    const startDay = firstDay.getDay();               // באיזה יום בשבוע מתחיל
    const daysInMonth = lastDay.getDate();            // כמה ימים בחודש
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const today = new Date().toISOString().split('T')[0];
    
    // ספירת ימי אימון בחודש
    let workoutCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (state.workoutDays[dateStr]?.completed) workoutCount++;
    }
    
    // בניית ה-HTML
    let html = `
      <!-- כותרת וניווט -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
        <button id="prevMonthBtn" style="background: none; border: none; padding: var(--space-sm); cursor: pointer; color: var(--color-text-muted);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div style="text-align: center;">
          <h4 style="font-family: var(--font-display); font-size: 1.125rem; color: var(--color-text-primary); margin: 0;">${monthNames[month]} ${year}</h4>
          <p style="font-size: 0.75rem; color: var(--color-movement); margin: 4px 0 0;">${workoutCount} workout${workoutCount !== 1 ? 's' : ''} this month</p>
        </div>
        <button id="nextMonthBtn" style="background: none; border: none; padding: var(--space-sm); cursor: pointer; color: var(--color-text-muted);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      
      <!-- גריד הקלנדר -->
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center;">
        <!-- כותרות ימי השבוע -->
        <div style="font-size: 0.6875rem; color: var(--color-text-muted); padding: var(--space-xs);">Sun</div>
        <div style="font-size: 0.6875rem; color: var(--color-text-muted); padding: var(--space-xs);">Mon</div>
        <div style="font-size: 0.6875rem; color: var(--color-text-muted); padding: var(--space-xs);">Tue</div>
        <div style="font-size: 0.6875rem; color: var(--color-text-muted); padding: var(--space-xs);">Wed</div>
        <div style="font-size: 0.6875rem; color: var(--color-text-muted); padding: var(--space-xs);">Thu</div>
        <div style="font-size: 0.6875rem; color: var(--color-text-muted); padding: var(--space-xs);">Fri</div>
        <div style="font-size: 0.6875rem; color: var(--color-text-muted); padding: var(--space-xs);">Sat</div>
    `;
    
    // תאים ריקים לפני תחילת החודש
    for (let i = 0; i < startDay; i++) {
      html += '<div></div>';
    }
    
    // ימי החודש
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === today;
      const hasWorkout = state.workoutDays[dateStr]?.completed;
      
      html += `
        <button 
          class="calendar-day" 
          data-date="${dateStr}"
          onclick="MovementModule.toggleWorkoutDay('${dateStr}')"
          style="
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 0.875rem;
            position: relative;
            background: ${hasWorkout ? 'var(--color-movement)' : isToday ? 'var(--color-accent-light)' : 'var(--color-bg-input)'};
            color: ${hasWorkout ? 'white' : isToday ? 'var(--color-accent-primary)' : 'var(--color-text-primary)'};
            font-weight: ${isToday ? '600' : '400'};
            ${isToday ? 'box-shadow: inset 0 0 0 2px var(--color-accent-primary);' : ''}
          "
        >
          ${day}
          ${hasWorkout ? '<span style="position: absolute; bottom: 2px; font-size: 0.5rem;">✓</span>' : ''}
        </button>
      `;
    }
    
    html += '</div>';
    
    // מקרא
    html += `
      <div style="display: flex; gap: var(--space-lg); justify-content: center; margin-top: var(--space-md); font-size: 0.75rem; color: var(--color-text-muted);">
        <div style="display: flex; align-items: center; gap: var(--space-xs);">
          <span style="width: 12px; height: 12px; background: var(--color-movement); border-radius: 2px;"></span>
          Workout completed
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-xs);">
          <span style="width: 12px; height: 12px; background: var(--color-accent-light); border-radius: 2px; box-shadow: inset 0 0 0 1px var(--color-accent-primary);"></span>
          Today
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // חיבור מאזיני ניווט
    setTimeout(setupEventListeners, 0);
  }

  /**
   * סימון/ביטול סימון יום אימון
   * @param {string} dateStr - תאריך בפורמט YYYY-MM-DD
   */
  function toggleWorkoutDay(dateStr) {
    if (state.workoutDays[dateStr]?.completed) {
      // ביטול סימון
      delete state.workoutDays[dateStr];
      App.showToast('Workout unmarked');
    } else {
      // סימון אימון
      state.workoutDays[dateStr] = { completed: true, type: 'general' };
      App.showToast('Workout marked! 💪');
    }
    saveState();
    renderCalendar();
  }
  

  // ===========================================
  // === סרטוני אימון ===
  // ===========================================

  /**
   * מצייר את אזור סרטוני האימון
   */
  function renderWorkoutVideos() {
    const container = document.getElementById('workoutVideosContent');
    if (!container) return;
    
    // הגדרת קטגוריות
    const categories = [
      { id: 'beginner', name: 'Beginner Friendly', icon: '🌱' },
      { id: 'strength', name: 'Strength Training', icon: '💪' },
      { id: 'cardio', name: 'Cardio & HIIT', icon: '🔥' },
      { id: 'yoga', name: 'Yoga', icon: '🧘' },
      { id: 'stretching', name: 'Stretching & Mobility', icon: '🤸' }
    ];
    
    let html = `
      <!-- כפתורי קטגוריות -->
      <div style="display: flex; gap: var(--space-sm); overflow-x: auto; padding-bottom: var(--space-sm); margin-bottom: var(--space-lg);">
        ${categories.map((cat, i) => `
          <button 
            class="video-category-btn ${i === 0 ? 'active' : ''}"
            data-category="${cat.id}"
            onclick="MovementModule.showVideoCategory('${cat.id}')"
            style="
              flex-shrink: 0;
              padding: var(--space-sm) var(--space-md);
              background: ${i === 0 ? 'var(--color-movement)' : 'var(--color-bg-input)'};
              border: 1px solid ${i === 0 ? 'var(--color-movement)' : 'var(--color-border)'};
              border-radius: var(--radius-full);
              color: ${i === 0 ? 'white' : 'var(--color-text-secondary)'};
              font-size: 0.8125rem;
              cursor: pointer;
              white-space: nowrap;
            "
          >
            ${cat.icon} ${cat.name}
          </button>
        `).join('')}
      </div>
      
      <!-- רשימת סרטונים -->
      <div id="videosList">
        ${renderVideoList('beginner')}
      </div>
    `;
    
    container.innerHTML = html;
  }

  /**
   * מצייר רשימת סרטונים לקטגוריה
   * @param {string} category - שם הקטגוריה
   * @returns {string} HTML של רשימת הסרטונים
   */
  function renderVideoList(category) {
    const videos = workoutVideos[category] || [];
    
    return videos.map(video => `
      <a href="${video.url}" target="_blank" rel="noopener noreferrer"
         style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-decoration: none; margin-bottom: var(--space-sm); transition: all 0.2s;"
         onmouseover="this.style.borderColor='var(--color-movement)'"
         onmouseout="this.style.borderColor='var(--color-border)'">
        <!-- אייקון play -->
        <div style="width: 48px; height: 48px; background: rgba(245, 169, 98, 0.1); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <svg viewBox="0 0 24 24" fill="var(--color-movement)" style="width: 24px; height: 24px;">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <!-- פרטי הסרטון -->
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 500; color: var(--color-text-primary); margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${video.name}</div>
          <div style="font-size: 0.75rem; color: var(--color-text-muted);">${video.channel} · ${video.duration}</div>
        </div>
        <!-- אייקון קישור חיצוני -->
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2" style="width: 16px; height: 16px; flex-shrink: 0;">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
        </svg>
      </a>
    `).join('');
  }

  /**
   * החלפת קטגוריית סרטונים
   * @param {string} category - שם הקטגוריה
   */
  function showVideoCategory(category) {
    // עדכון מראה הכפתורים
    document.querySelectorAll('.video-category-btn').forEach(btn => {
      const isActive = btn.dataset.category === category;
      btn.style.background = isActive ? 'var(--color-movement)' : 'var(--color-bg-input)';
      btn.style.borderColor = isActive ? 'var(--color-movement)' : 'var(--color-border)';
      btn.style.color = isActive ? 'white' : 'var(--color-text-secondary)';
      btn.classList.toggle('active', isActive);
    });
    
    // עדכון רשימת הסרטונים
    const videosList = document.getElementById('videosList');
    if (videosList) {
      videosList.innerHTML = renderVideoList(category);
    }
  }
  

  // ===========================================
  // === פונקציות עזר ===
  // ===========================================

  /**
   * חישוב סטריק אימונים (ימים רצופים)
   * @returns {number} מספר הימים הרצופים
   */
  function getStreak() {
    let streak = 0;
    const today = new Date();
    
    // עובר אחורה עד 365 ימים
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (state.workoutDays[dateStr]?.completed) {
        streak++;
      } else if (i > 0) {
        // הסטריק נשבר
        break;
      }
    }
    
    return streak;
  }
  

  // ===========================================
  // === הפעלת המודול ===
  // ===========================================
  
  // אתחול כשהדף נטען (רק אם האלמנטים קיימים)
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('stepTrackerContent')) {
      init();
    }
  });
  

  // ===========================================
  // === חשיפת פונקציות ציבוריות ===
  // ===========================================
  
  return {
    init,
    addSteps,
    toggleWorkoutDay,
    showVideoCategory,
    getStreak
  };
})();
