/**
 * ==============================================
 * NaturalHealth PWA - מודול היומן
 * ==============================================
 * 
 * מודול זה מטפל ביומן המחשבות והרגשות.
 * המשתמש יכול לכתוב על איך הוא מרגיש, מה הוא צריך,
 * ודברים שהוא אסיר תודה עליהם.
 * 
 * הנתונים נשמרים ב-LocalStorage ונטענים אוטומטית.
 */

const JournalModule = (function() {
  

  // ===========================================
  // === משתנים פרטיים ===
  // ===========================================
  
  // אובייקט לשמירת אלמנטים מה-DOM
  let elements = {};
  

  // ===========================================
  // === אתחול ===
  // ===========================================

  /**
   * מאתחל את המודול
   * שומר רפרנסים לאלמנטים ומחבר מאזינים
   */
  function init() {
    // שמירת רפרנסים לשדות הקלט
    elements.feeling = document.getElementById('journalFeeling');   // שדה "איך אני מרגיש"
    elements.desire = document.getElementById('journalDesire');     // שדה "מה אני צריך"
    
    // מערך של 5 שדות תודה
    elements.gratitude = [
      document.getElementById('gratitude1'),
      document.getElementById('gratitude2'),
      document.getElementById('gratitude3'),
      document.getElementById('gratitude4'),
      document.getElementById('gratitude5')
    ];
    
    // כפתור השמירה
    elements.saveBtn = document.getElementById('saveJournalBtn');
    
    // הוספת מאזין לכפתור השמירה
    if (elements.saveBtn) {
      elements.saveBtn.addEventListener('click', saveJournal);
    }
    
    // טעינת היומן של היום אם קיים
    loadTodayJournal();
  }
  

  // ===========================================
  // === טעינת יומן היום ===
  // ===========================================

  /**
   * טוען את היומן של היום מ-LocalStorage
   * אם המשתמש כבר כתב היום, מציג את מה שכתב
   */
  function loadTodayJournal() {
    // יצירת מפתח ייחודי ליום הנוכחי
    const today = new Date().toDateString();  // למשל: "Mon Jan 20 2026"
    const saved = localStorage.getItem('naturalhealth_journal_' + today);
    
    // אם יש נתונים שמורים
    if (saved) {
      const data = JSON.parse(saved);  // המרה מטקסט לאובייקט
      
      // מילוי השדות בנתונים השמורים
      if (elements.feeling) elements.feeling.value = data.feeling || '';
      if (elements.desire) elements.desire.value = data.desire || '';
      
      // מילוי שדות התודה
      if (data.gratitude && elements.gratitude) {
        data.gratitude.forEach((item, index) => {
          if (elements.gratitude[index]) {
            elements.gratitude[index].value = item;
          }
        });
      }
    }
  }
  

  // ===========================================
  // === שמירת יומן ===
  // ===========================================

  /**
   * שומר את היומן ל-LocalStorage
   * שומר גם להיום וגם להיסטוריה
   */
  function saveJournal() {
    const today = new Date().toDateString();
    
    // יצירת אובייקט הרשומה
    const entry = {
      date: today,                                                    // תאריך
      feeling: elements.feeling ? elements.feeling.value : '',        // תחושה
      desire: elements.desire ? elements.desire.value : '',           // רצון/צורך
      gratitude: elements.gratitude ?                                 // רשימת תודות
                 elements.gratitude.map(el => el ? el.value : '') : [],
      timestamp: new Date().toISOString()                            // חותמת זמן מדויקת
    };
    
    // --- שמירת רשומה של היום ---
    // מפתח ייחודי ליום מאפשר טעינה מהירה
    localStorage.setItem('naturalhealth_journal_' + today, JSON.stringify(entry));
    
    // --- עדכון היסטוריית היומנים ---
    let history = JSON.parse(localStorage.getItem('naturalhealth_journal_history') || '[]');
    
    // בדיקה אם יש כבר רשומה להיום
    const existingIndex = history.findIndex(e => e.date === today);
    if (existingIndex >= 0) {
      // עדכון רשומה קיימת
      history[existingIndex] = entry;
    } else {
      // הוספת רשומה חדשה
      history.push(entry);
    }
    
    // שמירת 30 הימים האחרונים בלבד (למניעת צריכת זיכרון)
    if (history.length > 30) {
      history = history.slice(-30);  // שמירת 30 האחרונים
    }
    
    localStorage.setItem('naturalhealth_journal_history', JSON.stringify(history));
    
    // הצגת הודעת הצלחה
    App.showToast('Reflection saved ✨');
    
    // פידבק ויזואלי בכפתור
    elements.saveBtn.textContent = 'Saved!';
    setTimeout(() => {
      elements.saveBtn.textContent = 'Save Today\'s Reflection';
    }, 2000);  // חזרה לטקסט המקורי אחרי 2 שניות
  }
  

  // ===========================================
  // === קבלת היסטוריה ===
  // ===========================================

  /**
   * מחזיר את היסטוריית היומנים
   * @returns {Array} מערך של רשומות יומן
   */
  function getHistory() {
    return JSON.parse(localStorage.getItem('naturalhealth_journal_history') || '[]');
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
    init,        // אתחול
    saveJournal, // שמירת יומן
    getHistory   // קבלת היסטוריה
  };
})();
