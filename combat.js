// Combat resolution system
export class Combat {
  static async resolveRound(game) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find highest power level
    const highestPower = Math.max(...game.playArea.map(p => p.card.power));
    
    // Find all winners (cards with highest power)
    const winners = game.playArea.filter(p => p.card.power === highestPower);

    // Check for Savior transformation BEFORE awarding points
    const playerLost = winners.every(w => w.playerId !== 0);
    if (playerLost) {
      const saviorCard = game.playArea.find(p => p.playerId === 0 && p.card.id === 'savior');
      if (saviorCard && !saviorCard.card.transformed) {
        saviorCard.card.transformed = true;
        const assassinCard = SPECIAL_CASES.find(c => c.id === 'assassin');
        
        // Visual effects for transformation
        const transformMsg = document.createElement('div');
        transformMsg.className = 'win-message';
        transformMsg.innerHTML = `
          <div class="avatar" style="background-image: url(savior.png)"></div>
          <span>T̷a̷r̷g̷e̷t̷s̷ ̷a̷c̷q̷u̷i̷r̷e̷d̷.̷.̷.̷</span>
        `;
        document.getElementById('play-area').appendChild(transformMsg);
        
        // Visual glitch effect on play area
        const playAreaElem = document.getElementById('play-area');
        playAreaElem.style.animation = 'glitch 0.3s infinite';
        
        // Replace savior with assassin after animation
        setTimeout(() => {
          Object.assign(saviorCard.card, assassinCard);
          playAreaElem.style.animation = '';
          transformMsg.remove();
          game.renderGame();
          
          // Set all other cards' power to -1
          game.playArea.forEach(played => {
            if (played.card.id !== 'assassin') {
              played.card.power = -1;
            }
          });
          
          // Recalculate winners after transformation
          const newHighestPower = Math.max(...game.playArea.map(p => p.card.power));
          winners.length = 0; // Clear winners array
          game.playArea.filter(p => p.card.power === newHighestPower)
            .forEach(w => winners.push(w));
        }, 1000);
        
        // Give time for the transformation animation
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Award points to all winners
    winners.forEach(winner => {
      game.scores[winner.playerId]++;
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
            game.playArea = [];
            game.roundInProgress = false;
            game.currentPlayer = 0;

            if (game.players.every(player => player.deck.length === 0)) {
              game.endGame();
            }

            game.renderGame();
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
        game.playArea = [];
        game.roundInProgress = false;
        game.currentPlayer = 0;

        if (game.players.every(player => player.deck.length === 0)) {
          game.endGame();
        }

        game.renderGame();
      }, 2000);
    }

    // If player has Reflection, always increase its power
    const reflectionCard = game.players[0].deck.find(card => card.id === 'reflection');
    if (reflectionCard && !reflectionCard.enhanced) {
      reflectionCard.power++;
      reflectionCard.powerGainedFromLosses++;
      
      // If it's the last card, enhance it
      if (game.players[0].deck.length === 1) {
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

    // Show Ginger's loss responses
    if (winners[0].playerId !== 0) {
      const gingerCard = game.playArea.find(p => p.card.id === 'ginger' && p.playerId === 0);
      if (gingerCard) {
        setTimeout(() => {
          const lossMessage = document.createElement('div');
          lossMessage.className = 'win-message';
          lossMessage.style.bottom = '-80px'; // Position below winner message
          
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
}