/**
 * NaturalHealth PWA - User Management Module
 * Handles user accounts, profiles, and data persistence
 */

const UserModule = (function() {
  
  // Current user state
  let currentUser = null;
  
  // Initialize
  function init() {
    loadUser();
    updateUI();
    
    // Check if user exists or show landing
    if (currentUser) {
      showApp();
    } else {
      showLanding();
    }
  }
  
  // Load user from localStorage
  function loadUser() {
    const saved = localStorage.getItem('naturalhealth_user');
    if (saved) {
      currentUser = JSON.parse(saved);
      updateStreak();
    }
  }
  
  // Save user to localStorage
  function saveUser() {
    if (currentUser) {
      localStorage.setItem('naturalhealth_user', JSON.stringify(currentUser));
    }
  }
  
  // Update streak counter
  function updateStreak() {
    if (!currentUser) return;
    
    const today = new Date().toDateString();
    const lastVisit = currentUser.lastVisit;
    
    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisit === yesterday.toDateString()) {
        currentUser.streak = (currentUser.streak || 0) + 1;
      } else if (lastVisit !== today) {
        currentUser.streak = 1;
      }
      
      currentUser.lastVisit = today;
      currentUser.daysActive = (currentUser.daysActive || 0) + 1;
      saveUser();
    }
  }
  
  // Show landing page
  function showLanding() {
    document.getElementById('landingPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
  }
  
  // Show main app
  function showApp() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    updateUI();
  }
  
  // Show signup modal
  function showSignup() {
    document.getElementById('authModal').classList.add('active');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
  }
  
  // Show login modal
  function showLogin() {
    document.getElementById('authModal').classList.add('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
  }
  
  // Close auth modal
  function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
  }
  
  // Handle signup
  function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    
    // Get selected goals
    const goals = [];
    document.querySelectorAll('input[name="goals"]:checked').forEach(cb => {
      goals.push(cb.value);
    });
    
    if (!name || !email) {
      App.showToast('Please fill in all fields');
      return;
    }
    
    // Create user
    currentUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      goals: goals,
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
    
    App.showToast(`Welcome, ${name}! 🌿`);
  }
  
  // Handle login
  function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    
    // For now, just check if email matches saved user
    const saved = localStorage.getItem('naturalhealth_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user.email === email) {
        currentUser = user;
        updateStreak();
        saveUser();
        closeAuthModal();
        showApp();
        App.showToast(`Welcome back, ${currentUser.name}! 🌿`);
        return;
      }
    }
    
    // If no match, create new account with just email
    currentUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],
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
  
  // Enter as guest
  function enterAsGuest() {
    currentUser = {
      id: 'guest',
      name: 'Guest',
      email: null,
      goals: [],
      isGuest: true,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toDateString(),
      daysActive: 1,
      streak: 0,
      journalEntries: 0,
      workouts: 0
    };
    
    // Don't save guest to localStorage
    showApp();
    App.showToast('Exploring as guest');
  }
  
  // Logout
  function logout() {
    currentUser = null;
    localStorage.removeItem('naturalhealth_user');
    showLanding();
    App.showToast('Logged out successfully');
    
    // Close user menu
    document.getElementById('userMenu').classList.add('hidden');
  }
  
  // Toggle user menu
  function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('hidden');
  }
  
  // Update UI based on user state
  function updateUI() {
    if (!currentUser) return;
    
    const isGuest = currentUser.isGuest;
    
    // Update avatar
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
      avatar.textContent = currentUser.name.charAt(0).toUpperCase();
    }
    
    // Update user menu
    const menuName = document.getElementById('userMenuName');
    const menuEmail = document.getElementById('userMenuEmail');
    if (menuName) menuName.textContent = currentUser.name;
    if (menuEmail) menuEmail.textContent = isGuest ? 'Exploring as guest' : currentUser.email;
    
    // Show/hide welcome sections
    const personalizedWelcome = document.getElementById('personalizedWelcome');
    const guestWelcome = document.getElementById('guestWelcome');
    
    if (isGuest) {
      if (personalizedWelcome) personalizedWelcome.classList.add('hidden');
      if (guestWelcome) guestWelcome.classList.remove('hidden');
    } else {
      if (personalizedWelcome) personalizedWelcome.classList.remove('hidden');
      if (guestWelcome) guestWelcome.classList.add('hidden');
      
      // Update welcome name
      const welcomeName = document.getElementById('welcomeName');
      if (welcomeName) welcomeName.textContent = currentUser.name.split(' ')[0];
      
      // Update stats
      updateStats();
    }
    
    // Update profile view
    updateProfileView();
    updateProgressView();
  }
  
  // Update stats display
  function updateStats() {
    if (!currentUser) return;
    
    // Quick stats on home
    const statDaysActive = document.getElementById('statDaysActive');
    const statJournalEntries = document.getElementById('statJournalEntries');
    const statWorkouts = document.getElementById('statWorkouts');
    
    if (statDaysActive) statDaysActive.textContent = currentUser.daysActive || 1;
    if (statJournalEntries) statJournalEntries.textContent = currentUser.journalEntries || 0;
    if (statWorkouts) statWorkouts.textContent = currentUser.workouts || 0;
    
    // Welcome streak message
    const welcomeStreak = document.getElementById('welcomeStreak');
    if (welcomeStreak) {
      if (currentUser.streak > 1) {
        welcomeStreak.textContent = `🔥 ${currentUser.streak} day streak! Keep it going!`;
      } else {
        welcomeStreak.textContent = "Let's continue your wellness journey";
      }
    }
  }
  
  // Update profile view
  function updateProfileView() {
    if (!currentUser) return;
    
    const avatarLarge = document.getElementById('profileAvatarLarge');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileGoals = document.getElementById('profileGoals');
    
    if (avatarLarge) avatarLarge.textContent = currentUser.name.charAt(0).toUpperCase();
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.isGuest ? 'Guest account' : currentUser.email;
    
    if (profileGoals && currentUser.goals) {
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
  
  // Update progress view
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
  
  // Increment journal entries
  function incrementJournalEntries() {
    if (currentUser && !currentUser.isGuest) {
      currentUser.journalEntries = (currentUser.journalEntries || 0) + 1;
      saveUser();
      updateStats();
    }
  }
  
  // Increment workouts
  function incrementWorkouts() {
    if (currentUser && !currentUser.isGuest) {
      currentUser.workouts = (currentUser.workouts || 0) + 1;
      saveUser();
      updateStats();
    }
  }
  
  // Clear all data
  function clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      localStorage.clear();
      currentUser = null;
      showLanding();
      App.showToast('All data cleared');
    }
  }
  
  // Get current user
  function getUser() {
    return currentUser;
  }
  
  // Check if user is logged in
  function isLoggedIn() {
    return currentUser && !currentUser.isGuest;
  }
  
  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', init);
  
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









