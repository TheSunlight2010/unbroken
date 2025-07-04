// UI rendering and display logic
export class GameUI {
  // removed UI-related methods from Game class and moved here:
  // - renderGame()  
  // - renderOpponentHands()
  // - renderPlayArea() 
  // - renderPlayerHand()
  // - createCardElement()

  static renderGame(game) {
    GameUI.renderOpponentHands(game);
    GameUI.renderPlayArea(game);
    GameUI.renderPlayerHand(game);
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.innerHTML = game.scores.map((score, i) => 
      `${i === 0 ? 'Player' : 'AI ' + i}: ${score}`
    ).join(' | ');
    
    const playArea = document.getElementById('play-area');
    playArea.insertBefore(scoreDisplay, playArea.firstChild);
  }

  static renderOpponentHands(game) {
    const container = document.getElementById('opponent-hands');
    container.innerHTML = '';

    for (let i = 1; i < game.players.length; i++) {
      const hand = document.createElement('div');
      hand.className = 'opponent-hand';
      
      for (let j = 0; j < game.players[i].deck.length; j++) {
        const card = document.createElement('div');
        card.className = 'card back';
        hand.appendChild(card);
      }
      
      container.appendChild(hand);
    }
  }

  static renderPlayArea(game) {
    const container = document.getElementById('play-area');
    container.innerHTML = '';

    game.playArea.forEach(played => {
      const element = GameUI.createCardElement(played.card);
      element.style.border = `1px solid ${played.playerId === 0 ? 'blue' : 'red'}`;
      container.appendChild(element);
    });
  }

  static renderPlayerHand(game) {
    const container = document.getElementById('player-hand');
    container.innerHTML = '';

    game.players[0].deck.forEach(card => {
      const cardElement = GameUI.createCardElement(card);
      cardElement.addEventListener('click', () => game.playCard(0, card));
      container.appendChild(cardElement);
    });
  }

  static createCardElement(card) {
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

  static checkAnticipation(game) {
    // Only play if exactly one card left AND a round just finished
    if (!game.roundInProgress && game.players[0].deck.length === 1) {
      // Check if Anticipation isn't already playing
      if (!ANTICIPATION_AUDIO.paused && ANTICIPATION_AUDIO.currentTime > 0) {
        return; // Exit if already playing
      }

      // Get last card
      const lastCard = game.players[0].deck[0];

      // Get appropriate track based on character or score
      let trackPath;
      
      // Check for special character tracks first
      if (lastCard.id === 'reflection') {
        trackPath = 'A Reflection Of Mistakes.mp3';
      } else if (lastCard.id === 'zero') {
        trackPath = 'The Void.mp3';
      } else if (lastCard.id === 'justice') {
        trackPath = 'A Hero Of Justice.mp3';
      } else if (lastCard.id === 'purple_guy') {
        trackPath = "Don't Leave Me Here.mp3";
      } else if (lastCard.id === 'penelope' || lastCard.id === 'eclipse_penelope') {
        trackPath = 'Heartwave.mp3';
      } else if (lastCard.id === 'frost') {
        trackPath = 'Winter Falls.mp3';
      } else if (lastCard.id === 'knight') {
        trackPath = 'Spare Them The Rod.mp3';
      } else if (lastCard.id === 'blitz') {
        trackPath = 'It Spreads.mp3';
      } else if (lastCard.id === 'cyrus') {
        trackPath = 'Can You Feel It_.mp3';
      } else if (lastCard.id === 'awareness') {
        trackPath = game.scores[0] >= 7 ? 'AN ALMOST GUARANTEED VICTORY.mp3' : 'Moonshine.mp3';
      } else if (lastCard.id === 'sunlight') {
        trackPath = 'AN ALMOST GUARANTEED VICTORY.mp3';
      } else if (lastCard.id === 'worendy') {
        trackPath = 'Create Our Factory.mp3';
      } else if (lastCard.id === 'fevaa') {
        trackPath = 'A Little Dizzy.mp3';
      } else if (lastCard.id === 'binx') {
        trackPath = 'Divine Victory.mp3';
      } else if (game.scores[0] >= 7) {
        trackPath = 'Anticipation (High but Lyrical).mp3';
      } else if (game.scores[0] >= 4) {
        trackPath = 'Anticipation (High).mp3';
      } else {
        trackPath = 'Anticipation.mp3';
      }

      // Update audio source and play
      ANTICIPATION_AUDIO.src = trackPath;

      // Add delay before playing
      setTimeout(() => {
        ANTICIPATION_AUDIO.currentTime = 0;
        ANTICIPATION_AUDIO.play().catch(err => console.log('Audio playback error:', err));

        // When music ends, auto-play the card if it hasn't been played yet
        ANTICIPATION_AUDIO.onended = () => {
          if (game.players[0].deck.length === 1 && !game.roundInProgress) {
            const lastCard = game.players[0].deck[0];
            game.playCard(0, lastCard);
          }
        };
      }, 800);
    }
  }
}

// Import at top
import { ANTICIPATION_AUDIO } from './gameState.js';