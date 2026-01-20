/**
 * ==============================================
 * API Route - חיבור מאובטח ל-OpenAI
 * ==============================================
 * 
 * זוהי פונקציית Serverless שרצה בשרת של Vercel.
 * היא מקבלת בקשות מהאתר ומעבירה אותן ל-OpenAI.
 * 
 * למה זה בטוח?
 * - המפתח (API Key) נשמר ב-Environment Variable בשרת
 * - המשתמש לעולם לא רואה את המפתח
 * - רק השרת שלנו מתקשר עם OpenAI
 * 
 * ==============================================
 */

export default async function handler(req, res) {
  
  // --- בדיקת שיטת הבקשה ---
  // מקבלים רק בקשות POST (לא GET)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- קבלת המפתח מ-Environment Variable ---
  // המפתח מוגדר בהגדרות Vercel, לא בקוד!
  const apiKey = process.env.OPENAI_API_KEY;

  // בדיקה שהמפתח קיים
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'OpenAI API key not configured',
      message: 'Please add OPENAI_API_KEY to your Vercel environment variables'
    });
  }

  try {
    // --- קבלת הנתונים מהבקשה ---
    const { message, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // --- הגדרת ה-System Prompt ---
    // זה אומר ל-AI איך להתנהג
    const defaultSystemPrompt = `You are a helpful holistic wellness assistant called NaturalHealth AI. 
You provide natural, evidence-based health recommendations covering:
- Nutrition and diet
- Sleep hygiene
- Movement and exercise
- Mental wellness and mindfulness

Always be supportive, informative, and remind users to consult healthcare professionals for serious concerns.
Keep responses concise but helpful. Use simple language.
When giving recommendations, explain WHY they help.`;

    // --- שליחת הבקשה ל-OpenAI ---
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`  // המפתח נשלח רק מהשרת!
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',  // אפשר לשנות ל-gpt-4 אם רוצים
        messages: [
          {
            role: 'system',
            content: systemPrompt || defaultSystemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,      // אורך מקסימלי של התשובה
        temperature: 0.7       // יצירתיות (0=מדויק, 1=יצירתי)
      })
    });

    // --- טיפול בתשובה מ-OpenAI ---
    const data = await response.json();

    // בדיקת שגיאות מ-OpenAI
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return res.status(response.status).json({ 
        error: 'OpenAI API error',
        details: data.error?.message || 'Unknown error'
      });
    }

    // --- החזרת התשובה למשתמש ---
    const aiMessage = data.choices[0]?.message?.content || 'No response from AI';
    
    return res.status(200).json({ 
      success: true,
      message: aiMessage,
      usage: data.usage  // כמה tokens השתמשנו (לניטור עלויות)
    });

  } catch (error) {
    // --- טיפול בשגיאות ---
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

