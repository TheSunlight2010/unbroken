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
}