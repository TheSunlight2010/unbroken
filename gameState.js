// Game state management
export class GameState {
  constructor() {
    this.players = [];
    this.currentPlayer = 0;
    this.playArea = [];
    this.scores = [];
    this.roundInProgress = false;
    this.nextCardPenalty = 0;
    this.nextAbilityBlocked = false;
  }

  static generateDeck(isPlayerDeck) {
    let deck = [];
    
    if (isPlayerDeck) { // Logic for player's deck
      if (nextGameGuaranteedCard) {
        deck.push({...nextGameGuaranteedCard});
        if (nextGameGuaranteedCard.id === 'reflection') {
          hadReflectionLastGame = true;
        }
      }

      // Handle active codes
      if (activeCode === 'SAVIOR' && !deck.some(c => c.id === 'savior')) {
        const saviorCard = SPECIAL_CASES.find(c => c.id === 'savior');
        if (saviorCard) deck.push({...saviorCard});
      } else if (activeCode === 'RARE') {
        const rareCount = deck.some(c => RARE_CARDS.map(rc => rc.id).includes(c.id)) ? 4 : 5;
        for(let i = 0; i < rareCount && deck.length < 9; i++) {
          const validRareCards = RARE_CARDS.filter(card => !deck.some(c => c.id === card.id));
          if (validRareCards.length > 0) {
            deck.push({...validRareCards[Math.floor(Math.random() * validRareCards.length)]});
          }
        }
        
        const specialCount = deck.some(c => SPECIAL_CASES.map(sc => sc.id).includes(c.id)) ? 1 : 2;
        for(let i = 0; i < specialCount && deck.length < 9; i++) {
          let cardToAdd;
          if (i === 0) { // Guarantee Allie as first special case
            cardToAdd = {...SPECIAL_CASES.find(c => c.id === 'allie')};
            if (cardToAdd) cardToAdd.selectVariant(); // Select random variant for Allie
          } else {
            do {
              const validSpecialCards = SPECIAL_CASES.filter(card => 
                !deck.some(c => c.id === card.id) && card.id !== 'allie'
              );
              if (validSpecialCards.length === 0) break;
              cardToAdd = {...validSpecialCards[Math.floor(Math.random() * validSpecialCards.length)]};
            } while (!cardToAdd || deck.some(c => c.id === cardToAdd.id));
          }
          if (cardToAdd) deck.push(cardToAdd);
        }
      }

      // Fill rest of deck if not filled by codes or guaranteed card
      if (deck.length < 9) {
        deck = this.generateNormalDeckContent(true, deck);
      }
      
    } else { // AI deck generation
      while (deck.length < 9) {
        const rarity = Math.random();
        let cardPool;

        if (rarity < 0.01) { // Hollowgreen 1%
          cardPool = HOLLOWGREEN_CARDS.filter(card => !deck.some(c => c.id === card.id));
        } else if (rarity < 0.05) { // Special Cases 4%
          cardPool = SPECIAL_CASES.filter(card => 
            !deck.some(c => c.id === card.id) && 
            !['reflection', 'savior', 'egg', 'assassin'].includes(card.id)
          );
        } else if (rarity < 0.15) { // Rare 10%
          cardPool = RARE_CARDS.filter(card => !deck.some(c => c.id === card.id));
        } else if (rarity < 0.25) { // Uncommon 10%
          cardPool = UNCOMMON_CARDS.filter(card => !deck.some(c => c.id === card.id));
        } else { // Common 75%
          cardPool = CARDS.filter(card => !deck.some(c => c.id === card.id));
        }

        if (!cardPool || cardPool.length === 0) continue;

        const cardTemplate = cardPool[Math.floor(Math.random() * cardPool.length)];
        if (!cardTemplate) continue;

        const isEnhanced = cardTemplate.id !== 'null' && 
                          cardTemplate.id !== 'awareness' && 
                          !cardTemplate.enhanced && 
                          Math.random() < 0.05;

        const card = {
          ...cardTemplate,
          power: isEnhanced ? cardTemplate.power + 2 : cardTemplate.power,
          enhanced: isEnhanced || cardTemplate.enhanced,
          shield: cardTemplate.shield // Preserve shield value for Hollowgreen cards
        };

        if (card.id === 'allie') {
          card.selectVariant();
        }

        deck.push(card);
      }

      // If deck isn't full, fill with common cards
      while (deck.length < 9) {
        const validCommonCards = CARDS.filter(card => !deck.some(c => c.id === card.id));
        if (validCommonCards.length === 0) break;
        const randomCard = validCommonCards[Math.floor(Math.random() * validCommonCards.length)];
        if (randomCard) deck.push({...randomCard});
      }

      // Ensure deck is exactly 9 cards
      deck = deck.slice(0, 9);
    }

    // Final validation to remove any undefined entries
    deck = deck.filter(card => card && card.id);

    // If deck is still not full after all this, fill with basic cards
    while (deck.length < 9) {
      const basicCard = CARDS[0]; // Use first common card as fallback
      if (basicCard) deck.push({...basicCard});
    }

    return deck;
  }

