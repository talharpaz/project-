/**
 * ==============================================
 * NaturalHealth PWA - מודול ניהול משתמשים
 * ==============================================
 * 
 * מודול זה מטפל בכל מה שקשור למשתמש:
 * - הרשמה והתחברות
 * - ניהול פרופיל
 * - מעקב אחר סטריק (רצף ימים)
 * - שמירת נתונים ב-LocalStorage
 * 
 * הערה: זו מערכת משתמשים בסיסית בצד הלקוח בלבד,
 * ללא שרת או אבטחה אמיתית. מתאים לאפליקציה אישית.
 */

const UserModule = (function() {
  

  // ===========================================
  // === משתנים פרטיים ===
  // ===========================================
  
  // אובייקט המשתמש הנוכחי (null אם לא מחובר)
  let currentUser = null;
  

  // ===========================================
  // === אתחול ===
  // ===========================================

  /**
   * מאתחל את המודול
   * טוען משתמש שמור ומציג את המסך המתאים
   */
  function init() {
    loadUser();    // טען משתמש מ-LocalStorage
    updateUI();    // עדכן את הממשק
    
    // הצג את המסך המתאים
    if (currentUser) {
      showApp();      // משתמש קיים - הצג אפליקציה
    } else {
      showLanding();  // אין משתמש - הצג עמוד נחיתה
    }
  }
  

  // ===========================================
  // === LocalStorage ===
  // ===========================================

  /**
   * טוען את המשתמש מ-LocalStorage
   */
  function loadUser() {
    const saved = localStorage.getItem('naturalhealth_user');
    if (saved) {
      currentUser = JSON.parse(saved);
      updateStreak();  // עדכן את הסטריק
    }
  }

  /**
   * שומר את המשתמש ל-LocalStorage
   */
  function saveUser() {
    if (currentUser) {
      localStorage.setItem('naturalhealth_user', JSON.stringify(currentUser));
    }
  }
  

  // ===========================================
  // === סטריק (רצף ימים) ===
  // ===========================================

  /**
   * מעדכן את מונה הסטריק
   * סופר כמה ימים רצופים המשתמש נכנס לאפליקציה
   */
  function updateStreak() {
    if (!currentUser) return;
    
    const today = new Date().toDateString();
    const lastVisit = currentUser.lastVisit;
    
    // בדיקה אם זו כניסה ביום חדש
    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisit === yesterday.toDateString()) {
        // נכנס אתמול - הגדל סטריק
        currentUser.streak = (currentUser.streak || 0) + 1;
      } else if (lastVisit !== today) {
        // לא נכנס אתמול - אפס סטריק
        currentUser.streak = 1;
      }
      
      // עדכון תאריך הביקור האחרון
      currentUser.lastVisit = today;
      currentUser.daysActive = (currentUser.daysActive || 0) + 1;
      saveUser();
    }
  }
  

  // ===========================================
  // === החלפת מסכים ===
  // ===========================================

  /**
   * הצגת עמוד הנחיתה
   */
  function showLanding() {
    document.getElementById('landingPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
  }

  /**
   * הצגת האפליקציה הראשית
   */
  function showApp() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    updateUI();  // עדכון הממשק עם נתוני המשתמש
  }
  

  // ===========================================
  // === מודאלים של הרשמה והתחברות ===
  // ===========================================

  /**
   * פתיחת מודאל ההרשמה
   */
  function showSignup() {
    document.getElementById('authModal').classList.add('active');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
  }

  /**
   * פתיחת מודאל ההתחברות
   */
  function showLogin() {
    document.getElementById('authModal').classList.add('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
  }

  /**
   * סגירת מודאל ההזדהות
   */
  function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
  }
  

  // ===========================================
  // === טיפול בהרשמה ===
  // ===========================================

  /**
   * מטפל בשליחת טופס ההרשמה
   * @param {Event} event - אירוע השליחה
   */
  function handleSignup(event) {
    event.preventDefault();  // מניעת שליחה רגילה של טופס
    
    // קבלת הנתונים מהטופס
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    
    // קבלת המטרות שנבחרו
    const goals = [];
    document.querySelectorAll('input[name="goals"]:checked').forEach(cb => {
      goals.push(cb.value);
    });
    
    // בדיקת תקינות
    if (!name || !email) {
      App.showToast('Please fill in all fields');
      return;
    }
    
    // יצירת אובייקט משתמש חדש
    currentUser = {
      id: Date.now().toString(),             // מזהה ייחודי
      name: name,
      email: email,
      goals: goals,                          // מטרות שנבחרו
      createdAt: new Date().toISOString(),   // תאריך יצירה
      lastVisit: new Date().toDateString(),  // תאריך כניסה אחרונה
      daysActive: 1,                         // ימים פעילים
      streak: 1,                             // רצף ימים
      journalEntries: 0,                     // מספר רשומות יומן
      workouts: 0                            // מספר אימונים
    };
    
    saveUser();
    closeAuthModal();
    showApp();
    
    App.showToast(`Welcome, ${name}! 🌿`);
  }
  

  // ===========================================
  // === טיפול בהתחברות ===
  // ===========================================

  /**
   * מטפל בשליחת טופס ההתחברות
   * @param {Event} event - אירוע השליחה
   */
  function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    
    // בדיקה אם יש משתמש שמור עם אותו אימייל
    const saved = localStorage.getItem('naturalhealth_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user.email === email) {
        // נמצאה התאמה - טען את המשתמש
        currentUser = user;
        updateStreak();
        saveUser();
        closeAuthModal();
        showApp();
        App.showToast(`Welcome back, ${currentUser.name}! 🌿`);
        return;
      }
    }
    
    // לא נמצא משתמש - צור חשבון חדש עם האימייל
    currentUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],  // שם מתוך האימייל
      email: email,
      goals: [],
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toDateString(),
      daysActive: 1,
      streak: 1,
      journalEntries: 0,
      workouts: 0
    };
    
    saveUser();
    closeAuthModal();
    showApp();
    App.showToast(`Welcome, ${currentUser.name}! 🌿`);
  }
  

  // ===========================================
  // === כניסה כאורח ===
  // ===========================================

  /**
   * כניסה כאורח ללא הרשמה
   * הנתונים לא נשמרים לאחר סגירת הדפדפן
   */
  function enterAsGuest() {
    currentUser = {
      id: 'guest',
      name: 'Guest',
      email: null,
      goals: [],
      isGuest: true,              // סימון שזה אורח
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toDateString(),
      daysActive: 1,
      streak: 0,                  // אורח לא צובר סטריק
      journalEntries: 0,
      workouts: 0
    };
    
    // לא שומרים אורח ל-LocalStorage
    showApp();
    App.showToast('Exploring as guest');
  }
  

  // ===========================================
  // === התנתקות ===
  // ===========================================

  /**
   * התנתקות מהחשבון
   */
  function logout() {
    currentUser = null;
    localStorage.removeItem('naturalhealth_user');
    showLanding();
    App.showToast('Logged out successfully');
    
    // סגירת תפריט המשתמש
    document.getElementById('userMenu').classList.add('hidden');
  }
  

  // ===========================================
  // === תפריט משתמש ===
  // ===========================================

  /**
   * פתיחה/סגירה של תפריט המשתמש
   */
  function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('hidden');
  }
  

  // ===========================================
  // === עדכון הממשק ===
  // ===========================================

  /**
   * מעדכן את הממשק עם נתוני המשתמש
   */
  function updateUI() {
    if (!currentUser) return;
    
    const isGuest = currentUser.isGuest;
    
    // --- עדכון האווטאר ---
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
      // הצגת האות הראשונה של השם
      avatar.textContent = currentUser.name.charAt(0).toUpperCase();
    }
    
    // --- עדכון תפריט המשתמש ---
    const menuName = document.getElementById('userMenuName');
    const menuEmail = document.getElementById('userMenuEmail');
    if (menuName) menuName.textContent = currentUser.name;
    if (menuEmail) menuEmail.textContent = isGuest ? 'Exploring as guest' : currentUser.email;
    
    // --- הצגת/הסתרת אזורי ברכה ---
    const personalizedWelcome = document.getElementById('personalizedWelcome');
    const guestWelcome = document.getElementById('guestWelcome');
    
    if (isGuest) {
      // אורח - הצג הודעת אורח
      if (personalizedWelcome) personalizedWelcome.classList.add('hidden');
      if (guestWelcome) guestWelcome.classList.remove('hidden');
    } else {
      // משתמש רשום - הצג ברכה אישית
      if (personalizedWelcome) personalizedWelcome.classList.remove('hidden');
      if (guestWelcome) guestWelcome.classList.add('hidden');
      
      // עדכון שם בברכה
      const welcomeName = document.getElementById('welcomeName');
      if (welcomeName) welcomeName.textContent = currentUser.name.split(' ')[0];
      
      // עדכון סטטיסטיקות
      updateStats();
    }
    
    // עדכון דפים נוספים
    updateProfileView();
    updateProgressView();
  }
  

  // ===========================================
  // === עדכון סטטיסטיקות ===
  // ===========================================

  /**
   * מעדכן את תצוגת הסטטיסטיקות
   */
  function updateStats() {
    if (!currentUser) return;
    
    // סטטיסטיקות מהירות בעמוד הבית
    const statDaysActive = document.getElementById('statDaysActive');
    const statJournalEntries = document.getElementById('statJournalEntries');
    const statWorkouts = document.getElementById('statWorkouts');
    
    if (statDaysActive) statDaysActive.textContent = currentUser.daysActive || 1;
    if (statJournalEntries) statJournalEntries.textContent = currentUser.journalEntries || 0;
    if (statWorkouts) statWorkouts.textContent = currentUser.workouts || 0;
    
    // הודעת סטריק בברכה
    const welcomeStreak = document.getElementById('welcomeStreak');
    if (welcomeStreak) {
      if (currentUser.streak > 1) {
        welcomeStreak.textContent = `🔥 ${currentUser.streak} day streak! Keep it going!`;
      } else {
        welcomeStreak.textContent = "Let's continue your wellness journey";
      }
    }
  }
  

  // ===========================================
  // === עדכון דף פרופיל ===
  // ===========================================

  /**
   * מעדכן את דף הפרופיל
   */
  function updateProfileView() {
    if (!currentUser) return;
    
    const avatarLarge = document.getElementById('profileAvatarLarge');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileGoals = document.getElementById('profileGoals');
    
    // עדכון אווטאר ופרטים
    if (avatarLarge) avatarLarge.textContent = currentUser.name.charAt(0).toUpperCase();
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.isGuest ? 'Guest account' : currentUser.email;
    
    // עדכון מטרות
    if (profileGoals && currentUser.goals) {
      // מיפוי קודים לתוויות
      const goalLabels = {
        sleep: 'Better Sleep',
        energy: 'More Energy',
        stress: 'Less Stress',
        nutrition: 'Eat Healthier',
        fitness: 'Get Fit',
        mindfulness: 'Mental Clarity'
      };
      
      profileGoals.innerHTML = currentUser.goals.length > 0
        ? currentUser.goals.map(g => `<span class="goal-tag">${goalLabels[g] || g}</span>`).join('')
        : '<span class="goal-tag" style="background: var(--color-bg); color: var(--color-text-muted);">No goals set</span>';
    }
  }
  

  // ===========================================
  // === עדכון דף התקדמות ===
  // ===========================================

  /**
   * מעדכן את דף ההתקדמות
   */
  function updateProgressView() {
    if (!currentUser) return;
    
    const progressDaysActive = document.getElementById('progressDaysActive');
    const progressJournalEntries = document.getElementById('progressJournalEntries');
    const progressWorkouts = document.getElementById('progressWorkouts');
    const progressCurrentStreak = document.getElementById('progressCurrentStreak');
    
    if (progressDaysActive) progressDaysActive.textContent = currentUser.daysActive || 1;
    if (progressJournalEntries) progressJournalEntries.textContent = currentUser.journalEntries || 0;
    if (progressWorkouts) progressWorkouts.textContent = currentUser.workouts || 0;
    if (progressCurrentStreak) progressCurrentStreak.textContent = currentUser.streak || 0;
  }
  

  // ===========================================
  // === הגדלת מונים ===
  // ===========================================

  /**
   * הגדלת מונה רשומות היומן
   */
  function incrementJournalEntries() {
    if (currentUser && !currentUser.isGuest) {
      currentUser.journalEntries = (currentUser.journalEntries || 0) + 1;
      saveUser();
      updateStats();
    }
  }

  /**
   * הגדלת מונה אימונים
   */
  function incrementWorkouts() {
    if (currentUser && !currentUser.isGuest) {
      currentUser.workouts = (currentUser.workouts || 0) + 1;
      saveUser();
      updateStats();
    }
  }
  

  // ===========================================
  // === מחיקת נתונים ===
  // ===========================================

  /**
   * מחיקת כל הנתונים של המשתמש
   */
  function clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      localStorage.clear();  // מחיקת כל ה-LocalStorage
      currentUser = null;
      showLanding();
      App.showToast('All data cleared');
    }
  }
  

  // ===========================================
  // === פונקציות עזר ===
  // ===========================================

  /**
   * קבלת המשתמש הנוכחי
   * @returns {Object|null} אובייקט המשתמש או null
   */
  function getUser() {
    return currentUser;
  }

  /**
   * בדיקה אם המשתמש מחובר (לא אורח)
   * @returns {boolean} האם מחובר
   */
  function isLoggedIn() {
    return currentUser && !currentUser.isGuest;
  }
  

  // ===========================================
  // === הפעלת המודול ===
  // ===========================================
  
  // אתחול כשהדף נטען
  document.addEventListener('DOMContentLoaded', init);
  

  // ===========================================
  // === חשיפת פונקציות ציבוריות ===
  // ===========================================
  
  return {
    init,
    showSignup,
    showLogin,
    closeAuthModal,
    handleSignup,
    handleLogin,
    enterAsGuest,
    logout,
    toggleUserMenu,
    clearAllData,
    getUser,
    isLoggedIn,
    incrementJournalEntries,
    incrementWorkouts,
    updateStats
  };
})();
