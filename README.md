# NaturalHealth - Holistic Wellness PWA

A calming, mindful Progressive Web App focused on holistic well-being through four core pillars: **Nutrition**, **Sleep**, **Movement**, and **Mind & Emotional Health**.

## Philosophy

This app shifts the focus away from calorie counting and metrics-driven health. Instead, it centers on a balanced, holistic approach to wellness where the user is guided to nurture all aspects of their well-being.

## Core Features

### AI Wellness Advisor
- **Free-text input** for any health concern or question
- **Holistic recommendations** based on the four pillars
- Suggestions drawn from natural and alternative wellness practices

### Four Pillars of Wellness

**Nutrition**
- Mindful eating guides
- Hydration tips
- Whole foods education
- Natural remedies database

**Sleep**
- Sleep tracking interface (Apple Watch integration ready)
- Sleep hygiene guides
- Natural sleep aids
- Evening wind-down routines

**Movement**
- Gentle movement practices
- Walking guides
- Desk stretches
- Joyful movement philosophy

**Mind & Emotional Health**
- **Daily journaling** with guided prompts:
  - "How am I feeling right now?"
  - "How would I like to feel?"
  - "Five things I'm grateful for"
- Breathing exercises
- Meditation guides
- Stress relief techniques

### Additional Features
- **Daily wellness tip** on the home screen
- **Optional calorie/movement tracking** (hidden by default, accessible via small button)
- **Offline support** - works without internet
- **Installable** as a mobile app

## Design

The app uses a clean, calming aesthetic:
- **Light theme** with white and soft green tones
- **Cormorant Garamond** serif font for headings (elegant, calming)
- **DM Sans** for body text (clean, readable)
- Minimalistic, nature-inspired interface
- Soft shadows and rounded corners

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Progressive Web App (PWA) with Service Worker
- LocalStorage for data persistence
- No backend required

## Project Structure

```
project/
├── index.html              # Main app shell
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── README.md
├── css/
│   └── styles.css          # Light, calming theme
├── js/
│   ├── app.js              # Core navigation and utilities
│   ├── wellness-ai.js      # AI recommendation engine
│   └── journal.js          # Journaling module
├── data/
│   ├── foods.json          # Food database (optional tracking)
│   ├── remedies.json       # Natural remedies knowledge base
│   └── tips.json           # 50 holistic wellness tips
└── assets/
    └── icons/
        └── icon.svg        # App icon
```

## Getting Started

### Run Locally

```bash
cd project
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

### Install as App

1. Open in Chrome/Safari on your phone
2. Tap "Add to Home Screen"
3. Access like a native app

## Customization

### Adding Wellness Tips
Edit `data/tips.json`:
```json
{
  "id": 51,
  "text": "Your wellness tip here",
  "category": "nutrition" // or "sleep", "movement", "mind"
}
```

### Extending AI Recommendations
Edit `js/wellness-ai.js` to add new keyword patterns and recommendations for the four pillars.

## Future Enhancements

- Apple Watch sleep data integration (HealthKit)
- Guided meditation audio
- Weekly wellness insights
- Community/sharing features
- Push notification reminders

## Credits

Created as a student project for Reichman University Developer Club.

---

*"True wellness is not found in numbers, but in the harmony of mind, body, and spirit."*