  generateNormalDeckContent(isPlayerDeck, currentDeck = []) {
    let deck = [...currentDeck];

    if (isPlayerDeck) { 
      const hasWorendy = currentDeck.some(c => c.id === 'worendy');
      if (hasWorendy && Math.random() < 0.07 && !deck.some(c => c.id === 'allie')) {
        const allieCard = {...SPECIAL_CASES.find(c => c.id === 'allie')};
        allieCard.selectVariant();
        deck.push(allieCard);
      }

      // Hollowgreen anomalies
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

      // Special cases
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

    // Fill rest of deck if not filled by codes or guaranteed card
    if (deck.length < 9) {
      deck = this.generateNormalDeckContent(true, deck);
    }
    
    return deck;
  }

  setupCodeSystem() {
    const codeInput = document.getElementById('code-input');
    const messageElement = document.getElementById('code-message');

    if (!codeInput || !messageElement) {
      console.error('Code system elements not found');
      return;
    }

    codeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const code = codeInput.value;
        switch(code) {
          case '2010':
            messageElement.textContent = "Code accepted! Savior will join your next battle.";
            activeCode = 'SAVIOR';
            break;
          case '1981':
            messageElement.textContent = "Code accepted! Rare cards will fill your next deck.";
            activeCode = 'RARE';
            break;
          case '1111':
            messageElement.textContent = "Code accepted! Friendship power activated!";
            activeCode = 'FRIENDS';
            break;
          case '1910':
            messageElement.textContent = "Code accepted! Double enhancement activated!";
            activeCode = 'DOUBLE';
            break;
          case '9987':
            messageElement.textContent = "Code accepted! The greenhouse calls...";
            activeCode = 'HOLLOWGREEN';
            break;
          default:
            messageElement.textContent = "Invalid code.";
            activeCode = null;
            break;
        }
        
        setTimeout(() => {
          messageElement.textContent = "";
        }, 3000);
        
        codeInput.value = '';
      }
    });
  }

  startGame(numPlayers, activeCode, nextGameGuaranteedCard, hadReflectionLastGame) {
    this.players = [];
    this.playArea = [];
    this.scores = new Array(numPlayers).fill(0);
    this.roundInProgress = false;

    for (let i = 0; i < numPlayers; i++) {
      this.players.push({
        id: i,
        deck: GameState.generateDeck(i === 0, activeCode, nextGameGuaranteedCard, hadReflectionLastGame), 
        isAI: i !== 0
      });
    }

    // Hide player select and show game board
    const playerSelectDiv = document.getElementById('player-select');
    if (playerSelectDiv) playerSelectDiv.style.display = 'none';

    const gameBoardDiv = document.getElementById('game-board');
    if (gameBoardDiv) gameBoardDiv.style.display = 'block';

    const gameOverDiv = document.getElementById('game-over');
    if (gameOverDiv) gameOverDiv.style.display = 'none';

    this.renderGame();
  }

  resetGameStateForNewGame() {
    this.players = [];
    this.playArea = [];
    this.currentPlayer = 0;
    this.scores = [];
    this.roundInProgress = false;
    nextGameGuaranteedCard = null; 
    activeCode = null;
    
    const playAreaElem = document.getElementById('play-area');
    if (playAreaElem) playAreaElem.innerHTML = '';
    
    const playerHandElem = document.getElementById('player-hand');
    if (playerHandElem) playerHandElem.innerHTML = '';
    
    const opponentHandsElem = document.getElementById('opponent-hands');
    if (opponentHandsElem) opponentHandsElem.innerHTML = '';

    const winnerText = document.getElementById('winner-text');
    if (winnerText) winnerText.textContent = '';
  }

  setupEventListeners() {
    document.querySelectorAll('#player-select .game-options button[data-players]').forEach(button => {
      button.addEventListener('click', () => this.startGame(parseInt(button.dataset.players), activeCode, nextGameGuaranteedCard, hadReflectionLastGame));
    });
    
    const playAgainButton = document.querySelector('#game-over button');
    if (playAgainButton) {
      playAgainButton.addEventListener('click', () => {
        document.getElementById('game-over').style.display = 'none';
        this.resetGameStateForNewGame();
      });
    }
  }

  endGame() {
    const winnerTextElement = document.getElementById('winner-text');
    const gameOverElement = document.getElementById('game-over');
    
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
      
      setTimeout(() => {
        gameOverElement.style.display = 'none';
        
        showBusinessReview(this.scores[0], this.players.length, CARDS.concat(UNCOMMON_CARDS, RARE_CARDS, SPECIAL_CASES), (selectedCard) => {
          nextGameGuaranteedCard = selectedCard;
          activeCode = null;
          
          const playerSelectDiv = document.getElementById('player-select');
          if (playerSelectDiv) playerSelectDiv.style.display = 'flex';
        });
      }, 5000);
    }
  }

  renderGame() {
    this.renderOpponentHands();
    this.renderPlayArea();
    this.renderPlayerHand();
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.innerHTML = this.scores.map((score, i) => 
      `${i === 0 ? 'Player' : 'AI ' + i}: ${score}`
    ).join(' | ');
    
    const playArea = document.getElementById('play-area');
    playArea.insertBefore(scoreDisplay, playArea.firstChild);
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

    if (this.nextCardPenalty && !card.protected) {
      card.power = Math.max(1, card.power - this.nextCardPenalty);
      this.nextCardPenalty = 0;
    }

    this.playArea.push({ card, playerId });
    
    if (playerId !== 0 && card.applyAbility && !card.protected) {
      card.applyAbility(this, this.playArea);
    }

    this.renderGame();

    if (playerId === 0) {
      this.roundInProgress = true;
      
      await this.playAITurns();
      
      if (card.applyAbility && !card.protected) {
        card.applyAbility(this, this.playArea);
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

    const highestPower = Math.max(...this.playArea.map(p => p.card.power));
    
    const winners = this.playArea.filter(p => p.card.power === highestPower);

    const playerLost = winners.every(w => w.playerId !== 0);
    if (playerLost) {
      const saviorCard = this.playArea.find(p => p.playerId === 0 && p.card.id === 'savior');
      if (saviorCard && !saviorCard.card.transformed) {
        saviorCard.card.transformed = true;
        saviorCard.card.id = 'assassin';
        saviorCard.card.name = 'A̷s̷s̷a̷s̷s̷i̷n̷';
        saviorCard.card.power = 13;
        saviorCard.card.ability = 'Target Eliminated: Sets all other cards\' power to -1';
        saviorCard.card.image = 'assassin.png';
        
        this.playArea.forEach(played => {
          if (played.card.id !== 'assassin') {
            played.card.power = -1;
          }
        });
        
        const newHighestPower = Math.max(...this.playArea.map(p => p.card.power));
        winners.length = 0; 
        this.playArea.filter(p => p.card.power === newHighestPower)
          .forEach(w => winners.push(w));
          
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    winners.forEach(winner => {
      this.scores[winner.playerId]++;
    });

    if (winners.length > 1) {
      for (let i = 0; i < winners.length; i++) {
        const winner = winners[i];
        let message = '';

        if (winners.length === 2) {
          const cards = [winners[0].card.id, winners[1].card.id].sort().join('_');
          if (tieMessages.pairs[cards]) {
            message = tieMessages.pairs[cards][Math.floor(Math.random() * tieMessages.pairs[cards].length)];
          }
        }

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
        winMessageElem.style.bottom = `${-40 - (i * 40)}px`; 

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

        if (i === winners.length - 1) { 
          setTimeout(() => {
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
      const winner = winners[0];
      let message = '';
      const getRandomMessage = arr => arr[Math.floor(Math.random() * arr.length)];

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

      const winMessageElem = document.createElement('div');
      winMessageElem.className = `win-message ${winner.card.enhanced ? 'enhanced' : ''} ${winner.card.id === 'null' ? 'null' : ''}`;
      
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

    const reflectionCard = this.players[0].deck.find(card => card.id === 'reflection');
    if (reflectionCard && !reflectionCard.enhanced) {
      reflectionCard.power++;
      reflectionCard.powerGainedFromLosses++;
      
      if (this.players[0].deck.length === 1) {
        reflectionCard.power = 9;
        reflectionCard.enhanced = true;
        const cardElement = document.querySelector(`[data-card-id="reflection"]`);
        if (cardElement) {
          cardElement.style.animation = 'none';
          cardElement.style.boxShadow = '0 0 10px #ff0000';
          cardElement.style.animation = 'fireGlow 1.5s ease-in-out infinite alternate';
        }
      }
    }

    const gingerCard = this.playArea.find(p => p.card.id === 'ginger' && p.playerId === 0);
    if (gingerCard) {
      setTimeout(() => {
        const lossMessage = document.createElement('div');
        lossMessage.className = 'win-message';
        lossMessage.style.bottom = '-80px'; 
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.style.backgroundImage = 'url(ginger.png)';
        
        const messageText = document.createElement('span');
        const responses = gingerCard.card.lossResponses[winners[0].card.id] || gingerCard.card.lossResponses.default;
        messageText.textContent = responses[Math.floor(Math.random() * responses.length)];
        
        lossMessage.appendChild(avatar);
        lossMessage.appendChild(messageText);
        document.getElementById('play-area').appendChild(lossMessage);
        
        setTimeout(() => lossMessage.remove(), 2000);
      }, 1000);
    }
  }
}