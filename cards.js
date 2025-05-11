// Card definitions and collections
export const CARDS = [
  {
    id: 'cupiditas',
    name: 'Cupiditas',
    power: 7,
    ability: 'Shadow Strike: If played after an opponent\'s card, gains +2 power',
    image: 'cupiditas.png',
    applyAbility: function(game, playArea) {
      if (playArea.length > 0) {
        this.power += 2;
      }
    }
  },
  {
    id: 'kite',
    name: 'Kite',
    power: 6,
    ability: 'Trickster: Can copy the ability of the last played card',
    image: 'kite.png',
    applyAbility: function(game, playArea) {
      if (playArea.length > 0) {
        const lastCard = playArea[playArea.length - 1].card;
        if (lastCard.applyAbility && lastCard.id !== 'kite') {
          lastCard.applyAbility.call(this, game, playArea);
        }
      }
    }
  },
  {
    id: 'prime',
    name: 'Prime',
    power: 8,
    ability: 'Immortal: Cannot be destroyed by abilities, only by higher power',
    image: 'prime.png',
    applyAbility: function() {
      this.immune = true;
    }
  },
  {
    id: 'carlgpt',
    name: 'Carl-GPT',
    power: 5,
    ability: 'Analyze: Reveals one random card in opponent\'s hand',
    image: 'carlgpt.png',
    applyAbility: function(game) {
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
    }
  },
  {
    id: 'worendy',
    name: 'Worendy',
    power: 6,
    ability: 'Ink Curse: Reduces the power of the next played card by 2',
    image: 'worendy.png',
    applyAbility: function(game) {
      game.nextCardPenalty = 2;
    }
  },
  {
    id: 'nova',
    name: 'Nova',
    power: 7,
    ability: 'Stellar Burst: Gains +1 power for each other card in play',
    image: 'nova.png',
    applyAbility: function(game, playArea) {
      this.power += playArea.length;
    }
  },
  {
    id: 'echo',
    name: 'Echo',
    power: 4,
    ability: 'Resonance: Doubles the power of allied cards in play',
    image: 'echo.png',
    applyAbility: function(game, playArea) {
      if (playArea.length > 0) {
        const alliedCards = playArea.filter(p => p.playerId === game.currentPlayer && p.card.id !== 'echo');
        let resonanceApplied = false;
        alliedCards.forEach(played => {
          if (played.card.id !== 'echo') {
            played.card.power *= 2;
            played.card.resonanceBoosted = true; // Mark card as resonance boosted
            resonanceApplied = true;
          }
        });
        
        if (resonanceApplied) {
          // Visual feedback
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
    }
  },
  {
    id: 'terra',
    name: 'Terra',
    power: 6,
    ability: 'Nature\'s Shield: Protects adjacent cards from abilities',
    image: 'terra.png',
    applyAbility: function(game, playArea) {
      const index = playArea.findIndex(p => p.card.id === this.id);
      if (index > 0) {
        playArea[index - 1].card.protected = true;
      }
      if (index < playArea.length - 1) {
        playArea[index + 1].card.protected = true;
      }
    }
  },
  {
    id: 'vesper',
    name: 'Vesper',
    power: 5,
    ability: 'Night Veil: Can be played face-down, revealed next turn with +3 power',
    image: 'vesper.png',
    applyAbility: function() {
      if (!this.revealed) {
        this.power += 3;
        this.revealed = true;
      }
    }
  },
  {
    id: 'aurora',
    name: 'Aurora',
    power: 6,
    ability: 'Color Shift: Changes power to match the highest power card in play',
    image: 'aurora.png',
    applyAbility: function(game, playArea) {
      if (playArea.length > 0) {
        const highestPower = Math.max(...playArea.map(p => p.card.power));
        this.power = highestPower;
      }
    }
  },
  {
    id: 'sally',
    name: 'Sally',
    power: 5,
    ability: 'Self Defense: When another card would affect this card\'s power, it blocks the effect and gains +1 power instead',
    image: 'sally.png',
    applyAbility: function() {
      this.protected = true;
      this.power += 1; // Gains power when targeted
    }
  },
  {
    id: 'penelope',
    name: 'Penelope',
    power: 5,
    ability: 'Joyful Heart: Grants +1 power to all friendly cards in play',
    image: 'penelope.png',
    applyAbility: function(game, playArea) {
      const friendshipCards = playArea.filter(p => p.playerId === game.currentPlayer && p.card.id !== 'penelope');
      if (friendshipCards.length > 0) {
        friendshipCards.forEach(played => {
          played.card.power += 1;
          played.card.friendshipBoosted = true; // Mark card as friendship boosted
        });
      }
    }
  },
  {
    id: 'feathers',
    name: 'Feathers',
    power: 6,
    ability: 'Motherly Protection: Gets +2 power from Penelope\'s presence. Adjacent cards gain +1 power.',
    image: 'feathers.png',
    applyAbility: function(game, playArea) {
      // Check for Penelope's presence
      const penelopePresent = playArea.some(p => p.card.id === 'penelope');
      if (penelopePresent) {
        this.power += 2;
        
        // Visual feedback
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(feathers.png)"></div>
          <span>Penelope dear, watch how strong mother can be!</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }

      // Buff adjacent cards
      const index = playArea.findIndex(p => p.card.id === this.id);
      if (index > 0) {
        playArea[index - 1].card.power += 1;
      }
      if (index < playArea.length - 1) {
        playArea[index + 1].card.power += 1;
      }
    }
  },
  {
    id: 'chaos',
    name: 'Chaos',
    power: 7,
    ability: 'Balance: Negates power reductions from Maturity\'s ability',
    image: 'chaos.png',
    applyAbility: function(game, playArea) {
      // Find cards affected by Maturity
      const maturityPresent = playArea.some(p => p.card.id === 'maturity');
      if (maturityPresent) {
        playArea.forEach(played => {
          if (played.card.powerReducedByMaturity) {
            played.card.power += playArea.length; // Restore power
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
    }
  },
  {
    id: 'fester',
    name: 'Fester',
    power: 6,
    ability: 'Spark of Divinity: Gains +1 power for each enhanced card in play',
    image: 'fester.png',
    applyAbility: function(game, playArea) {
      const enhancedCount = playArea.filter(p => p.card.enhanced).length;
      if (enhancedCount > 0) {
        this.power += enhancedCount;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(fester.png)"></div>
          <span>Every light feeds my flame!</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  }
];

export const UNCOMMON_CARDS = [
  {
    id: 'maturity',
    name: 'Maturity',
    power: 9,
    ability: 'Immature Blast: Reduces all other cards\' power by 1 for each card in play',
    image: 'maturity.png',
    rarity: 'uncommon',
    applyAbility: function(game, playArea) {
      playArea.forEach(played => {
        if (played.card.id !== 'maturity' && !played.card.protected) {
          played.card.power = Math.max(1, played.card.power - playArea.length);
          played.card.powerReducedByMaturity = true;
        }
      });
    }
  },
  {
    id: 'high_kite',
    name: 'Kite',
    power: 10,
    ability: 'Serious Business: Nullifies all other card abilities in play',
    image: 'high_kite.png',
    rarity: 'uncommon',
    applyAbility: function(game, playArea) {
      playArea.forEach(played => {
        if (played.card.id !== 'high_kite' && !played.card.protected) {
          played.card.applyAbility = function() {}; // Nullify ability
        }
      });
    }
  },
  {
    id: 'mr_bones',
    name: 'Mr. Bones',
    power: 8,
    ability: 'Ancient Power: Gains +1 power for each card played this game',
    image: 'mr_bones.png',
    rarity: 'uncommon',
    applyAbility: function(game, playArea) {
      // Count all cards that have been played (deck size difference)
      const totalPlayed = game.players.reduce((sum, player) => {
        return sum + (9 - player.deck.length);
      }, 0);
      this.power += totalPlayed;
    }
  },
  {
    id: 'drew',
    name: 'Drew',
    power: 8,
    ability: 'Overconfident: Nullifies abilities of cards with power 7 or lower (because clearly they\'re beneath him)',
    image: 'drew.png',
    rarity: 'uncommon',
    applyAbility: function(game, playArea) {
      playArea.forEach(played => {
        if (played.card.power <= 7 && played.card.id !== 'drew' && !played.card.protected) {
          played.card.applyAbility = function() {};
          
          // Visual feedback
          const cardElement = document.querySelector(`[data-card-id="${played.card.id}"]`);
          if (cardElement) {
            cardElement.classList.add('nullified');
            setTimeout(() => cardElement.classList.remove('nullified'), 1000);
          }
        }
      });
      
      // Show effect message
      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(drew.png)"></div>
        <span>Ha! You call that an ability?</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  },
  {
    id: 'null',
    name: '███████',
    power: 12,
    ability: 'ERROR 404: This card cannot be enhanced or affected by abilities',
    image: 'null.png',
    rarity: 'uncommon',
    applyAbility: function() {
      this.protected = true; // Always protected from abilities
    }
  },
  {
    id: 'justice',
    name: 'Justice',
    power: 8,
    ability: 'Hero\'s Justice: Always enhanced. When played, gives +1 power to the weakest card in play',
    image: 'justice.png',
    enhanced: true, // Always enhanced
    applyAbility: function(game, playArea) {
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
    }
  },
  {
    id: 'moonlight',
    name: 'M̷̧̠̠͎̈́͋͗̕ò̴̼̟͊̄̀o̵͇̯̮̐͜n̷̹̳̏͋̕l̸͉̉̎̔ȉ̸̲͚̀̚g̶̘̣̀̈́h̷̨͍͎̹̏͒̎t̵͈͍̩̿',
    power: 0,
    ability: 'G̷̛͔̫͉̾L̶̺̎̈́̑I̶͕̎T̶͖̦̄͛͜C̷̝̫̈́H̷͕̾',
    rarity: 'uncommon',
    applyAbility: function(game, playArea) {
      // Replace self with Awareness
      const awarenessCard = RARE_CARDS.find(c => c.id === 'awareness');
      const index = playArea.findIndex(p => p.card.id === 'moonlight');
      if (index !== -1) {
        playArea[index].card = {...awarenessCard};
        
        // Visual glitch effect
        const playAreaElem = document.getElementById('play-area');
        playAreaElem.style.animation = 'glitch 0.3s infinite';
        setTimeout(() => {
          playAreaElem.style.animation = '';
          game.renderGame();
        }, 1000);
      }
    }
  },
  {
    id: 'kc',
    name: 'KC',
    power: 6,
    ability: 'Friendship Power: When played, all cards in play gain +1 power. If Penelope is in play, they gain +2 instead',
    image: 'kc.png',
    rarity: 'uncommon',
    applyAbility: function(game, playArea) {
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
    }
  },
  {
    id: 'ginger',
    name: 'Ginger',
    power: 7,
    ability: 'Lock and Load: Enhances all remaining cards in your hand with a special green glow',
    image: 'ginger.png',
    rarity: 'uncommon',
    lossResponses: {
      'default': ["Ugh, shut up.", "Whatever.", "Yeah yeah, keep talking..."],
      'terra': ["*sigh* Not even gonna respond to that...", "Those cat puns are getting old.", "Real professional there, furball."],
      'penelope': ["...I can't be mad at that.", "Okay fine, you win this time.", "At least you're having fun."],
      'enraged_kite': ["Anger issues much?", "Deep breaths, buddy.", "Someone needs therapy."],
      'sally': ["Don't get cocky.", "Lucky shot.", "Show off."],
      'justice': ["Heroes this, heroes that...", "Not everyone needs to be a hero.", "Less talking, more training."],
      'null': ["Error this.", "...creep.", "Stop glitching already."],
      'kite': ["I hate that stupid smile.", "Stop copying everyone!", "Just be yourself for once!"],
      'feathers': ["Stop nagging me about safety...", "Yes, I'll be more careful, sheesh.", "I don't need another mom..."],
      'highpoint': ["I... I'll just leave now.", "*backs away slowly*", "Please don't hurt me..."]
    },
    applyAbility: function(game) {
      // Find player's remaining cards
      const playerDeck = game.players[0].deck;
      
      playerDeck.forEach(card => {
        if (card.id !== 'ginger' && card.id !== 'reflection' && !card.enhanced) {
          card.power += 2;
          card.enhanced = true;
          // Find and update the card element
          const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
          if (cardElement) {
            cardElement.classList.remove('enhanced');
            cardElement.classList.add('ginger-enhanced');
          }
        }
      });

      // Show effect message
      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(ginger.png)"></div>
        <span>*loads gun with enhancing intent*</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  }
];

export const RARE_CARDS = [
  {
    id: 'zero',
    name: 'Zero',
    power: 0,
    ability: 'Power Absorption: Gains power equal to all other cards in play',
    image: 'zero.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      this.power = playArea.reduce((sum, played) => {
        return sum + (played.card.id !== 'zero' ? played.card.power : 0);
      }, 0);
    }
  },
  {
    id: 'enraged_kite',
    name: 'Kite',
    power: 8,
    ability: 'Rampage: Reduces the highest power card\'s power by half',
    image: 'enraged_kite.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
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
    }
  },
  {
    id: 'purple_guy',
    name: 'The Watcher',
    power: 13,
    ability: 'Gaze of Judgment: Can see into your opponent\'s hand, reducing their strongest card\'s power by 3',
    image: 'purple_guy.png',
    rarity: 'rare',
    applyAbility: function(game) {
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
    }
  },
  {
    id: 'awareness',
    name: 'Awareness',
    power: 999999,
    ability: 'Omniscience: This card is always enhanced and has infinite power',
    image: 'awareness.png',
    rarity: 'rare',
    enhanced: true,
    applyAbility: function() {
      this.power = 999999;
    }
  },
  {
    id: 'salvo',
    name: 'Salvo',
    power: 9,
    ability: 'Inferno: Burns away half of all other cards\' power (rounded up)',
    image: 'salvo.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
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
    }
  },
  {
    id: 'highpoint',
    name: 'Feathers',
    power: 8,
    ability: 'Protective Strike: Blocks the next card\'s ability and gains +1 power for each blocked ability',
    image: 'highpoint.png',
    rarity: 'rare',
    blockedCount: 0,
    applyAbility: function(game) {
      game.nextAbilityBlocked = true;
      this.blockedCount++;
      this.power += this.blockedCount;
      
      // Visual feedback with gradient background
      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.style.background = 'linear-gradient(45deg, #00f, #ff0)';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(highpoint.png)"></div>
        <span>None shall harm what I protect!</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  },
  {
    id: 'subject_192',
    name: 'Subject 192',
    power: 8,
    ability: 'First Creation: Always enhanced. Friendly but deadly, gains +1 power for each friendly card in play.',
    image: 'subject_192.png',
    enhanced: true,
    applyAbility: function(game, playArea) {
      const friendlyCards = playArea.filter(p => 
        ['penelope', 'kc', 'feathers', 'subject_192'].includes(p.card.id)
      );
      this.power += friendlyCards.length;
      
      // Visual feedback
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
    }
  },
  {
    id: 'cyrus',
    name: 'Cyrus',
    power: 10,
    ability: 'Guardian Shot: Gains +3 power when Subject 192 is in play',
    image: 'cyrus.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      const subject192Present = playArea.some(p => p.card.id === 'subject_192');
      if (subject192Present) {
        this.power += 3;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(cyrus.png)"></div>
          <span>I'll protect you, friend.</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    power: 7,
    ability: 'Confident Confusion: When played, randomly copies another card\'s power or sets power to 1',
    image: 'cocoa.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      if (playArea.length > 0) {
        if (Math.random() < 0.5) {
          const randomCard = playArea[Math.floor(Math.random() * playArea.length)];
          this.power = randomCard.card.power;
          
          const effectMsg = document.createElement('div');
          effectMsg.className = 'win-message';
          effectMsg.innerHTML = `
            <div class="avatar" style="background-image: url(cocoa.png)"></div>
            <span>Oh! I think I get it now!</span>
          `;
          document.getElementById('play-area').appendChild(effectMsg);
        } else {
          this.power = 1;
          const effectMsg = document.createElement('div');
          effectMsg.className = 'win-message';
          effectMsg.innerHTML = `
            <div class="avatar" style="background-image: url(cocoa.png)"></div>
            <span>Wait... that's not what I meant to do...</span>
          `;
          document.getElementById('play-area').appendChild(effectMsg);
        }
        setTimeout(() => document.querySelector('.win-message')?.remove(), 2000);
      }
    }
  }
];

export const SPECIAL_CASES = [
  {
    id: 'reflection',
    name: 'Reflection',
    power: 1,
    ability: 'Use this card last.',
    image: 'reflection.png',
    rarity: 'special',
    powerGainedFromLosses: 0,
    deactivated: false,
    applyAbility: function(game, playArea) {
      // If enhanced from being last card
      if (this.enhanced && this.power === 9) {
        // Create modal for lyrics
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

        // Use exact lyrics that were previously defined
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
              // After last line finishes
              setTimeout(() => {
                // Set all opponent cards to -5 power and nullify abilities
                playArea.forEach(played => {
                  if (played.playerId !== game.currentPlayer) {
                    played.card.power = -5;
                    played.card.applyAbility = function() {};
                  }
                });
                
                // Set scores
                game.scores = new Array(game.scores.length).fill(0);
                game.scores[0] = 9;
                
                // Clean up modal
                lyricsModal.remove();
                
                // Create winning message only after lyrics finished
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
                
                // Force round end after showing win message
                setTimeout(() => {
                  game.resolveRound();
                }, 2000);
              }, 1000);
            }
          }, delay);
          delay += 2000; // Each line appears 2 seconds after the previous
        });
      }
    }
  },
  {
    id: 'moonlight',
    name: 'M̷̧̠̠͎̈́͋͗̕ò̴̼̟͊̄̀o̵͇̯̮̐͜n̷̹̳̏͋̕l̸͉̉̎̔ȉ̸̲͚̀̚g̶̘̣̀̈́h̷̨͍͎̹̏͒̎t̵͈͍̩̿',
    power: 0,
    ability: 'G̷̛͔̫͉̾L̶̺̎̈́̑I̶͕̎T̶͖̦̄͛͜C̷̝̫̈́H̷͕̾',
    rarity: 'special',
    applyAbility: function(game, playArea) {
      // Replace self with Awareness
      const awarenessCard = RARE_CARDS.find(c => c.id === 'awareness');
      const index = playArea.findIndex(p => p.card.id === 'moonlight');
      if (index !== -1) {
        playArea[index].card = {...awarenessCard};
        
        // Visual glitch effect
        const playAreaElem = document.getElementById('play-area');
        playAreaElem.style.animation = 'glitch 0.3s infinite';
        setTimeout(() => {
          playAreaElem.style.animation = '';
          game.renderGame();
        }, 1000);
      }
    }
  },
  {
    id: 'doppel',
    name: 'Doppel',
    power: 1,
    ability: 'Mirror Entity: After everyone plays, transforms into any card (except Moonlight, Reflection, and NULL)',
    image: 'doppel.png',
    rarity: 'special',
    applyAbility: function(game, playArea) {
      const allCards = [...CARDS, ...UNCOMMON_CARDS, ...RARE_CARDS, ...SPECIAL_CASES]
        .filter(card => !['moonlight', 'reflection', 'null'].includes(card.id));
      
      const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
      const index = playArea.findIndex(p => p.card.id === 'doppel');
      
      if (index !== -1) {
        // Visual effects for transformation
        const transformMsg = document.createElement('div');
        transformMsg.className = 'win-message';
        transformMsg.innerHTML = `
          <div class="avatar" style="background-image: url(doppel.png)"></div>
          <span>Transforming into ${randomCard.name}...</span>
        `;
        document.getElementById('play-area').appendChild(transformMsg);
        
        // Visual glitch effect on play area
        const playAreaElem = document.getElementById('play-area');
        playAreaElem.style.animation = 'glitch 0.3s infinite';
        
        // Replace self with random card after animation
        setTimeout(() => {
          playArea[index].card = {...randomCard};
          playAreaElem.style.animation = '';
          transformMsg.remove();
          game.renderGame();
        }, 1000);
      }
    }
  },
  {
    id: 'ginger',
    name: 'Ginger',
    power: 7,
    ability: 'Lock and Load: Enhances all remaining cards in your hand with a special green glow',
    image: 'ginger.png',
    rarity: 'special',
    lossResponses: {
      'default': ["Ugh, shut up.", "Whatever.", "Yeah yeah, keep talking..."],
      'terra': ["*sigh* Not even gonna respond to that...", "Those cat puns are getting old.", "Real professional there, furball."],
      'penelope': ["...I can't be mad at that.", "Okay fine, you win this time.", "At least you're having fun."],
      'enraged_kite': ["Anger issues much?", "Deep breaths, buddy.", "Someone needs therapy."],
      'sally': ["Don't get cocky.", "Lucky shot.", "Show off."],
      'justice': ["Heroes this, heroes that...", "Not everyone needs to be a hero.", "Less talking, more training."],
      'null': ["Error this.", "...creep.", "Stop glitching already."],
      'kite': ["I hate that stupid smile.", "Stop copying everyone!", "Just be yourself for once!"],
      'feathers': ["Stop nagging me about safety...", "Yes, I'll be more careful, sheesh.", "I don't need another mom..."],
      'highpoint': ["I... I'll just leave now.", "*backs away slowly*", "Please don't hurt me..."]
    },
    applyAbility: function(game) {
      // Find player's remaining cards
      const playerDeck = game.players[0].deck;
      
      playerDeck.forEach(card => {
        if (card.id !== 'ginger' && card.id !== 'reflection' && !card.enhanced) {
          card.power += 2;
          card.enhanced = true;
          // Find and update the card element
          const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
          if (cardElement) {
            cardElement.classList.remove('enhanced');
            cardElement.classList.add('ginger-enhanced');
          }
        }
      });

      // Show effect message
      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(ginger.png)"></div>
        <span>*loads gun with enhancing intent*</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  },
  {
    id: 'savior',
    name: 'Savior',
    power: 5,
    ability: 'Second Chance: If you lose with this card, it will transform...',
    image: 'savior.png',
    rarity: 'special',
    transformed: false,
    applyAbility: function(game, playArea) {
      if (this.transformed) {
        // When! transformed into Assassin, apply the assassin effect
        playArea.forEach(played => {
          if (played.card.id !== 'savior') {
            played.card.power = -1;
          }
        });
      }
    }
  },
  {
    id: 'assassin',
    name: 'A̷s̷s̷a̷s̷s̷i̷n̷',
    power: 13,
    ability: 'Target Eliminated: Sets all other cards\' power to -1',
    image: 'assassin.png',
    rarity: 'special',
    applyAbility: function(game, playArea) {  
      playArea.forEach(played => {
        if (played.card.id !== 'assassin') {
          played.card.power = -1;
        }
      });
    }
  },
  {
    id: 'fevaa',
    name: 'Fevaa',
    power: 8,
    ability: 'Demonic Kindness: Gains +1 power for each active effect that helps other cards',
    image: 'fevaa.png',
    rarity: 'special',
    applyAbility: function(game, playArea) {
      let helpingEffects = 0;
      
      // Count helping effects from cards in play
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
        this.power += helpingEffects;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(fevaa.png)"></div>
          <span>Kindness is strength!</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'binx',
    name: 'Binx',
    power: 7,
    ability: 'Divine Comedy: Has a 50% chance to nullify or double each active effect',
    image: 'binx.png',
    rarity: 'special',
    applyAbility: function(game, playArea) {
      playArea.forEach(played => {
        if (played.card.id !== 'binx' && !played.card.protected) {
          if (Math.random() < 0.5) {
            // Nullify
            played.card.power = played.card.originalPower || played.card.power;
            played.card.applyAbility = function() {};
          } else {
            // Double
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
    }
  },
  {
    id: 'egg',
    name: 'egg',
    power: 1, 
    ability: 'it is an egg',
    image: 'egg.png',
    rarity: 'special',
    applyAbility: function() {
      // Egg does nothing. It's just an egg.
    }
  },
  {
    id: 'knight',
    name: 'The Knight',
    power: 7,
    ability: 'Lost Honor: Power increases by 3 if Moonlight or NULL appear in play, due to their corrupted connection',
    image: 'knight.png',
    rarity: 'special',
    applyAbility: function(game, playArea) {
      const corruptedPresent = playArea.some(p => 
        p.card.id === 'moonlight' || p.card.id === 'null'
      );
      
      if (corruptedPresent) {
        this.power += 3;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(knight.png)"></div>
          <span>My lady... what have they done to you?</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  }
];