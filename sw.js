/**
 * ==============================================
 * Service Worker - עובד שירות
 * ==============================================
 * 
 * Service Worker הוא סקריפט שרץ ברקע, נפרד מהדף.
 * הוא מאפשר לאפליקציה לעבוד גם בלי אינטרנט (אופליין).
 * 
 * איך זה עובד:
 * 1. כשהאפליקציה נטענת, ה-SW נרשם ושומר קבצים ב-Cache
 * 2. בפעם הבאה, הקבצים נטענים מה-Cache (מהיר יותר)
 * 3. אם אין אינטרנט, האפליקציה עדיין עובדת מה-Cache
 * 
 * מחזור חיים של SW:
 * 1. Install - התקנה ושמירת קבצים ב-Cache
 * 2. Activate - הפעלה ומחיקת Cache ישן
 * 3. Fetch - יירוט בקשות רשת והגשה מ-Cache
 * 
 * ==============================================
 */


// ===========================================
// === הגדרות ===
// ===========================================

// שם ה-Cache - שינוי הגרסה יגרום לעדכון כל הקבצים
const CACHE_NAME = 'naturalhealth-v1';

// רשימת הקבצים לשמירה ב-Cache
// אלה הקבצים שיעבדו גם אופליין
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/calories.js',
  '/js/remedies.js',
  '/js/tips.js',
  '/data/foods.json',
  '/data/remedies.json',
  '/data/tips.json',
  '/manifest.json'
];


// ===========================================
// === אירוע Install - התקנה ===
// ===========================================
// קורה פעם אחת כש-SW נרשם לראשונה או מתעדכן

self.addEventListener('install', (event) => {
  // waitUntil: מחכה שהפעולה תסתיים לפני המשך
  event.waitUntil(
    // פתיחת Cache חדש
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app assets');
        // שמירת כל הקבצים ב-Cache
        return cache.addAll(ASSETS_TO_CACHE);
      })
      // skipWaiting: הפעלת ה-SW מיד (בלי לחכות לסגירת כל הטאבים)
      .then(() => self.skipWaiting())
  );
});


// ===========================================
// === אירוע Activate - הפעלה ===
// ===========================================
// קורה אחרי ההתקנה, או כשגרסה חדשה מופעלת

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // קבלת שמות כל ה-Caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          // סינון: רק Caches ישנים (לא הנוכחי)
          .filter((name) => name !== CACHE_NAME)
          // מחיקת ה-Caches הישנים
          .map((name) => caches.delete(name))
      );
    })
    // claim: השתלטות על כל הדפים הפתוחים
    .then(() => self.clients.claim())
  );
});


// ===========================================
// === אירוע Fetch - יירוט בקשות ===
// ===========================================
// קורה בכל בקשת רשת (טעינת קובץ, תמונה, API וכו')

self.addEventListener('fetch', (event) => {
  event.respondWith(
    // חיפוש ב-Cache
    caches.match(event.request)
      .then((cachedResponse) => {
        // אם נמצא ב-Cache, החזר אותו
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // אם לא נמצא, פנה לרשת
        return fetch(event.request)
          .then((response) => {
            // אל תשמור תשובות שגויות
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // שכפול התשובה (כי אפשר לקרוא תשובה רק פעם אחת)
            const responseToCache = response.clone();
            
            // שמירה ב-Cache לפעם הבאה
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch(() => {
        // אם הכל נכשל ואין אינטרנט
        // החזר את עמוד הבית מה-Cache (לניווט)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
