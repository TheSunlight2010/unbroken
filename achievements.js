export const ACHIEVEMENTS = {
  // Normal Achievements
  firstWin: {
    id: 'firstWin',
    name: 'First Victory',
    description: 'Win your first game',
    icon: 'trophy.png',
    unlocked: false,
    category: 'Normal'
  },
  perfectGame: {
    id: 'perfectGame',
    name: 'Perfect Game',
    description: 'Win a game with 9 points',
    icon: 'perfect.png',
    unlocked: false,
    category: 'Normal'
  },
  tripleKO: {
    id: 'tripleKO',
    name: 'Triple Knockout',
    description: 'Win a 4-player game',
    icon: 'ko.png',
    unlocked: false,
    category: 'Normal'
  },

  // Challenge Achievements
  nullified: {
    id: 'nullified',
    name: 'System Error',
    description: 'Play NULL and win',
    icon: 'null.png',
    unlocked: false,
    category: 'Challenges'
  },
  reflection: {
    id: 'reflection',
    name: 'Final Performance',
    description: 'Trigger Reflection\'s ultimate ability',
    icon: 'reflection.png',
    unlocked: false,
    category: 'Challenges'
  },
  assassin: {
    id: 'assassin',
    name: 'Target Eliminated',
    description: 'Transform Savior into Assassin',
    icon: 'assassin.png',
    unlocked: false,
    category: 'Challenges'
  },
  awareness: {
    id: 'awareness',
    name: 'Infinite Power',
    description: 'Play Awareness or transform into it',
    icon: 'awareness.png',
    unlocked: false,
    category: 'Challenges'
  },
  glitchKingdom: {
    id: 'glitchKingdom',
    name: 'Glitch Kingdom',
    description: 'Have NULL, Moonlight and Awareness all in play',
    icon: 'null.png',
    unlocked: false,
    category: 'Challenges'
  },
  thatComedian: {
    id: 'thatComedian',
    name: 'That Comedian...',
    description: 'Have Assassin and Kite in play together',
    icon: 'assassin.png',
    unlocked: false,
    category: 'Challenges'
  },
  perfectChaos: {
    id: 'perfectChaos',
    name: 'Perfect Chaos',
    description: 'Win with both Chaos and Maturity in play',
    icon: 'chaos.png',
    unlocked: false,
    category: 'Challenges'
  },
  sisterDeleted: {
    id: 'sisterDeleted', 
    name: 'The Sister Deleted From Existence',
    description: 'Have an enhanced Moonlight in your deck',
    icon: 'moonlight.png',
    unlocked: false,
    category: 'Challenges'
  },

  // Fun Stuff Achievements
  friendshipPower: {
    id: 'friendshipPower',
    name: 'Power of Friendship',
    description: 'Win with both KC and Penelope in play',
    icon: 'kc.png',
    unlocked: false,
    category: 'Fun Stuff'
  },
  mothersLove: {
    id: 'mothersLove',
    name: 'A Mother\'s Love',
    description: 'Win with both Feathers and Penelope in play',
    icon: 'feathers.png',
    unlocked: false,
    category: 'Fun Stuff'
  },
  demonAngel: {
    id: 'demonAngel',
    name: 'Heaven and Hell',
    description: 'Win with both Fevaa and Binx in play',
    icon: 'fevaa.png',
    unlocked: false,
    category: 'Fun Stuff'
  },
  subjectGuardian: {
    id: 'subjectGuardian',
    name: 'Unlikely Friends',
    description: 'Win with both Subject 192 and Cyrus in play',
    icon: 'subject_192.png',
    unlocked: false,
    category: 'Fun Stuff'
  },
  gingerSalvo: {
    id: 'gingerSalvo',
    name: 'Partners in Crime',
    description: 'Win with both Ginger and Salvo in play',
    icon: 'ginger.png',
    unlocked: false,
    category: 'Fun Stuff'
  }
};

export class AchievementManager {
  constructor() {
    this.achievements = { ...ACHIEVEMENTS };
    this.loadAchievements();
    this.renderAchievements();
    this.setupEventListeners();
  }

