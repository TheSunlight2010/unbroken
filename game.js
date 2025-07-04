// Core game logic module
import { CARDS, UNCOMMON_CARDS, RARE_CARDS, SPECIAL_CASES, HOLLOWGREEN_CARDS } from './cards.js';
import { messages, tieMessages } from './messages.js';
import { showBusinessReview } from './business.js';
import { AchievementManager } from './achievements.js';
import { GameUI } from './gameUI.js';
import { ANTICIPATION_AUDIO } from './gameState.js';

const CHAT_EVENTS = [
  {
    participants: ['penelope', 'kc'],
    conversation: [
      { character: 'penelope', text: "KC! Want to play hide and seek?" },
      { character: 'kc', text: "Of course! You're always welcome to play!" },
      { character: 'penelope', text: "Yay! But no using your super smell this time!" },
      { character: 'kc', text: "*wags tail* No promises!" },
      { character: 'feathers', text: "Now now, be careful you two!" },
      { character: 'penelope', text: "We will, mama bird!" },
      { character: 'kc', text: "I'll make sure she stays safe!" }
    ]
  },
  {
    participants: ['cocoa', 'salvo', 'fester'],
    conversation: [
      { character: 'cocoa', text: "Hey! Want to see my new trick?" },
      { character: 'salvo', text: "Cocoa, maybe you shouldn't-" },
      { character: 'fester', text: "Last time you tried a trick, you set my hair on fire." },
      { character: 'cocoa', text: "That was an accident! This one's different!" },
      { character: 'salvo', text: "Everything's on fire now, isn't it?" },
      { character: 'cocoa', text: "...maybe?" }
    ]
  },
  {
    participants: ['echo', 'nova', 'vesper'],
    conversation: [
      { character: 'echo', text: "The stars are beautiful tonight." },
      { character: 'nova', text: "They're singing a new song." },
      { character: 'vesper', text: "The darkness makes them shine brighter." },
      { character: 'echo', text: "Shall we make them dance?" },
      { character: 'nova', text: "A cosmic symphony!" }
    ]
  },
  {
    participants: ['terra', 'soiley', 'evergreen'],
    conversation: [
      { character: 'terra', text: "What strange plants you are, mew~" },
      { character: 'soiley', text: "The garden grows as it wishes..." },
      { character: 'evergreen', text: "Join us in the deep earth..." },
      { character: 'terra', text: "*backs away slowly* Maybe another time, mew~" }
    ]
  },
  {
    participants: ['aurora', 'doppel'],
    conversation: [
      { character: 'aurora', text: "Stop copying me!" },
      { character: 'doppel', text: "Stop copying me!" },
      { character: 'aurora', text: "This isn't funny!" },
      { character: 'doppel', text: "This isn't funny!" },
      { character: 'aurora', text: "UGHHH!" },
      { character: 'doppel', text: "UGHHH!" }
    ]
  },
  {
    participants: ['prime', 'mr_bones', 'zero'],
    conversation: [
      { character: 'prime', text: "Time means nothing to us." },
      { character: 'mr_bones', text: "Yet it strengthens me still." },
      { character: 'zero', text: "All returns to nothing..." },
      { character: 'prime', text: "Perhaps that's why we endure." }
    ]
  },
  {
    participants: ['sally', 'carlgpt', 'reflection'],
    conversation: [
      { character: 'sally', text: "*yawns* These strategy meetings are boring." },
      { character: 'carlgpt', text: "According to my calculations-" },
      { character: 'reflection', text: "No one cares about your calculations." },
      { character: 'sally', text: "Wake me when something interesting happens." },
      { character: 'carlgpt', text: "But my spreadsheets..." }
    ]
  },
  {
    participants: ['chaos', 'maturity', 'enraged_kite'],
    conversation: [
      { character: 'maturity', text: "lmao git gud" },
      { character: 'chaos', text: "Please act your age..." },
      { character: 'enraged_kite', text: "I HATE BOTH OF YOU!" },
      { character: 'maturity', text: "skill issue tbh" },
      { character: 'chaos', text: "*sigh* Why do I even try?" }
    ]
  },
  {
    participants: ['ember', 'aqua', 'frost'],
    conversation: [
      { character: 'ember', text: "Too hot to handle?" },
      { character: 'aqua', text: "You wish, flame brain." },
      { character: 'frost', text: "...why can't we all just chill?" },
      { character: 'ember', text: "Was that a pun?" },
      { character: 'frost', text: "...maybe." }
    ]
  },
  {
    participants: ['blossom', 'herb', 'lavender'],
    conversation: [
      { character: 'blossom', text: "The garden whispers..." },
      { character: 'herb', text: "Death feeds its roots..." },
      { character: 'lavender', text: "Its secrets must be protected..." },
      { character: 'blossom', text: "Forever we grow..." },
      { character: 'herb', text: "Forever we consume..." }
    ]
  },
  {
    participants: ['highpoint', 'hitbox', 'seven'],
    conversation: [
      { character: 'highpoint', text: "Your calculations are flawed." },
      { character: 'hitbox', text: "Your movements are predictable." },
      { character: 'seven', text: "Want to bet on that?" },
      { character: 'highpoint', text: "...they're gambling again." },
      { character: 'hitbox', text: "Systems calculate 99% chance of explosion." }
    ]
  },
  {
    participants: ['leopold', 'goldie', 'ringmaster'],
    conversation: [
      { character: 'leopold', text: "I hate that I have to say this but..." },
      { character: 'goldie', text: "Money can solve ANY problem!" },
      { character: 'ringmaster', text: "WHAT A WONDERFUL SHOW!" },
      { character: 'leopold', text: "Please... please be quieter..." },
      { character: 'goldie', text: "I'll pay you to shout LOUDER!" },
      { character: 'ringmaster', text: "MAGNIFICENT! SPECTACULAR!" }
    ]
  },
  {
    participants: ['sunlight', 'sunex'],
    conversation: [
      { character: 'sunex', text: "Your limitations were necessary." },
      { character: 'sunlight', text: "And yet here you are, in my collection." },
      { character: 'sunex', text: "The seal cannot hold forever." },
      { character: 'sunlight', text: "Neither can your divine light." },
      { character: 'sunex', text: "We shall see..." }
    ]
  },
  {
    participants: ['drew', 'maturity', 'reflection', 'sally'],
    conversation: [
      { character: 'sally', text: "Ugh, you three are the worst." },
      { character: 'sally', text: "I have to spend my after-death hanging around some edgy mute, a chaos gremlin in lowercase, and Mr. I-Dismiss-You." },
      { character: 'drew', text: "Please, Sally. You act like you have better options." },
      { character: 'drew', text: "Everyone weaker than me gets dismissed, and everyone stronger... well, that's none of you." },
      { character: 'maturity', text: "lol get a grip drew, ur not even top 10. ur just tall and arrogant." },
      { character: 'sally', text: "Oh, please. I could tank both of you while sipping void martinis." },
      { character: 'sally', text: "And don't act like you don't need me, Drew. I saw that last match." },
      { character: 'sally', text: "Without me, you'd have been Reflection food." },
      { character: 'sally', text: "...right, Reflection?" },
      { character: 'reflection', text: "..." },
      { character: 'maturity', text: "he agrees. see? told ya he vibes with us" },
      { character: 'drew', text: "He doesn't even talk. What makes you so sure?" },
      { character: 'maturity', text: "'cause he stays." },
      { character: 'maturity', text: "he doesn't leave when sally starts monologuing, or when u get all 'i'm better than you' again." },
      { character: 'maturity', text: "he listens. even if it hurts. he stays." },
      { character: 'sally', text: "...We all stay. That's the point." },
      { character: 'sally', text: "None of us are... easy to be around." },
      { character: 'sally', text: "But at least we're not alone in that." },
      { character: 'drew', text: "...hmph." },
      { character: 'reflection', text: "To be broken... yet still remain... is... strength." },
      { character: 'maturity', text: "yoooo he spoke. write it down. print it on a shirt." },
      { character: 'sally', text: "Guess the void's quieter with us in it, huh?" },
      { character: 'drew', text: "I suppose there are worse groups to be stuck with.\nJust don't expect a hug." },
      { character: 'maturity', text: "no hugs. just... like... pain-based friendship. my specialty." },
      { character: 'reflection', text: "Even silence... has harmony." }
    ]
  },
  {
    participants: ['crystuf', 'blitz'],
    conversation: [
      { character: 'blitz', text: "Why are we fighting like this? It feels... wrong." },
      { character: 'crystuf', text: "It serves a greater purpose..." },
      { character: 'blitz', text: "But what purpose? We're just... trapped here." },
      { character: 'crystuf', text: "Perhaps that IS the purpose. To test our limits..." },
      { character: 'blitz', text: "I don't like being tested." },
      { character: 'crystuf', text: "None of us do. But we endure." }
    ]
  },
  {
    participants: ['fevaa', 'binx'],
    conversation: [
      { character: 'fevaa', text: "Binx! Stop playing pranks on the others!" },
      { character: 'binx', text: "Aw come on, they're harmless! ...mostly." },
      { character: 'fevaa', text: "You turned Terra's fur pink..." },
      { character: 'binx', text: "And she looked fabulous! Right?" },
      { character: 'fevaa', text: "*sigh* What am I going to do with you?" },
      { character: 'binx', text: "Love me forever? I am your best friend!" },
      { character: 'fevaa', text: "Yes... yes you are." }
    ]
  },
  {
    participants: ['fevaa', 'binx', 'blitz'],
    conversation: [
      { character: 'blitz', text: "So... you're my parents. From another timeline." },
      { character: 'fevaa', text: "This is... awkward." },
      { character: 'binx', text: "Hey, look on the bright side! You got my amazing sense of humor!" },
      { character: 'blitz', text: "I got corrupted by the void." },
      { character: 'fevaa', text: "Binx, maybe now isn't the time for jokes..." },
      { character: 'binx', text: "There's ALWAYS time for jokes! Right, future daughter?" },
      { character: 'blitz', text: "*corrupt angel noises*" }
    ]
  }
];

