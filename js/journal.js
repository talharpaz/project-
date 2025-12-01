/**
 * NaturalHealth PWA - Journaling Module
 * Handles mindset journaling with guided prompts
 */

const JournalModule = (function() {
  // DOM Elements
  let elements = {};
  
  // Initialize
  function init() {
    elements.feeling = document.getElementById('journalFeeling');
    elements.desire = document.getElementById('journalDesire');
    elements.gratitude = [
      document.getElementById('gratitude1'),
      document.getElementById('gratitude2'),
      document.getElementById('gratitude3'),
      document.getElementById('gratitude4'),
      document.getElementById('gratitude5')
    ];
    elements.saveBtn = document.getElementById('saveJournalBtn');
    
    if (elements.saveBtn) {
      elements.saveBtn.addEventListener('click', saveJournal);
    }
    
    loadTodayJournal();
  }
  
  // Load today's journal if exists
  function loadTodayJournal() {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('naturalhealth_journal_' + today);
    
    if (saved) {
      const data = JSON.parse(saved);
      
      if (elements.feeling) elements.feeling.value = data.feeling || '';
      if (elements.desire) elements.desire.value = data.desire || '';
      
      if (data.gratitude && elements.gratitude) {
        data.gratitude.forEach((item, index) => {
          if (elements.gratitude[index]) {
            elements.gratitude[index].value = item;
          }
        });
      }
    }
  }
  
  // Save journal entry
  function saveJournal() {
    const today = new Date().toDateString();
    
    const entry = {
      date: today,
      feeling: elements.feeling ? elements.feeling.value : '',
      desire: elements.desire ? elements.desire.value : '',
      gratitude: elements.gratitude ? elements.gratitude.map(el => el ? el.value : '') : [],
      timestamp: new Date().toISOString()
    };
    
    // Save today's entry
    localStorage.setItem('naturalhealth_journal_' + today, JSON.stringify(entry));
    
    // Also add to journal history
    let history = JSON.parse(localStorage.getItem('naturalhealth_journal_history') || '[]');
    
    // Update or add today's entry
    const existingIndex = history.findIndex(e => e.date === today);
    if (existingIndex >= 0) {
      history[existingIndex] = entry;
    } else {
      history.push(entry);
    }
    
    // Keep last 30 days
    if (history.length > 30) {
      history = history.slice(-30);
    }
    
    localStorage.setItem('naturalhealth_journal_history', JSON.stringify(history));
    
    App.showToast('Reflection saved ✨');
    
    // Visual feedback
    elements.saveBtn.textContent = 'Saved!';
    setTimeout(() => {
      elements.saveBtn.textContent = 'Save Today\'s Reflection';
    }, 2000);
  }
  
  // Get journal history
  function getHistory() {
    return JSON.parse(localStorage.getItem('naturalhealth_journal_history') || '[]');
  }
  
  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', init);
  
  return {
    init,
    saveJournal,
    getHistory
  };
})();