  loadAchievements() {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      const parsed = JSON.parse(savedAchievements);
      Object.keys(parsed).forEach(id => {
        if (this.achievements[id]) {
          this.achievements[id].unlocked = parsed[id].unlocked;
        }
      });
    }
  }

  saveAchievements() {
    localStorage.setItem('achievements', JSON.stringify(this.achievements));
  }

  unlockAchievement(id) {
    if (this.achievements[id] && !this.achievements[id].unlocked) {
      this.achievements[id].unlocked = true;
      this.saveAchievements();
      this.showAchievementPopup(this.achievements[id]);
      this.renderAchievements();
    }
  }

  showAchievementPopup(achievement) {
    const popup = document.getElementById('achievement-popup');
    const icon = document.getElementById('achievement-icon');
    const title = document.getElementById('achievement-title');
    const description = document.getElementById('achievement-description');

    icon.src = achievement.icon;
    title.textContent = achievement.name;
    description.textContent = achievement.description;

    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
      // Give time for fade out animation before resetting position
      setTimeout(() => {
        popup.style.bottom = '-100px';
      }, 500);
    }, 3000);
  }

  renderAchievements() {
    const container = document.getElementById('achievements-list');
    if (!container) return;

    container.innerHTML = '';
    
    // Group achievements by category
    const categories = ['Normal', 'Challenges', 'Fun Stuff'];
    
    categories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'achievement-category';
      
      const categoryTitle = document.createElement('h3');
      categoryTitle.textContent = category;
      categoryDiv.appendChild(categoryTitle);
      
      const categoryAchievements = Object.values(this.achievements)
        .filter(achievement => achievement.category === category);
      
      categoryAchievements.forEach(achievement => {
        const elem = document.createElement('div');
        elem.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
        
        elem.innerHTML = `
          <div class="achievement-icon" style="background-image: url(${achievement.icon})"></div>
          <div class="achievement-info">
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
          </div>
        `;
        
        categoryDiv.appendChild(elem);
      });
      
      container.appendChild(categoryDiv);
    });
  }

  setupEventListeners() {
    const viewAchievementsBtn = document.getElementById('view-achievements');
    const achievementsModal = document.getElementById('achievements-modal');
    const closeBtn = achievementsModal?.querySelector('.close');
    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-achievements';
    resetBtn.className = 'main-button';
    resetBtn.textContent = 'Reset Achievements';
    resetBtn.style.marginTop = '20px';

    // Add reset button to modal
    if (achievementsModal) {
      achievementsModal.querySelector('.modal-content').appendChild(resetBtn);
    }

    // Reset achievements handler
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all achievements? This cannot be undone.')) {
        Object.keys(this.achievements).forEach(id => {
          this.achievements[id].unlocked = false;
        });
        this.saveAchievements();
        this.renderAchievements();
      }
    });

    if (viewAchievementsBtn && achievementsModal) {
      viewAchievementsBtn.addEventListener('click', () => {
        achievementsModal.style.display = 'block';
      });
    }

    if (closeBtn && achievementsModal) {
      closeBtn.addEventListener('click', () => {
        achievementsModal.style.display = 'none';
      });

      window.addEventListener('click', (event) => {
        if (event.target === achievementsModal) {
          achievementsModal.style.display = 'none';
        }
      });
    }
  }

  checkGameEndAchievements(game) {
    if (game.scores[0] > 0) {
      this.unlockAchievement('firstWin');
    }
    if (game.scores[0] === 9) {
      this.unlockAchievement('perfectGame');
    }
    if (game.scores[0] > 0 && game.players.length === 4) {
      this.unlockAchievement('tripleKO');
    }
  }

  checkPlayAreaAchievements(playArea) {
    // Existing achievement checks...
    const nullCard = playArea.find(p => p.card.id === 'null' && p.playerId === 0);
    if (nullCard) {
      this.unlockAchievement('nullified');
    }

    const awarenessPlayed = playArea.some(p => 
      (p.card.id === 'awareness' || p.card.id === 'moonlight') && p.playerId === 0
    );
    if (awarenessPlayed) {
      this.unlockAchievement('awareness');
    }

    const saviorPlayed = playArea.find(p => p.card.id === 'savior' && p.playerId === 0);
    const assassinPlayed = playArea.find(p => p.card.id === 'assassin' && p.playerId === 0);
    if (saviorPlayed || assassinPlayed) {
      this.unlockAchievement('assassin');
    }

    const reflectionCard = playArea.find(p => 
      p.card.id === 'reflection' && p.card.enhanced && p.card.power === 9 && p.playerId === 0
    );
    if (reflectionCard) {
      this.unlockAchievement('reflection');
    }

    // Friend pairs
    const penelope = playArea.find(p => p.card.id === 'penelope' && p.playerId === 0);
    const kc = playArea.find(p => p.card.id === 'kc' && p.playerId === 0);
    const feathers = playArea.find(p => p.card.id === 'feathers' && p.playerId === 0);
    const fevaa = playArea.find(p => p.card.id === 'fevaa' && p.playerId === 0);
    const binx = playArea.find(p => p.card.id === 'binx' && p.playerId === 0);
    const kite = playArea.find(p => p.card.id === 'kite' && p.playerId === 0);
    const subject192 = playArea.find(p => p.card.id === 'subject_192' && p.playerId === 0);
    const cyrus = playArea.find(p => p.card.id === 'cyrus' && p.playerId === 0);
    const ginger = playArea.find(p => p.card.id === 'ginger' && p.playerId === 0);
    const salvo = playArea.find(p => p.card.id === 'salvo' && p.playerId === 0);
    const chaos = playArea.find(p => p.card.id === 'chaos' && p.playerId === 0);
    const maturity = playArea.find(p => p.card.id === 'maturity' && p.playerId === 0);

    // Check pairs for achievements
    if (penelope && kc) {
      this.unlockAchievement('friendshipPower');
    }
    if (penelope && feathers) {
      this.unlockAchievement('mothersLove');
    }
    if (fevaa && binx) {
      this.unlockAchievement('demonAngel');
    }
    if (subject192 && cyrus) {
      this.unlockAchievement('subjectGuardian');
    }
    if (ginger && salvo) {
      this.unlockAchievement('gingerSalvo');
    }
    if (chaos && maturity) {
      this.unlockAchievement('perfectChaos');
    }
    if ((assassinPlayed || saviorPlayed) && kite) {
      this.unlockAchievement('thatComedian');
    }

    // Check for Glitch Kingdom achievement
    const hasNull = playArea.some(p => p.card.id === 'null' && p.playerId === 0);
    const hasMoonlight = playArea.some(p => p.card.id === 'moonlight' && p.playerId === 0);
    const hasAwareness = playArea.some(p => p.card.id === 'awareness' && p.playerId === 0);
    
    if (hasNull && (hasMoonlight || hasAwareness)) {
      this.unlockAchievement('glitchKingdom');
    }
  }

  checkDeckAchievements(deck) {
    if (!deck) return;
    
    // Check for enhanced Moonlight
    const hasEnhancedMoonlight = deck.some(card => 
      card.id === 'moonlight' && card.enhanced
    );
    
    if (hasEnhancedMoonlight) {
      this.unlockAchievement('sisterDeleted');
    }
  }
}