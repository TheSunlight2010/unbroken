// Card ability effects and transformations
export class CardEffects {
  static applyAbility(card, game, playArea) {
    if (card.id === 'cupiditas') {
      if (playArea.length > 0) {
        card.power += 2;
      }
    } else if (card.id === 'kite') {
      if (playArea.length > 0) {
        const lastCard = playArea[playArea.length - 1].card;
        if (lastCard.applyAbility && lastCard.id !== 'kite') {
          lastCard.applyAbility.call(card, game, playArea);
        }
      }
    } else if (card.id === 'prime') {
      card.immune = true;
    } else if (card.id === 'carlgpt') {
      if (game.players.length > 1) {
        const opponents = game.players.filter(p => p.isAI && p.deck.length > 0);
        if (opponents.length > 0) {
          const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
          const randomCard = randomOpponent.deck[Math.floor(Math.random() * randomOpponent.deck.length)];
          
          const revealText = document.createElement('div');
          revealText.className = 'reveal-text';
          revealText.textContent = `Revealed: ${randomCard.name} (Power: ${randomCard.power})`;
          document.getElementById('play-area').appendChild(revealText);
          setTimeout(() => revealText.remove(), 2000);
        }
      }
    } else if (card.id === 'worendy') {
      game.nextCardPenalty = 2;
    } else if (card.id === 'nova') {
      if (playArea.length > 0) {
        card.power += playArea.length;
      }
    } else if (card.id === 'echo') {
      if (playArea.length > 0) {
        const alliedCards = playArea.filter(p => p.playerId === game.currentPlayer && p.card.id !== 'echo');
        let resonanceApplied = false;
        alliedCards.forEach(played => {
          if (played.card.id !== 'echo') {
            played.card.power *= 2;
            played.card.resonanceBoosted = true; 
            resonanceApplied = true;
          }
        });
        
        if (resonanceApplied) {
          const effectMsg = document.createElement('div');
          effectMsg.className = 'win-message';
          effectMsg.innerHTML = `
            <div class="avatar" style="background-image: url(echo.png)"></div>
            <span>Resonance amplifies our power!</span>
          `;
          document.getElementById('play-area').appendChild(effectMsg);
          setTimeout(() => effectMsg.remove(), 2000);
        }
      }
    } else if (card.id === 'terra') {
      const index = playArea.findIndex(p => p.card.id === card.id);
      if (index > 0) {
        playArea[index - 1].card.protected = true;
      }
      if (index < playArea.length - 1) {
        playArea[index + 1].card.protected = true;
      }
    } else if (card.id === 'vesper') {
      if (!card.revealed) {
        card.power += 3;
        card.revealed = true;
      }
    } else if (card.id === 'aurora') {
      if (playArea.length > 0) {
        const highestPower = Math.max(...playArea.map(p => p.card.power));
        card.power = highestPower;
      }
    } else if (card.id === 'sally') {
      card.protected = true;
      card.power += 1; 
    } else if (card.id === 'penelope') {
      const friendshipCards = playArea.filter(p => 
        p.playerId === game.currentPlayer && p.card.id !== 'penelope');
      if (friendshipCards.length > 0) {
        friendshipCards.forEach(played => {
          played.card.power += 1;
          played.card.friendshipBoosted = true; 
        });
      }
    } else if (card.id === 'feathers') {
      const penelopePresent = playArea.some(p => p.card.id === 'penelope');
      if (penelopePresent) {
        card.power += 2;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(feathers.png)"></div>
          <span>Penelope dear, watch how strong mother can be!</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }

      const index = playArea.findIndex(p => p.card.id === card.id);
      if (index > 0) {
        playArea[index - 1].card.power += 1;
      }
      if (index < playArea.length - 1) {
        playArea[index + 1].card.power += 1;
      }
    } else if (card.id === 'chaos') {
      const maturityPresent = playArea.some(p => p.card.id === 'maturity');
      if (maturityPresent) {
        playArea.forEach(played => {
          if (played.card.powerReducedByMaturity) {
            played.card.power += playArea.length; 
            played.card.powerReducedByMaturity = false;
            
            const effectMsg = document.createElement('div');
            effectMsg.className = 'win-message';
            effectMsg.innerHTML = `
              <div class="avatar" style="background-image: url(chaos.png)"></div>
              <span>Balance must be maintained.</span>
            `;
            document.getElementById('play-area').appendChild(effectMsg);
            setTimeout(() => effectMsg.remove(), 2000);
          }
        });
      }
    } else if (card.id === 'maturity') {
      playArea.forEach(played => {
        if (played.card.id !== 'maturity' && !played.card.protected) {
          played.card.power = Math.max(1, played.card.power - playArea.length);
          played.card.powerReducedByMaturity = true; 
        }
      });
    } else if (card.id === 'high_kite') {
      playArea.forEach(played => {
        if (played.card.id !== 'high_kite' && !played.card.protected) {
          played.card.applyAbility = function() {}; 
        }
      });
    } else if (card.id === 'mr_bones') {
      const totalPlayed = game.players.reduce((sum, player) => {
        return sum + (9 - player.deck.length);
      }, 0);
      card.power += totalPlayed;
    } else if (card.id === 'null') {
      card.protected = true; 
    } else if (card.id === 'justice') {
      if (playArea.length > 0) {
        const weakestCard = playArea.reduce((weakest, current) => 
          current.card.power < weakest.card.power ? 
            current : weakest
        , playArea[0]);
        
        if (weakestCard.card.id !== 'justice') {
          weakestCard.card.power += 1;
          
          const revealText = document.createElement('div');
          revealText.className = 'reveal-text';
          revealText.textContent = `Justice empowers ${weakestCard.card.name}!`;
          document.getElementById('play-area').appendChild(revealText);
          setTimeout(() => revealText.remove(), 2000);
        }
      }
    } else if (card.id === 'kc') {
      const penelopeInPlay = playArea.some(p => p.card.id === 'penelope');
      const bonus = penelopeInPlay ? 2 : 1;
      
      playArea.forEach(played => {
        if (!played.card.protected) {
          played.card.power += bonus;
          const cardElement = document.querySelector(`[data-card-id="${played.card.id}"]`);
          if (cardElement) {
            cardElement.classList.add('friendship-bonus');
            setTimeout(() => cardElement.classList.remove('friendship-bonus'), 1000);
          }
        }
      });
    } else if (card.id === 'ginger') {
      const playerDeck = game.players[0].deck;
      
      playerDeck.forEach(card => {
        if (card.id !== 'ginger' && card.id !== 'reflection' && !card.enhanced) {
          card.power += 2;
          card.enhanced = true;
          const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
          if (cardElement) {
            cardElement.classList.remove('enhanced');
            cardElement.classList.add('ginger-enhanced');
          }
        }
      });

      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(ginger.png)"></div>
        <span>*loads gun with enhancing intent*</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    } else if (card.id === 'zero') {
      card.power = playArea.reduce((sum, played) => {
        return sum + (played.card.id !== 'zero' ? played.card.power : 0);
      }, 0);
    } else if (card.id === 'enraged_kite') {
      if (playArea.length > 0) {
        const highestCard = playArea.reduce((highest, current) => 
          current.card.power > highest.card.power ? 
            current : highest
        , playArea[0]);
        
        if (highestCard.card.id !== 'enraged_kite' && !highestCard.card.protected) {
          highestCard.card.power = Math.floor(highestCard.card.power / 2);
          
          const cardElement = document.querySelector(`[data-card-id="${highestCard.card.id}"]`);
          if (cardElement) {
            cardElement.classList.add('damaged');
            setTimeout(() => cardElement.classList.remove('damaged'), 2000);
          }
        }
      }
    } else if (card.id === 'purple_guy') {
      const opponents = game.players.filter(p => p.isAI && p.deck.length > 0);
      opponents.forEach(opponent => {
        if (opponent.deck.length > 0) {
          const strongestCard = opponent.deck.reduce((strongest, current) => 
            current.power > strongest.power ? current : strongest
          , opponent.deck[0]);
          
          if (!strongestCard.protected) {
            strongestCard.power = Math.max(1, strongestCard.power - 3);
            
            const revealText = document.createElement('div');
            revealText.className = 'reveal-text';
            revealText.textContent = `The Watcher weakens ${strongestCard.name}!`;
            document.getElementById('play-area').appendChild(revealText);
            setTimeout(() => revealText.remove(), 2000);
          }
        }
      });
    } else if (card.id === 'awareness') {
      card.power = 999999;
    } else if (card.id === 'salvo') {
      playArea.forEach(played => {
        if (played.card.id !== 'salvo' && !played.card.protected) {
          const reduction = Math.ceil(played.card.power / 2);
          played.card.power = Math.max(1, played.card.power - reduction);
          
          const cardElement = document.querySelector(`[data-card-id="${played.card.id}"]`);
          if (cardElement) {
            cardElement.classList.add('burning');
            setTimeout(() => cardElement.classList.remove('burning'), 1000);
          }
        }
      });
    } else if (card.id === 'highpoint') {
      game.nextAbilityBlocked = true;
      card.blockedCount++;
      card.power += card.blockedCount;
      
      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.style.background = 'linear-gradient(45deg, #00f, #ff0)';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(highpoint.png)"></div>
        <span>None shall pass my guard!</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    } else if (card.id === 'subject_192') {
      const friendlyCards = playArea.filter(p => 
        ['penelope', 'kc', 'feathers', 'subject_192'].includes(p.card.id)
      );
      card.power += friendlyCards.length;
      
      if (friendlyCards.length > 0) {
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(subject_192.png)"></div>
          <span>6̷2̷7̷u̷w̷u̷e̷h̷s̷u̷w̷i̷9̷</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    } else if (card.id === 'cyrus') {
      const subject192Present = playArea.some(p => p.card.id === 'subject_192');
      if (subject192Present) {
        card.power += 3;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(cyrus.png)"></div>
          <span>I'll protect you, friend.</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    } else if (card.id === 'reflection') {
      if (card.enhanced && card.power === 9) {
        const lyricsModal = document.createElement('div');
        lyricsModal.className = 'modal';
        lyricsModal.style.display = 'block';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.background = 'rgba(0,0,0,0.9)';
        modalContent.style.border = '2px solid #ff0000';
        modalContent.style.boxShadow = '0 0 20px #ff0000';
        
        lyricsModal.appendChild(modalContent);
        document.body.appendChild(lyricsModal);

        const lyrics = [
          "Cut them down to forge forever",
          "We'll ignite with lifelines severed", 
          "In potential lies, endless life awoken",
          "Damn them to their final verdict",
          "Give their life to the deserving",
          "Let their remnants cry...",
          "I remain... UNBROKEN!"
        ];

        let delay = 0;
        lyrics.forEach((line, index) => {
          setTimeout(() => {
            const lyricElem = document.createElement('div');
            lyricElem.className = 'reflection-lyrics';
            lyricElem.textContent = line;
            modalContent.appendChild(lyricElem);
            
            if (index === lyrics.length - 1) {
              setTimeout(() => {
                playArea.forEach(played => {
                  if (played.playerId !== game.currentPlayer) {
                    played.card.power = -5;
                    played.card.applyAbility = function() {};
                  }
                });
                
                lyricsModal.remove();
                
                const winMessageElem = document.createElement('div');
                winMessageElem.className = 'win-message enhanced';
                const avatar = document.createElement('div');
                avatar.className = 'avatar';
                avatar.style.backgroundImage = 'url(reflection.png)';
                avatar.style.animation = 'fireGlow 1.5s ease-in-out infinite alternate';
                winMessageElem.appendChild(avatar);
                const messageText = document.createElement('span');
                messageText.textContent = "I remain... UNBROKEN!";
                winMessageElem.appendChild(messageText);
                document.getElementById('play-area').appendChild(winMessageElem);
                
                setTimeout(() => {
                  game.resolveRound();
                }, 2000);
              }, 1000);
            }
          }, delay);
          delay += 2000; 
        });
      }
    } else if (card.id === 'moonlight') {
      const awarenessCard = RARE_CARDS.find(c => c.id === 'awareness');
      const index = playArea.findIndex(p => p.card.id === 'moonlight');
      if (index !== -1) {
        playArea[index].card = {...awarenessCard};
        
        const playAreaElem = document.getElementById('play-area');
        playAreaElem.style.animation = 'glitch 0.3s infinite';
        setTimeout(() => {
          playAreaElem.style.animation = '';
          game.renderGame();
        }, 1000);
      }
    } else if (card.id === 'fevaa') {
      let helpingEffects = 0;
      
      playArea.forEach(played => {
        if (played.card.id === 'echo' || 
            played.card.id === 'penelope' || 
            played.card.id === 'kc' ||
            played.card.id === 'feathers' ||
            played.card.id === 'terra') {
          helpingEffects++;
        }
      });
      
      if (helpingEffects > 0) {
        card.power += helpingEffects;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(fevaa.png)"></div>
          <span>Kindness is strength!</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    } else if (card.id === 'binx') {
      playArea.forEach(played => {
        if (played.card.id !== 'binx' && !played.card.protected) {
          if (Math.random() < 0.5) {
            played.card.power! = played.card.originalPower || played.card.power;
            played.card.applyAbility = function() {};
          } else {
            played.card.power *= 2;
          }
        }
      });
      
      const messages = [
        "That's what you get for not laughing!",
        "Divine punishment? More like divine comedy!",
        "Looks like someone can't take a joke!",
        "*inappropriate angel noises*"
      ];
      
      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(binx.png)"></div>
        <span>${messages[Math.floor(Math.random() * messages.length)]}</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    } else if (card.id === 'savior') {
      if (card.transformed) {
        // When transformed into Assassin, apply the assassin effect
        playArea.forEach(played => {
          if (played.card.id !== 'assassin') {
            played.card.power = -1;
          }
        });
      }
    } else if (card.id === 'assassin') {
      playArea.forEach(played => {
        if (played.card.id !== 'assassin') {
          played.card.power = -1;
        }
      });
    }
  }
}