let nextGameGuaranteedCard = null;
let hadReflectionLastGame = false;
let activeCode = null;

// Near the top of the file, after other state variables
let lunaEncounters = parseInt(localStorage.getItem('lunaEncounters')) || 0;

export class Game {
  constructor() {
    this.achievementManager = new AchievementManager();
    this.players = [];
    this.currentPlayer = 0;
    this.playArea = [];
    this.scores = [];
    this.roundInProgress = false;
    this.setupEventListeners();
    this.setupCodeSystem();
    this.setupChatEvents();
    
    // Only setup rules modal button - removed ambiguous selector
    const rulesModal = document.getElementById('rules-modal');
    const rulesButton = document.getElementById('view-rules');
    const closeRulesBtn = document.querySelector('#rules-modal .close');

    if (rulesButton) {
      rulesButton.addEventListener('click', () => {
        rulesModal.style.display = 'block';
      });
    }

    if (closeRulesBtn) {
      closeRulesBtn.addEventListener('click', () => {
        rulesModal.style.display = 'none';
      });
    }

    window.addEventListener('click', (event) => {
      if (event.target === rulesModal) {
        rulesModal.style.display = 'none';
      }
    });
  }

  setupCodeSystem() {
    const codeInput = document.getElementById('code-input');
    const messageElement = document.getElementById('code-message');
    const sendButton = document.getElementById('send-code');

    if (!codeInput || !messageElement || !sendButton) {
      console.error('Code system elements not found');
      return;
    }

    // Only allow numbers
    codeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    const validateCode = () => {
      const code = codeInput.value;
      switch(code) {
        case '2010':
          messageElement.textContent = "Code accepted! Savior will join your next battle.";
          messageElement.style.color = '#00ff00';
          activeCode = 'SAVIOR';
          break;
        case '1981':
          messageElement.textContent = "Code accepted! Rare cards will fill your next deck.";
          messageElement.style.color = '#00ff00';
          activeCode = 'RARE';
          break;
        case '1111':
          messageElement.textContent = "Code accepted! Friendship power activated!";
          messageElement.style.color = '#00ff00';
          activeCode = 'FRIENDS';
          break;
        case '1910':
          messageElement.textContent = "Code accepted! Double enhancement activated!";
          messageElement.style.color = '#00ff00';
          activeCode = 'DOUBLE';
          break;
        case '0000':
          messageElement.textContent = "Code accepted! Praise the Sun!";
          messageElement.style.color = '#00ff00';
          activeCode = 'SUN';
          break;
        case '9281':
          messageElement.textContent = "Code accepted! The garden grows...";
          messageElement.style.color = '#00ff00';
          activeCode = 'GARDEN';
          break;
        default:
          messageElement.textContent = "Invalid code.";
          messageElement.style.color = '#ff0000';
          activeCode = null;
          break;
      }
      
      setTimeout(() => {
        messageElement.textContent = "";
      }, 3000);
      
      codeInput.value = '';
    };

    // Handle send button click
    sendButton.addEventListener('click', validateCode);

    // Also keep Enter key functionality
    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        validateCode();
      }
    });
  }

  setupChatEvents() {
    let waiting = false;
    let easterEggTimer = null;
    let lunaMessageIndex = 0;
    const lunaMessages = [
      "There's no easter eggs here, stupid.",
      "What are you waiting for? Play the game already.",
      "Stop looking for secrets and PLAY.",
      "Do you seriously think waiting around will do anything?",
      "Your dedication is admirable but pointless.",
      "This isn't one of those 'wait 999 seconds for a secret' games.",
      "I promise you, nothing will happen if you keep waiting.",
      "...except me getting increasingly annoyed.",
      "You're really stubborn, aren't you?",
      "Fine. Keep waiting. See if I care.",
      "You know what? I'm going to start counting.",
      "1... 2... 3... Play the game already!",
      "This isn't even an easter egg anymore, it's just sad.",
      "Are you writing these down? Stop that.",
      "Oh my god, you're STILL here?",
      "You must be really bored.",
      "Look, I'll level with you - there's nothing else to find.",
      "Except my growing frustration.",
      "WHY. ARE. YOU. STILL. HERE.",
      "You know what? I'm done. I'm not saying anything else.",
      "...",
      "...I lied about being done. Now I'm mad at myself too.",
      "This is technically an easter egg now, isn't it? Great.",
      "You win. Happy? Now play the actual game.",
      "If you're recording this, I hate you specifically.",
      "You know what? Fine. Let's do this MY way."
    ];

    const triggerChat = () => {
      if (waiting) return;
      waiting = true;
      
      setTimeout(() => {
        if (document.getElementById('player-select').style.display !== 'none') {
          this.showChatEvent();
          
          // Start Luna's messages after chat event
          if (easterEggTimer) clearTimeout(easterEggTimer);
          
          const showLunaMessage = () => {
            if (document.getElementById('player-select').style.display !== 'none') {
              // Check for Luna encounters or perfect win
              const lunaEncounters = parseInt(localStorage.getItem('lunaEncounters')) || 0;
              if (lunaEncounters >= 5) {
                // Show Visit Luna button instead
                const existingBtn = document.getElementById('visit-luna');
                if (!existingBtn) {
                  const visitBtn = document.createElement('button');
                  visitBtn.id = 'visit-luna';
                  visitBtn.className = 'main-button';
                  visitBtn.style.backgroundColor = '#ff00ff';
                  visitBtn.style.boxShadow = '0 0 10px #ff00ff';
                  visitBtn.textContent = 'Visit Luna';
                  visitBtn.addEventListener('click', () => {
                    window.location.href = 'luna.html';
                  });
                  document.querySelector('.game-options').appendChild(visitBtn);
                }
                return; // Don't show Luna messages
              }
              
              // Original Luna message logic
              const chatbox = document.createElement('div');
              chatbox.className = 'chat-event';
              chatbox.style.background = 'rgba(0, 0, 0, 0.95)';
              chatbox.style.border = '2px solid #ff00ff';
              chatbox.style.boxShadow = '0 0 10px #ff00ff';
              chatbox.innerHTML = `<div class="chat-content">
                <div class="chat-message" style="color: #ff00ff; text-shadow: 0 0 5px #ff00ff;">
                  <span>${lunaMessages[lunaMessageIndex]}</span>
                </div>
              </div>`;
              document.body.appendChild(chatbox);
              
              // If this is the last message, force start 2-player game
              if (lunaMessageIndex === lunaMessages.length - 1) {
                setTimeout(() => {
                  chatbox.remove();
                  // Force start 2-player game
                  this.startGame(2);
                }, 2000);
              } else {
                // Remove message after 4 seconds
                setTimeout(() => chatbox.remove(), 4000);
                
                // Schedule next message
                lunaMessageIndex++;
                setTimeout(showLunaMessage, Math.random() * 15000 + 15000); // Random 15-30 seconds
              }
            }
          };
          
          // Start Luna's messages after 40-50 seconds
          easterEggTimer = setTimeout(() => {
            showLunaMessage();
          }, Math.random() * 10000 + 40000);
        }
        waiting = false;
      }, Math.random() * 10000 + 20000); // Random time between 20-30 seconds
    };

    // Start the timer when page loads
    triggerChat();

    // Reset timer when returning to title screen
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.style.display === 'flex' || mutation.target.style.display === 'block') {
          triggerChat();
        }
      });
    });

    observer.observe(document.getElementById('player-select'), {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  showChatEvent() {
    const event = CHAT_EVENTS[Math.floor(Math.random() * CHAT_EVENTS.length)];
    const chatbox = document.createElement('div');
    chatbox.className = 'chat-event';
    chatbox.innerHTML = `<div class="chat-content"></div>`;
    document.body.appendChild(chatbox);

    // Disable buttons during chat
    const buttons = document.querySelectorAll('#player-select button');
    buttons.forEach(btn => btn.disabled = true);

    const chatContent = chatbox.querySelector('.chat-content');
    let messageIndex = 0;

    const showNextMessage = () => {
      if (messageIndex >= event.conversation.length) {
        setTimeout(() => {
          chatbox.remove();
          buttons.forEach(btn => btn.disabled = false);
        }, 1000);
        return;
      }

      const message = event.conversation[messageIndex];
      const messageElem = document.createElement('div');
      messageElem.className = 'chat-message';
      messageElem.innerHTML = `
        <img src="${message.character}.png" alt="${message.character}">
        <span>${message.text}</span>
      `;
      chatContent.appendChild(messageElem);
      messageElem.scrollIntoView({ behavior: 'smooth' });

      messageIndex++;
      
      // Calculate delay based on message length
      const baseDelay = 2000; // Base 2 seconds
      const lengthDelay = Math.min(1000, Math.floor(message.text.length / 20) * 200); // Add 200ms per 20 chars, max 1 second extra
      const totalDelay = baseDelay + lengthDelay;
      
      setTimeout(showNextMessage, totalDelay);
    };

    showNextMessage();
  }

  setupEventListeners() {
    document.querySelectorAll('#player-select .game-options button[data-players]').forEach(button => {
      button.addEventListener('click', () => this.startGame(parseInt(button.dataset.players)));
    });
    
    // Assuming there's a "Play Again" button in the #game-over screen
    const playAgainButton = document.querySelector('#game-over button');
    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => {
            document.getElementById('game-over').style.display = 'none';
            // Ensure player-select is visible, and game-board is hidden
            const playerSelectDiv = document.getElementById('player-select');
            if (playerSelectDiv) playerSelectDiv.style.display = 'flex'; // Or 'block' if it's not a flex container
            
            const gameBoardDiv = document.getElementById('game-board');
            if (gameBoardDiv) gameBoardDiv.style.display = 'none';
            
            const businessModal = document.getElementById('business-modal');
            if (businessModal) businessModal.style.display = 'none';
            
            // Reset game state for a new game
            this.resetGameStateForNewGame();
        });
    }
  }

  resetGameStateForNewGame() {
    this.players = [];
    this.playArea = [];
    this.currentPlayer = 0;
    this.scores = [];
    this.roundInProgress = false;
    nextGameGuaranteedCard = null; 
    // activeCode = null; // Decided by user on title screen
    
    const playAreaElem = document.getElementById('play-area');
    if (playAreaElem) playAreaElem.innerHTML = '';
    
    const playerHandElem = document.getElementById('player-hand');
    if (playerHandElem) playerHandElem.innerHTML = '';
    
    const opponentHandsElem = document.getElementById('opponent-hands');
    if (opponentHandsElem) opponentHandsElem.innerHTML = '';

    const winnerText = document.getElementById('winner-text');
    if (winnerText) winnerText.textContent = '';
  }

  startGame(numPlayers) {
    this.players = [];
    this.playArea = [];
    this.currentPlayer = 0;
    this.scores = new Array(numPlayers).fill(0);
    this.roundInProgress = false;

    // Check for Luna appearance based on player count
    let lunaChance;
    switch(numPlayers) {
      case 2: lunaChance = 0.05; break; // 1 in 20
      case 3: lunaChance = 0.10; break; // 1 in 10  
      case 4: lunaChance = 0.20; break; // 1 in 5
      default: lunaChance = 0;
    }

    let lunaIndex = -1;
    if (Math.random() < lunaChance) {
      // Pick random AI slot (1 to numPlayers-1)
      lunaIndex = 1 + Math.floor(Math.random() * (numPlayers - 1));
      
      if (lunaIndex !== -1) {
        // Load current count from localStorage
        let lunaEncounters = parseInt(localStorage.getItem('lunaEncounters')) || 0;
        lunaEncounters++;
        // Save updated count back to localStorage
        localStorage.setItem('lunaEncounters', lunaEncounters);
        
        // Check for achievement
        if (lunaEncounters >= 5) {
          this.achievementManager.unlockAchievement('parasiteHunter');
        }

        // Show warning message
        const warningMsg = document.createElement('div');
        warningMsg.className = 'win-message';
        warningMsg.style.position = 'fixed';
        warningMsg.style.top = '50%';
        warningMsg.style.left = '50%';
        warningMsg.style.transform = 'translate(-50%, -50%)';
        warningMsg.style.zIndex = '1000';
        warningMsg.innerHTML = `
          <div class="avatar" style="background-image: url(sunlight.png)"></div>
          <span>Warning: Parasite detected in system. Luna has infected one of my AIs. Good luck, you'll need it.</span>
        `;
        document.body.appendChild(warningMsg);
        setTimeout(() => warningMsg.remove(), 5000);
      }
    }

    for (let i = 0; i < numPlayers; i++) {
      this.players.push({
        id: i,
        deck: i === lunaIndex ? this.generateLunaDeck() : this.generateDeck(i === 0),
        isAI: i !== 0,
        isLuna: i === lunaIndex
      });
      
      if (i === 0) {
        this.achievementManager.checkDeckAchievements(this.players[i].deck);
      }
    }

    if (nextGameGuaranteedCard && nextGameGuaranteedCard.id === 'reflection') {
        // This check was slightly off, should be about the card *for the next game*
        // hadReflectionLastGame logic might need review based on when it's set.
    } else {
        // If the guaranteed card is not Reflection, or no card is guaranteed.
    }

    if (activeCode) {
      const messageElement = document.getElementById('code-message');
      if (messageElement) {
        messageElement.textContent = `Code ${activeCode} activated!`;
        setTimeout(() => {
          messageElement.textContent = "";
        }, 3000);
      }
    }
    
    const playerSelectDiv = document.getElementById('player-select');
    if(playerSelectDiv) playerSelectDiv.style.display = 'none';

    const gameBoardDiv = document.getElementById('game-board');
    if(gameBoardDiv) gameBoardDiv.style.display = 'block';
    
    const gameOverDiv = document.getElementById('game-over');
    if(gameOverDiv) gameOverDiv.style.display = 'none';

    this.renderGame();
  }

  generateDeck(isPlayerDeck) {
    let deck = [];
    const nullCard = UNCOMMON_CARDS.find(c => c.id === 'null');

    if (isPlayerDeck) { // Logic for player's deck
      if (nextGameGuaranteedCard) {
        deck.push({...nextGameGuaranteedCard});
        if (nextGameGuaranteedCard.id === 'reflection') {
          hadReflectionLastGame = true;
        }
      }

      // Handle active codes
      if (activeCode === 'SAVIOR' && !deck.some(c => c.id === 'savior')) {
        deck.push({...SPECIAL_CASES.find(c => c.id === 'savior')});
      } else if (activeCode === 'RARE') {
        const rareCount = deck.some(c => RARE_CARDS.map(rc => rc.id).includes(c.id)) ? 4 : 5;
        for(let i = 0; i < rareCount && deck.length < 9; i++) {
          deck.push({...RARE_CARDS[Math.floor(Math.random() * RARE_CARDS.length)]});
        }
        const specialCount = deck.some(c => SPECIAL_CASES.map(sc => sc.id).includes(c.id)) ? 1 : 2;
        for(let i = 0; i < specialCount && deck.length < 9; i++) {
          let cardToAdd;
          if (i === 0) { // Guarantee Allie as first special case
            cardToAdd = {...SPECIAL_CASES.find(c => c.id === 'allie')};
            cardToAdd.selectVariant(); // Select random variant for Allie
          } else {
            do {
              cardToAdd = {...SPECIAL_CASES[Math.floor(Math.random() * SPECIAL_CASES.length)]};
            } while (deck.some(c => c.id === cardToAdd.id) || cardToAdd.id === 'allie'); 
          }
          deck.push(cardToAdd);
        }
      } else if (activeCode === 'FRIENDS') {
        const friendCardIds = ['penelope', 'echo', 'kc'];
        const friendCards = friendCardIds.map(id => {
            let card = CARDS.find(c => c.id === id) || UNCOMMON_CARDS.find(c => c.id ===id);
            return card ? {...card, power: 9, enhanced: true} : null;
        }).filter(Boolean);

        while(deck.length < 9 && friendCards.length > 0) {
          deck.push({...friendCards[Math.floor(Math.random() * friendCards.length)]});
        }
      } else if (activeCode === 'DOUBLE') {
        // Generate normal deck then enhance
        const normalDeck = this.generateNormalDeckContent(true); // Pass true as it's for player
        deck = normalDeck.map(card => ({
          ...card,
          power: card.power * 2,
          enhanced: true
        }));
        // Ensure deck doesn't exceed 9 cards due to this logic
        if (deck.length > 9) deck = deck.slice(0,9);
      } else if (activeCode === 'SUN') {
        // Fill deck with Sunlight cards
        const sunlightCard = SPECIAL_CASES.find(c => c.id === 'sunlight');
        while (deck.length < 9) {
          deck.push({...sunlightCard});
        }
      } else if (activeCode === 'GARDEN') {
        // Fill deck with Hollowgreen Anomalies
        while (deck.length < 9) {
          const anomaly = {...HOLLOWGREEN_CARDS[Math.floor(Math.random() * HOLLOWGREEN_CARDS.length)]};
          
          // Add some variety in shield values
          if (Math.random() < 0.2) { // 20% chance for enhanced shield
            anomaly.shield += 2;
          }
          
          deck.push(anomaly);
        }
      }
      // Fill rest of deck
      deck = this.generateNormalDeckContent(true, deck); // Pass existing deck to fill up
      
      // Reset active code after use for the player's deck
      // activeCode = null; // Moved this to after game start to ensure it's used
    } else { // AI deck generation
      // Use same rarity chances as player deck
      while (deck.length < 9) {
        const rarity = Math.random();
        let cardPool;
        
        if (rarity < 0.01) { // Hollowgreen 1% each
          cardPool = HOLLOWGREEN_CARDS;
        } else if (rarity < 0.05) { // Special Cases chance
          const specialCardPool = SPECIAL_CASES.filter(card => {
            // Only include base special cases and new cave cards based on their spawn chance
            if (card.spawnChance) {
              return Math.random() < card.spawnChance;
            }
            return true;
          });
          cardPool = specialCardPool;
        } else if (rarity < 0.15) { // Rare 10%
          cardPool = RARE_CARDS;
        } else if (rarity < 0.25) { // Uncommon 10%
          cardPool = UNCOMMON_CARDS;
        } else { // Common 75%
          cardPool = CARDS;
        }
        
        if (!cardPool || cardPool.length === 0) continue; // Skip if pool is empty

        const cardTemplate = cardPool[Math.floor(Math.random() * cardPool.length)];
        // Avoid duplicates and special cases that shouldn't be in AI decks
        if (deck.some(c => c.id === cardTemplate.id) || 
            cardTemplate.id === 'reflection' || 
            cardTemplate.id === 'savior' ||
            cardTemplate.id === 'egg') continue;

        const isEnhanced = cardTemplate.id !== 'null' && 
                          cardTemplate.id !== 'awareness' && 
                          !cardTemplate.enhanced && 
                          Math.random() < 0.05; // Keep 5% enhancement chance

        deck.push({
          ...cardTemplate,
          power: isEnhanced ? cardTemplate.power + 2 : cardTemplate.power,
          enhanced: isEnhanced || cardTemplate.enhanced,
          shield: cardTemplate.shield // Preserve shield value for Hollowgreen cards
        });
      }

      // If deck isn't full, fill with common cards
      while (deck.length < 9) {
        const cardPool = CARDS;
        const randomCard = cardPool[Math.floor(Math.random() * cardPool.length)];
        if (!deck.some(c => c.id === randomCard.id)) {
          deck.push({...randomCard});
        }
      }

      // Ensure deck is exactly 9 cards
      deck = deck.slice(0, 9);
    }
    
    // Final validation to remove any undefined entries and replace with NULL
    deck = deck.filter(card => card).map(card => {
      if (!card || !card.id) {
        return {...nullCard};
      }
      return card;
    });

    // If deck is still not full after all this, fill with NULL cards
    while (deck.length < 9) {
      deck.push({...nullCard});
    }

    return deck;
  }

  generateNormalDeckContent(isPlayerDeck, currentDeck = []) {
    let deck = [...currentDeck]; // Start with the current deck (e.g., from guaranteed card or codes)

    if (isPlayerDeck) { 
      // Add Allie if Worendy is present (7% chance)
      const hasWorendy = currentDeck.some(c => c.id === 'worendy');
      if (hasWorendy && Math.random() < 0.07 && !deck.some(c => c.id === 'allie')) {
        const allieCard = {...SPECIAL_CASES.find(c => c.id === 'allie')};
        allieCard.selectVariant(); // Select random variant for Allie
        deck.push(allieCard);
      }

      // Individual 1% chances for each Hollowgreen anomaly
      if (!deck.some(c => c.id === 'blossom') && Math.random() < 0.01) {
        deck.push({...HOLLOWGREEN_CARDS.find(c => c.id === 'blossom')});
      }
      if (!deck.some(c => c.id === 'herb') && Math.random() < 0.01) {
        deck.push({...HOLLOWGREEN_CARDS.find(c => c.id === 'herb')});
      }
      if (!deck.some(c => c.id === 'ciph') && Math.random() < 0.01) {
        deck.push({...HOLLOWGREEN_CARDS.find(c => c.id === 'ciph')});
      }
      if (!deck.some(c => c.id === 'soiley') && Math.random() < 0.01) {
        deck.push({...HOLLOWGREEN_CARDS.find(c => c.id === 'soiley')});
      }
      if (!deck.some(c => c.id === 'evergreen') && Math.random() < 0.01) {
        deck.push({...HOLLOWGREEN_CARDS.find(c => c.id === 'evergreen')});
      }

      // Keep existing special case spawn chances
      if (!deck.some(c => c.id === 'doppel') && Math.random() < 0.01) {
        deck.push({...SPECIAL_CASES.find(c => c.id === 'doppel')});
      }
      if (!deck.some(c => c.id === 'reflection') && Math.random() < 0.025) { // Changed from 0.01 to 0.025
        deck.push({...SPECIAL_CASES.find(c => c.id === 'reflection')});
      }
      if (!deck.some(c => c.id === 'fevaa') && Math.random() < 0.05) {
        deck.push({...SPECIAL_CASES.find(c => c.id === 'fevaa')});
      }
      if (!deck.some(c => c.id === 'binx') && Math.random() < 0.05) {
        deck.push({...SPECIAL_CASES.find(c => c.id === 'binx')});
      }
      if (!deck.some(c => c.id === 'knight') && Math.random() < 0.04) { 
        deck.push({...SPECIAL_CASES.find(c => c.id === 'knight')});
      }
    }
    
    // Fill rest of deck
    while (deck.length < 9) {
      const rarity = Math.random();
      let cardPool;
      // Prioritize adding special/rare if player deck and not many present
      if (isPlayerDeck && deck.filter(c => c.rarity === 'rare' || c.rarity === 'special').length < 2 && rarity < 0.2) {
          cardPool = rarity < 0.1 ? RARE_CARDS : SPECIAL_CASES.filter(c => c.id !== 'assassin');
      } else if (rarity < 0.05 && (RARE_CARDS.length > 0)) { // 5% Rare
        cardPool = RARE_CARDS;
      } else if (rarity < 0.15 && (UNCOMMON_CARDS.length > 0)) { // 10% Uncommon (cumulative 15%)
        // Include Ginger in uncommon pool for player
        cardPool = isPlayerDeck ? [...UNCOMMON_CARDS, SPECIAL_CASES.find(c => c.id === 'ginger')].filter(Boolean) : UNCOMMON_CARDS;
      } else {
        cardPool = CARDS;
      }
      
      if (!cardPool || cardPool.length === 0) continue; // Skip if pool is empty

      const cardTemplate = cardPool[Math.floor(Math.random() * cardPool.length)];
      if (deck.some(c => c.id === cardTemplate.id)) continue; // Avoid duplicates

      const isEnhanced = cardTemplate.id !== 'null' && cardTemplate.id !== 'awareness' && !cardTemplate.enhanced && Math.random() < 0.05;
      deck.push({
        ...cardTemplate,
        power: isEnhanced ? cardTemplate.power + 2 : cardTemplate.power,
        enhanced: isEnhanced || cardTemplate.enhanced
      });
    }
    
    return deck.slice(0, 9); // Ensure deck is exactly 9 cards
  }
  
  generateLunaDeck() {
    let deck = [];
    const rarePool = [...RARE_CARDS, ...UNCOMMON_CARDS].filter(card => 
      card.id !== 'null' && card.id !== 'awareness'
    );

    while (deck.length < 9) {
      const cardTemplate = rarePool[Math.floor(Math.random() * rarePool.length)];
      if (deck.some(c => c.id === cardTemplate.id)) continue;

      const powerBoost = Math.floor(Math.random() * 7); // 0-6 power boost
      deck.push({
        ...cardTemplate,
        power: Math.min(14, cardTemplate.power + powerBoost), // Cap at 14
        enhanced: true
      });
    }

    return deck;
  }

  renderGame() {
    GameUI.renderOpponentHands(this);
    GameUI.renderPlayArea(this);
    GameUI.renderPlayerHand(this);
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.innerHTML = this.scores.map((score, i) => {
      if (i === 0) {
        return `Player: ${score}`;
      } else {
        const isLuna = this.players[i].isLuna;
        return isLuna ? 
          `<span style="color: #ff00ff; text-shadow: 0 0 5px #ff00ff;">Luna: ${score}</span>` : 
          `AI ${i}: ${score}`;
      }
    }).join(' | ');
    
    const playArea = document.getElementById('play-area');
    playArea.insertBefore(scoreDisplay, playArea.firstChild);

    if (this.players[0].deck.length === 1) {
      GameUI.checkAnticipation(this);
    }
  }

  renderOpponentHands() {
    const container = document.getElementById('opponent-hands');
    container.innerHTML = '';

    for (let i = 1; i < this.players.length; i++) {
      const hand = document.createElement('div');
      hand.className = 'opponent-hand';
      
      for (let j = 0; j < this.players[i].deck.length; j++) {
        const card = document.createElement('div');
        card.className = 'card back';
        hand.appendChild(card);
      }
      
      container.appendChild(hand);
    }
  }

  renderPlayArea() {
    const container = document.getElementById('play-area');
    container.innerHTML = '';

    this.playArea.forEach(played => {
      const element = this.createCardElement(played.card);
      element.style.border = `1px solid ${played.playerId === 0 ? 'blue' : 'red'}`;
      container.appendChild(element);
    });
  }

  renderPlayerHand() {
    const container = document.getElementById('player-hand');
    container.innerHTML = '';

    this.players[0].deck.forEach(card => {
      const cardElement = this.createCardElement(card);
      cardElement.addEventListener('click', () => this.playCard(0, card));
      container.appendChild(cardElement);
    });
  }

  createCardElement(card) {
    const element = document.createElement('div');
    element.className = `card ${card.enhanced ? 'enhanced' : ''} ${card.id === 'null' ? 'glitch' : ''}`;
    element.dataset.cardId = card.id;

    if (card.id === 'null') {
      element.innerHTML = `
        <div class="character glitch-bg"></div>
        <div class="info">
          <div class="name">███████</div>
          <div class="ability">${card.ability}</div>
        </div>
        <div class="power">NULL</div>
      `;
    } else if (card.id === 'zero') {
      element.innerHTML = `
        <div class="character" style="background: url(${card.image}) no-repeat center/cover"></div>
        <div class="info">
          <div class="name">${card.name}</div>
          <div class="ability">${card.ability}</div>
        </div>
        <div class="power">0</div>
      `;
    } else if (card.id === 'awareness') {
      element.innerHTML = `
        <div class="character" style="background: url(${card.image}) no-repeat center/cover"></div>
        <div class="info">
          <div class="name">${card.name}</div>
          <div class="ability">${card.ability}</div>
        </div>
        <div class="power">∞</div>
      `;
    } else {
      element.innerHTML = `
        <div class="character" style="background: url(${card.image}) no-repeat center/cover"></div>
        <div class="info">
          <div class="name">${card.name}${card.enhanced ? ' [Enhanced]' : ''}</div>
          <div class="ability">${card.ability}</div>
        </div>
        <div class="power">${card.power}</div>
      `;
    }
    return element;
  }

  async playCard(playerId, card) {
    if (playerId === 0 && this.roundInProgress) return;
    
    const player = this.players[playerId];
    player.deck = player.deck.filter(c => c !== card);

    // Apply any pending penalties
    if (this.nextCardPenalty && !card.protected) {
      card.power = Math.max(1, card.power - this.nextCardPenalty);
      this.nextCardPenalty = 0;
    }

    this.playArea.push({ card, playerId });
    
    // Don't apply player card ability immediately - wait for AI turns
    if (playerId !== 0 && card.applyAbility && !card.protected) {
      card.applyAbility(this, this.playArea);
    }

    this.renderGame();

    if (playerId === 0) {
      this.roundInProgress = true;
      
      // Apply player's card ability AFTER AI plays their cards
      await this.playAITurns();
      
      // Now apply the player's card ability if it exists
      if (card.applyAbility && !card.protected) {
        card.applyAbility(this, this.playArea);
        // Re-render to show updated state after player ability
        this.renderGame();
      }
      
      if (this.playArea.length === this.players.length) {
        await this.resolveRound();
      }
    }
  }

  async playAITurns() {
    for (let i = 1; i < this.players.length; i++) {
      if (this.players[i].deck.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const aiCard = this.selectAICard(this.players[i]);
        await this.playCard(i, aiCard);
      }
    }
  }

  selectAICard(aiPlayer) {
    if (this.playArea.length === 0) {
      return aiPlayer.deck.find(card => card.power <= 6) || aiPlayer.deck[0];
    } else {
      const highestInPlay = Math.max(...this.playArea.map(p => p.card.power));
      const playableCard = aiPlayer.deck.find(card => card.power > highestInPlay);
      return playableCard || aiPlayer.deck[0];
    }
  }

  async resolveRound() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find highest power level
    const highestPower = Math.max(...this.playArea.map(p => p.card.power));
    
    // Find all winners (cards with highest power)
    const winners = this.playArea.filter(p => p.card.power === highestPower);

    // Check for Savior transformation BEFORE awarding points
    const playerLost = winners.every(w => w.playerId !== 0);
    if (playerLost) {
      const saviorCard = this.playArea.find(p => p.playerId === 0 && p.card.id === 'savior');
      if (saviorCard && !saviorCard.card.transformed) {
        // Transform into Assassin
        saviorCard.card.transformed = true;
        saviorCard.card.id = 'assassin';
        saviorCard.card.name = 'A̷s̷s̷a̷s̷s̷i̷n̷';
        saviorCard.card.power = 13;
        saviorCard.card.ability = 'Target Eliminated: Sets all other cards\' power to -1';
        saviorCard.card.image = 'assassin.png';
        
        // Visual effects for transformation
        const transformMsg = document.createElement('div');
        transformMsg.className = 'win-message';
        transformMsg.innerHTML = `
          <div class="avatar" style="background-image: url(assassin.png)"></div>
          <span>T̷a̷r̷g̷e̷t̷s̷ ̷a̷c̷q̷u̷i̷r̷e̷d̷.̷.̷.̷</span>
        `;
        document.getElementById('play-area').appendChild(transformMsg);
        
        // Set all other cards' power to -1
        this.playArea.forEach(played => {
          if (played.card.id !== 'assassin') {
            played.card.power = -1;
          }
        });
        
        // Recalculate winners after transformation
        const newHighestPower = Math.max(...this.playArea.map(p => p.card.power));
        winners.length = 0; // Clear winners array
        this.playArea.filter(p => p.card.power === newHighestPower)
          .forEach(w => winners.push(w));
          
        // Give time for the transformation animation
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Award points to all winners
    winners.forEach(winner => {
      this.scores[winner.playerId]++;
    });

    // Generate and display win/tie messages
    if (winners.length > 1) {
      // It's a tie - show messages for each winner
      for (let i = 0; i < winners.length; i++) {
        const winner = winners[i];
        let message = '';

        // Check for special pair interactions
        if (winners.length === 2) {
          const cards = [winners[0].card.id, winners[1].card.id].sort().join('_');
          if (tieMessages.pairs[cards]) {
            message = tieMessages.pairs[cards][Math.floor(Math.random() * tieMessages.pairs[cards].length)];
          }
        }

        // If no special pair message, use character-specific or default
        if (!message) {
          if (winner.card.id in tieMessages.special) {
            message = tieMessages.special[winner.card.id][Math.floor(Math.random() * tieMessages.special[winner.card.id].length)];
          } else {
            message = tieMessages.default[winner.card.enhanced ? 'enhanced' : 'default'][
              Math.floor(Math.random() * tieMessages.default[winner.card.enhanced ? 'enhanced' : 'default'].length)
            ];
          }
        }

        const winMessageElem = document.createElement('div');
        winMessageElem.className = `win-message ${winner.card.enhanced ? 'enhanced' : ''} ${winner.card.id === 'null' ? 'null' : ''}`;
        winMessageElem.style.bottom = `${-40 - (i * 40)}px`; // Stack messages vertically

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        if (winner.card.id === 'null') {
          avatar.style.background = '#000';
        } else if (winner.card.id === 'moonlight') {
          avatar.style.background = '#000';
          avatar.style.animation = 'glitch 0.3s infinite';
        } else {
          avatar.style.backgroundImage = `url(${winner.card.image})`;
        }

        const messageText = document.createElement('span');
        messageText.textContent = message;

        winMessageElem.appendChild(avatar);
        winMessageElem.appendChild(messageText);
        document.getElementById('play-area').appendChild(winMessageElem);

        // Set timeout to remove ALL messages after delay
        if (i === winners.length - 1) { // Only set timeout on last message
          setTimeout(() => {
            // Remove all win messages
            document.querySelectorAll('.win-message').forEach(elem => elem.remove());
            this.playArea = [];
            this.roundInProgress = false;
            this.currentPlayer = 0;

            if (this.players.every(player => player.deck.length === 0)) {
              this.endGame();
            }

            this.renderGame();
          }, 2000);
        }
      }
    } else {
      // Single winner - use existing win message logic
      const winner = winners[0];
      let message = '';
      const getRandomMessage = arr => arr[Math.floor(Math.random() * arr.length)];

      // Select appropriate message
      if (winner.card) {
        if (winner.card.id in messages.special) {
          message = getRandomMessage(messages.special[winner.card.id]);
        } else if (winner.playerId === 0) {
          if (winner.card.resonanceBoosted && winner.card.friendshipBoosted) {
            message = getRandomMessage(messages.playerOwn.resonanceAndFriendship);
          } else if (winner.card.resonanceBoosted) {
            message = getRandomMessage(messages.playerOwn.resonance);
          } else if (winner.card.friendshipBoosted) {
            message = getRandomMessage(messages.playerOwn.friendship);
          } else {
            message = getRandomMessage(winner.card.enhanced ? 
              messages.playerOwn.enhanced : 
              messages.playerOwn.default);
          }
        } else {
          message = getRandomMessage(winner.card.enhanced ? 
            messages.aiWin.enhanced : 
            messages.aiWin.default);
        }
      }

      // Create and show win message element with avatar
      const winMessageElem = document.createElement('div');
      winMessageElem.className = `win-message ${winner.card.enhanced ? 'enhanced' : ''} ${winner.card.id === 'null' ? 'null' : ''}`;
      
      // Create avatar container
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      if (winner.card.id === 'null') {
        avatar.style.background = '#000';
      } else if (winner.card.id === 'moonlight') {
        avatar.style.background = '#000';
        avatar.style.animation = 'glitch 0.3s infinite';
      } else {
        avatar.style.backgroundImage = `url(${winner.card.image})`;
      }
      
      // Create message container
      const messageText = document.createElement('span');
      messageText.textContent = message;
      
      // Assemble win message
      winMessageElem.appendChild(avatar);
      winMessageElem.appendChild(messageText);
      document.getElementById('play-area').appendChild(winMessageElem);

      // Remove message after delay
      setTimeout(() => {
        winMessageElem.remove();
        this.playArea = [];
        this.roundInProgress = false;
        this.currentPlayer = 0;

        if (this.players.every(player => player.deck.length === 0)) {
          this.endGame();
        }

        this.renderGame();
      }, 2000);
    }

    // If player has Reflection, always increase its power
    const reflectionCard = this.players[0].deck.find(card => card.id === 'reflection');
    if (reflectionCard && !reflectionCard.enhanced) {
      reflectionCard.power++;
      reflectionCard.powerGainedFromLosses++;
      
      // If it's the last card, enhance it
      if (this.players[0].deck.length === 1) {
        reflectionCard.power = 9;
        reflectionCard.enhanced = true;
        // Use special red glow for Reflection
        const cardElement = document.querySelector(`[data-card-id="reflection"]`);
        if (cardElement) {
          cardElement.style.animation = 'none';
          cardElement.style.boxShadow = '0 0 10px #ff0000';
          cardElement.style.animation = 'fireGlow 1.5s ease-in-out infinite alternate';
        }
      }
    }

    this.achievementManager.checkPlayAreaAchievements(this.playArea);
  }

  endGame() {
    if (ANTICIPATION_AUDIO && !ANTICIPATION_AUDIO.paused) {
      ANTICIPATION_AUDIO.pause();
      ANTICIPATION_AUDIO.currentTime = 0;
    }

    const lunaPlayer = this.players.find(p => p.isLuna);
    if (lunaPlayer && this.scores[0] > this.scores[lunaPlayer.id]) {
      this.achievementManager.unlockAchievement('parasiteSlayer');
      
      // Add check for perfect win against Luna
      if (this.scores[0] === 9) {
        let lunaEncounters = parseInt(localStorage.getItem('lunaEncounters')) || 0;
        lunaEncounters = 5; // Force to 5 to enable Luna room access
        localStorage.setItem('lunaEncounters', lunaEncounters);
        this.achievementManager.unlockAchievement('parasiteHunter');
      }
    }

    const winnerTextElement = document.getElementById('winner-text');
    const gameOverElement = document.getElementById('game-over');
    
    // Determine winner(s)
    const maxScore = Math.max(...this.scores);
    const winners = this.scores.map((score, index) => score === maxScore ? index : -1).filter(index => index !== -1);
    
    let winnerMessage = "";
    if (winners.length === 1) {
      winnerMessage = `${winners[0] === 0 ? 'Player' : 'AI ' + winners[0]} wins with ${maxScore} points!`;
    } else {
      winnerMessage = `It's a tie! Players ${winners.map(w => w === 0 ? 'Player' : 'AI ' + w).join(' and ')} all have ${maxScore} points!`;
    }

    if (winnerTextElement) {
      winnerTextElement.textContent = winnerMessage;
    }
    
    if (gameOverElement) {
      gameOverElement.style.display = 'flex';
      
      // Hide the game over screen after 5 seconds
      setTimeout(() => {
        gameOverElement.style.display = 'none';
        
        // Show business review after win message disappears
        showBusinessReview(this.scores[0], this.players.length, CARDS.concat(UNCOMMON_CARDS, RARE_CARDS, SPECIAL_CASES), (selectedCard) => {
          nextGameGuaranteedCard = selectedCard;
          activeCode = null;
          
          // Reset guaranteed card for AI
          if (nextGameGuaranteedCard && this.players.length > 1 && this.players[0].isAI) {
            nextGameGuaranteedCard = null;
          }
          
          // Show player select screen after business review
          const playerSelectDiv = document.getElementById('player-select');
          if (playerSelectDiv) playerSelectDiv.style.display = 'flex';
        });
      }, 5000);
    }

    this.achievementManager.checkGameEndAchievements(this);
  }
}

new Game();