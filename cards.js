// Card definitions and collections
export const CARDS = [
  {
    id: 'cupiditas',
    name: 'Cupiditas',
    power: 7,
    ability: 'Gains +2 power after played.',
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
    ability: 'Copies last card played\'s ability.',
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
    ability: 'Unaffected by MOST abilities',
    image: 'prime.png',
    applyAbility: function() {
      this.immune = true;
    }
  },
  {
    id: 'carlgpt',
    name: 'Carl-GPT',
    power: 5,
    ability: 'No useful ability.',
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
    ability: 'Removes -2 from the card you play next.',
    image: 'worendy.png',
    applyAbility: function(game) {
      game.nextCardPenalty = 2;
    }
  },
  {
    id: 'nova',
    name: 'Nova',
    power: 7,
    ability: 'Gains +1 power for each other card in play',
    image: 'nova.png',
    applyAbility: function(game, playArea) {
      this.power += playArea.length;
    }
  },
  {
    id: 'echo',
    name: 'Echo',
    power: 4,
    ability: 'Doubles the power of harmless cards in play, with exceptions',
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
    ability: 'Protects adjacent cards from abilities',
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
    ability: '+3 power unless nullified',
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
    ability: 'Changes power to match the highest power card in play',
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
    ability: 'Blocks abilities used on card, gives +1 instead',
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
    ability: 'Grants +1 power to all friendly cards in play, with exceptions',
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
    ability: 'Gets +2 power from Penelope\'s presence. Adjacent cards gain +1 power.',
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
    ability: 'Negates power reductions from Maturity\'s ability',
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
    ability: 'Gains +1 power for each enhanced card in play',
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
  },
  {
    id: 'yelpo',
    name: 'Yelpo',
    power: 6,
    ability: 'Powers up by +1 for each time your last played card had its power or ability modified',
    image: 'yelpo.png',
    memoriesErased: 0,
    applyAbility: function(game, playArea) {
      if (playArea.length > 0) {
        const lastCard = playArea[playArea.length - 1];
        if (lastCard.card.powerModified || lastCard.card.abilityModified) {
          this.power += 1;
          this.memoriesErased++;
          
          if (this.memoriesErased >= 3) {
            const effectMsg = document.createElement('div');
            effectMsg.className = 'win-message';
            effectMsg.innerHTML = `
              <div class="avatar" style="background-image: url(yelpo.png)"></div>
              <span>Why... why do I keep forgetting?</span>
            `;
            document.getElementById('play-area').appendChild(effectMsg);
            setTimeout(() => effectMsg.remove(), 2000);
          }
        }
      }
    }
  }
];

export const UNCOMMON_CARDS = [
  {
    id: 'maturity',
    name: 'Maturity',
    power: 9,
    ability: 'Reduces all other cards\' power by 1 for each card in play',
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
    ability: 'Nullifies all other card abilities in play',
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
    ability: 'Gains +1 power for each card played this game',
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
    ability: 'Nullifies abilities of cards with power 7 or lower',
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
    ability: 'Always enhanced. When played, gives +1 power to the weakest card in play',
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
    ability: 'G̷̛͔̫͉̾L̶̺̎̈́̑I̶͕̎T̶͖̦̄͛͜C̷̝̫̈́C̷̝̫̈́H̷͕̾',
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
    ability: 'When played, all cards in play gain +1 power. If Penelope is in play, they gain +2 instead',
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
    id: 'blueberry',
    name: 'Blueberry',
    power: 7,
    ability: 'If Kite is in play, copies their ability and gains +2 power',
    image: 'blueberry.png',
    rarity: 'uncommon',
    applyAbility: function(game, playArea) {
      const kitePresent = playArea.some(p => ['kite', 'high_kite', 'enraged_kite'].includes(p.card.id));
      if (kitePresent) {
        this.power += 2;
        const kiteCard = playArea.find(p => ['kite', 'high_kite', 'enraged_kite'].includes(p.card.id));
        if (kiteCard && kiteCard.card.applyAbility) {
          kiteCard.card.applyAbility.call(this, game, playArea);
          
          const effectMsg = document.createElement('div');
          effectMsg.className = 'win-message';
          effectMsg.innerHTML = `
            <div class="avatar" style="background-image: url(blueberry.png)"></div>
            <span>Two tricksters are better than one!</span>
          `;
          document.getElementById('play-area').appendChild(effectMsg);
          setTimeout(() => effectMsg.remove(), 2000);
        }
      }
    }
  },
  {
    id: 'ginger',
    name: 'Ginger',
    power: 7,
    ability: 'Enhances all remaining cards in your hand with a special green glow. This will only effect your cards, regardless of who plays it.',
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
    ability: 'Gains power equal to all other cards in play',
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
    ability: 'Reduces the highest power card\'s power by half',
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
    ability: 'No useful ability.',
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
    ability: 'This card is always enhanced and has infinite power',
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
    ability: 'Burns away half of all other cards\' power',
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
    ability: 'Blocks the next card\'s ability and gains +1 power for each blocked ability',
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
    id: 'seven',
    name: 'Seven',
    power: 7, // Will be randomized when played
    ability: 'Power becomes random (4-14). Enhanced if power > 10',
    image: 'seven.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      const jackpot = Math.random() < 0.01;
      if (jackpot) {
        this.power = 70;
        this.enhanced = true;
      } else {
        this.power = Math.floor(Math.random() * 11) + 4; // 4-14
        this.enhanced = this.power > 10;
      }
      
      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(seven.png)"></div>
        <span>${jackpot ? "JACKPOT!" : this.enhanced ? "The odds are in my favor..." : "Let's see what fate deals..."}</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  },
  {
    id: 'subject_192',
    name: 'Subject 192',
    power: 8,
    ability: 'Always enhanced. Friendly but deadly, gains +1 power for each friendly card in play, with two exceptions.',
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
    power: 8,
    ability: 'Protected from ability effects. Becomes enhanced and gains +3 power when Subject 192 is in play.',
    image: 'cyrus.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      this.protected = true; // Always protected from abilities
      const subject192Present = playArea.some(p => p.card.id === 'subject_192');
      
      if (subject192Present) {
        this.power += 3;
        this.enhanced = true;
        
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
    ability: 'When played, randomly copies another card\'s power or sets power to 1',
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
  },
  {
    id: 'ember',
    name: 'Ember',
    power: 8,
    ability: 'Gains +1 power for each fire-elemental card in play. Power doubles if more than 1 are present.',
    image: 'ember.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      const fireCards = playArea.filter(p => 
        ['fester', 'salvo', 'ember'].includes(p.card.id)
      ).length;
      
      const hasBothFire = playArea.some(p => p.card.id === 'fester') && 
                         playArea.some(p => p.card.id === 'salvo');
      
      if (fireCards > 1) {
        const bonus = hasBothFire ? fireCards * 2 : fireCards;
        this.power += bonus;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(ember.png)"></div>
          <span>The flames of Elementia burn bright!</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'aqua',
    name: 'Aqua',
    power: 7,
    ability: 'Reduces all fire-elemental cards\' power by 2. If multiple fire cards are present, reduces by 3 instead.',
    image: 'aqua.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      const fireCards = playArea.filter(p => 
        ['fester', 'salvo', 'ember'].includes(p.card.id)
      );
      
      if (fireCards.length > 0) {
        const reduction = fireCards.length > 1 ? 3 : 2;
        fireCards.forEach(played => {
          if (!played.card.protected) {
            played.card.power = Math.max(1, played.card.power - reduction);
            
            const cardElement = document.querySelector(`[data-card-id="${played.card.id}"]`);
            if (cardElement) {
              cardElement.classList.add('doused');
              setTimeout(() => cardElement.classList.remove('doused'), 1000);
            }
          }
        });
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(aqua.png)"></div>
          <span>The waves of Elementia douse all flames!</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'fester',
    name: 'Fester',
    power: 6,
    ability: 'Gains +1 power for each enhanced card in play',
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
  },
  {
    id: 'vicki',
    name: 'Vicki',
    power: 7,
    ability: 'Gains +1 power for each friend in play. (Subject 192, Cyrus, Fossil)',
    image: 'vicki.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      const friends = playArea.filter(p => 
        ['subject_192', 'cyrus', 'fossil'].includes(p.card.id)
      ).length;
      
      if (friends > 0) {
        this.power += friends;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(vicki.png)"></div>
          <span>The Sanctuary Squad sticks together!</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'fossil',
    name: 'Fossil',
    power: 8,
    ability: 'Protected from abilities. Becomes enhanced when Subject 192 is in play.',
    image: 'fossil.png',
    rarity: 'rare',
    applyAbility: function(game, playArea) {
      this.protected = true;
      const subject192Present = playArea.some(p => p.card.id === 'subject_192');
      
      if (subject192Present) {
        this.power += 2;
        this.enhanced = true;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(fossil.png)"></div>
          <span>Even angels can find friendship in darkness.</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
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
    ability: 'G̷̛͔̫͉̾L̶̺̎̈́̑I̶͕̎T̶͖̦̄͛͜C̷̝̫̈́C̷̝̫̈́H̷͕̾',
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
    ability: 'After everyone plays, transforms into any card (except for three)',
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
    ability: 'Enhances all remaining cards in your hand with a special green glow. This will only effect your cards, regardless of who plays it.',
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
    ability: 'Don\'t worry about losing.',
    image: 'savior.png',
    rarity: 'special',
    transformed: false,
    applyAbility: function(game, playArea) {
      if (this.transformed) {
        // When transformed into Assassin, apply the assassin effect
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
    ability: 'Sets all other cards\' power to -1',
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
    ability: 'Gains +1 power for each active effect that helps other cards',
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
    ability: 'Power increases by 3 if _________ or NULL appear in play',
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
  },
  {
    id: 'allie',
    name: 'Allie',
    power: 8,
    ability: 'Randomly changes appearance each game. When played after Worendy, copies the ink curse effect and gains +2 power.',
    image: 'allie.png', // Will be set dynamically
    rarity: 'special',
    variants: {
      normal: {chance: 0.63, image: 'allie.png'},
      faceless: {chance: 0.20, image: 'allie_faceless.png'},
      crude: {chance: 0.15, image: 'allie_crudeface.png'},
      laughing: {chance: 0.02, image: 'allie_laugh.png'}
    },
    // Add selectVariant method
    selectVariant() {
      const roll = Math.random();
      let cumulative = 0;
      
      for (const [variant, data] of Object.entries(this.variants)) {
        cumulative += data.chance;
        if (roll < cumulative) {
          this.image = data.image;
          this.variant = variant;
          break;
        }
      }
    },
    applyAbility: function(game, playArea) {
      const worendyPlayed = playArea.some(p => p.card.id === 'worendy');
      if (worendyPlayed) {
        game.nextCardPenalty = 2;
        this.power += 2;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(${this.image})"></div>
          <span>Hehehe... ink curse goes brrr...</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'eclipse_blueberry',
    name: 'Eclipse',
    power: 7, // Blueberry's base power
    ability: 'Powers doubled when Sunlight is watching. Able to imitate Kite\'s abilities.',
    image: 'blueberry_as_eclipse.png',
    rarity: 'special',
    applyAbility: function(game, playArea) {
      // Double power for Eclipse's dramatic performance
      this.power *= 2;
      
      // Can also copy Kite's ability if in play
      const kitePresent = playArea.some(p => ['kite', 'high_kite', 'enraged_kite'].includes(p.card.id));
      if (kitePresent) {
        const kiteCard = playArea.find(p => ['kite', 'high_kite', 'enraged_kite'].includes(p.card.id));
        if (kiteCard && kiteCard.card.applyAbility) {
          kiteCard.card.applyAbility.call(this, game, playArea);
        }
      }

      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(blueberry_as_eclipse.png)"></div>
        <span>*whispers* How am I doing? Is he buying it?</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  },
  {
    id: 'eclipse_penelope',
    name: 'Eclipse',
    power: 5, // Penelope's base power
    ability: 'Grants +2 power to all friendly cards. Sunlight believes in her performance.',
    image: 'penelope_as_eclipse.png',
    rarity: 'special',
    applyAbility: function(game, playArea) {
      const friendshipCards = playArea.filter(p => p.playerId === game.currentPlayer && p.card.id !== 'eclipse_penelope');
      if (friendshipCards.length > 0) {
        friendshipCards.forEach(played => {
          played.card.power += 2;
          played.card.friendshipBoosted = true;
        });
      }

      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(penelope_as_eclipse.png)"></div>
        <span>Don't worry Mr. Sunlight, everything will be okay!</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  },
  {
    id: 'eclipse_maturity',
    name: 'Eclipse',
    power: 9, // Maturity's base power
    ability: 'Reduces power of enemy cards by 2. Takes her role very seriously.',
    image: 'maturity_as_eclipse.png',
    rarity: 'special',
    applyAbility: function(game, playArea) {
      playArea.forEach(played => {
        if (played.playerId !== game.currentPlayer && !played.card.protected) {
          played.card.power = Math.max(1, played.card.power - 2);
        }
      });

      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(maturity_as_eclipse.png)"></div>
        <span>*ahem* Yes, dear. I am definitely Eclipse.</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  },
  {
    id: 'ringmaster',
    name: 'Ringmaster',
    power: 7,
    ability: 'DOUBLES THE POWER OF THE STRONGEST CARD IN PLAY! QUITE THE SHOW, YES?',
    image: 'ringmaster.png',
    rarity: 'special',
    spawnChance: 0.05, // 5% spawn rate
    applyAbility: function(game, playArea) {
      const strongestCard = playArea.reduce((strongest, current) => 
        current.card.power > strongest.card.power ? current : strongest
      , playArea[0]);
      
      strongestCard.card.power *= 2;
      
      const effectMsg = document.createElement('div');
      effectMsg.className = 'win-message';
      effectMsg.innerHTML = `
        <div class="avatar" style="background-image: url(ringmaster.png)"></div>
        <span>LADIES AND GENTLEMEN! BEHOLD!</span>
      `;
      document.getElementById('play-area').appendChild(effectMsg);
      setTimeout(() => effectMsg.remove(), 2000);
    }
  },
  {
    id: 'sole',
    name: 'Sole',
    power: 8,
    ability: 'The darker it gets, the brighter we shine. Gains +2 power for each defeated card.',
    image: 'sole.png',
    rarity: 'special',
    spawnChance: 0.03, // 3% spawn rate
    applyAbility: function(game, playArea) {
      const defeatedCards = playArea.filter(p => p.card.power <= 0).length;
      this.power += (defeatedCards * 2);
    }
  },
  {
    id: 'blitz',
    name: 'Blitz',
    power: 9,
    ability: 'Corrupted angel abilities affect all cards except parents',
    image: 'blitz.png',
    rarity: 'special',
    spawnChance: 0.02, // 2% spawn rate
    applyAbility: function(game, playArea) {
      playArea.forEach(played => {
        if (played.card.id !== 'fevaa' && played.card.id !== 'binx' && !played.card.protected) {
          played.card.power = Math.max(1, played.card.power - 2);
        }
      });
    }
  },
  {
    id: 'hitbox',
    name: 'Hitbox',
    power: 11,
    ability: 'Power drops to 1 against Binx, Kite, Maturity, or fire-elementals',
    image: 'hitbox.png',
    rarity: 'special',
    spawnChance: 0.04, // 4% spawn rate
    applyAbility: function(game, playArea) {
      const hasWeakness = playArea.some(p => 
        ['binx', 'kite', 'maturity', 'ember', 'fester', 'salvo'].includes(p.card.id)
      );
      if (hasWeakness) {
        this.power = 1;
      }
    }
  },
  {
    id: 'goldie',
    name: 'Goldie',
    power: 7,
    ability: 'No useful ability, but quite wealthy!',
    image: 'goldie.png',
    rarity: 'special',
    spawnChance: 0.10, // 10% spawn rate
    applyAbility: function() {
      // Goldie has no ability, just wealth
    }
  },
  {
    id: 'leopold',
    name: 'Leopold',
    power: 6,
    ability: 'Reduces power of cards that boost others, despite being nice.',
    image: 'leopold.png',
    rarity: 'special',
    spawnChance: 0.06, // 6% spawn rate
    applyAbility: function(game, playArea) {
      playArea.forEach(played => {
        if (['penelope', 'kc', 'echo', 'feathers', 'fevaa'].includes(played.card.id) && !played.card.protected) {
          played.card.power = Math.max(1, played.card.power - 2);
        }
      });
    }
  },
  {
    id: 'lavender',
    name: '████████',
    power: 8,
    ability: '████ plant elemental ████ Hollowgreen ████',
    image: 'lavender.png',
    rarity: 'special',
    spawnChance: 0.01, // 1% spawn rate
    applyAbility: function(game, playArea) {
      const plantCards = playArea.filter(p => 
        ['blossom', 'herb', 'ciph', 'soiley', 'evergreen', 'terra'].includes(p.card.id)
      ).length;
      
      this.power += plantCards * 2;
    }
  },
  {
    id: 'frost',
    name: 'Frost',
    power: 6,
    ability: 'Power doubles when losing the round',
    image: 'frost.png',
    rarity: 'special',
    spawnChance: 0.07, // 7% spawn rate
    applyAbility: function(game, playArea) {
      const isLosing = Math.max(...playArea.map(p => p.card.power)) > this.power;
      if (isLosing) {
        this.power *= 2;
      }
    }
  },
  {
    id: 'sunex',
    name: 'SuNex',
    power: 12,
    ability: 'Always enhanced. Power becomes equal to the strongest card in play, plus 3.',
    image: 'sunex.png',
    rarity: 'special',
    enhanced: true,
    spawnChance: 0.0095, // 0.95% spawn chance
    applyAbility: function(game, playArea) {
      if (playArea.length > 0) {
        const highestPower = Math.max(...playArea.map(p => p.card.power));
        this.power = highestPower + 3;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(sunex.png)"></div>
          <span>Even weakened, I remain divine.</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'sunlight',
    name: 'The Sunlight',
    power: 99999999999,
    ability: 'Power level is "SUN". Cannot be copied. Causes Moonlight to immediately transform if in same deck.',
    image: 'sunlight-card.png',
    enhanced: true,
    rarity: 'special',
    powerDisplay: 'SUN',
    spawnChance: () => {
      return Math.random() < 0.1 ? 0.06 : 0.001;
    },
    applyAbility: function(game, playArea) {
      const auroraCard = playArea.find(p => p.card.id === 'aurora');
      if (auroraCard) {
        auroraCard.card.power = 0;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(sunlight-card.png)"></div>
          <span>My light cannot be imitated.</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  }
];

export const HOLLOWGREEN_CARDS = [
  {
    id: 'blossom',
    name: 'Blossom',
    power: 4,
    shield: 3,
    ability: 'Shield increases by 1 for each plant-elemental card in play',
    image: 'blossom.png',
    rarity: 'hollowgreen',
    applyAbility: function(game, playArea) {
      const plantCards = playArea.filter(p => 
        ['blossom', 'herb', 'ciph', 'soiley', 'evergreen', 'terra', 'feathers'].includes(p.card.id)
      ).length;
      
      this.shield = 3 + plantCards;
      
      if (plantCards > 0) {
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(blossom.png)"></div>
          <span>The garden watches silently...</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'herb',
    name: 'Herb',
    power: 5,
    shield: 2,
    ability: 'Shield doubles when other Hollowgreen anomalies are present',
    image: 'herb.png',
    rarity: 'hollowgreen',
    applyAbility: function(game, playArea) {
      const hollowgreenCount = playArea.filter(p => 
        ['blossom', 'herb', 'ciph', 'soiley', 'evergreen'].includes(p.card.id)
      ).length;
      
      if (hollowgreenCount > 1) {
        this.shield *= 2;
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(herb.png)"></div>
          <span>Let death nurture life...</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'ciph',
    name: 'Ciph',
    power: 3,
    shield: 2,
    ability: 'Don\'t wake the baby.',
    image: 'ciph_asleep.png',
    rarity: 'hollowgreen',
    transformed: false,
    applyAbility: function(game, playArea) {
      const isLastCard = playArea.length === game.players.length;
      if (isLastCard && !this.transformed) {
        this.transformed = true;
        this.power = 8;
        this.shield = 5;
        this.image = 'ciph_awake.png';
        
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(ciph_awake.png)"></div>
          <span>F o o l s . . . Y o u ' v e  w o k e n  m e .</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'soiley',
    name: 'Soiley',
    power: 4,
    shield: 4,
    ability: 'Shield increases by 2 for each other Hollowgreen anomaly',
    image: 'soiley.png',
    rarity: 'hollowgreen',
    applyAbility: function(game, playArea) {
      const hollowgreenCount = playArea.filter(p => 
        ['blossom', 'herb', 'ciph', 'soiley', 'evergreen'].includes(p.card.id) && p.card.id !== 'soiley'
      ).length;
      
      this.shield = 4 + (hollowgreenCount * 2);
      
      if (hollowgreenCount > 0) {
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(soiley.png)"></div>
          <span>We grow together in the deep...</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  },
  {
    id: 'evergreen',
    name: 'Evergreen',
    power: 6,
    shield: 1,
    ability: 'Gains +1 shield for each card it has more power than',
    image: 'evergreen.png',
    rarity: 'hollowgreen',
    applyAbility: function(game, playArea) {
      const dominatedCards = playArea.filter(p => 
        this.power > p.card.power
      ).length;
      
      this.shield = 1 + dominatedCards;
      
      if (dominatedCards > 0) {
        const effectMsg = document.createElement('div');
        effectMsg.className = 'win-message';
        effectMsg.innerHTML = `
          <div class="avatar" style="background-image: url(evergreen.png)"></div>
          <span>The garden grows... and consumes...</span>
        `;
        document.getElementById('play-area').appendChild(effectMsg);
        setTimeout(() => effectMsg.remove(), 2000);
      }
    }
  }
];

export function createCardElement(card) {
  const element = document.createElement('div');
  element.className = `card ${card.enhanced ? 'enhanced' : ''} ${card.id === 'null' ? 'glitch' : ''}`;
  element.dataset.cardId = card.id;

  // Add shield display for Hollowgreen cards
  if (card.shield !== undefined) {
    const powerDisplay = card.power + (card.shield || 0);
    element.innerHTML = `
      <div class="character" style="background: url(${card.image}) no-repeat center/cover"></div>
      <div class="info">
        <div class="name">${card.name}${card.enhanced ? ' [Enhanced]' : ''}</div>
        <div class="ability">${card.ability}</div>
      </div>
      <div class="power">${powerDisplay}</div>
      <div class="shield-indicator">🛡️${card.shield}</div>
    `;
  } else if (card.id === 'sunlight') {
    element.innerHTML = `
      <div class="character" style="background: url(${card.image}) no-repeat center/cover"></div>
      <div class="info">
        <div class="name">${card.name}</div>
        <div class="ability">${card.ability}</div>
      </div>
      <div class="power">${card.powerDisplay}</div>
    `;
  } else {
    // Original card display logic
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

export function generateNormalDeckContent(isPlayerDeck, currentDeck = []) {
  let deck = [...currentDeck].filter(card => card && card.id); // Remove any undefined cards

  // Convert any undefined entries to NULL card
  const nullCard = UNCOMMON_CARDS.find(c => c.id === 'null');
  deck = deck.map(card => {
    if (!card || !card.id) {
      return {...nullCard};
    }
    return card;
  });

  while (deck.length < 9) {
    const rarity = Math.random();
    let cardPool;
    
    if (isPlayerDeck && rarity < 0.15) { // 15% chance for Hollowgreen
      cardPool = HOLLOWGREEN_CARDS;
    } else if (rarity < 0.20) {
      cardPool = RARE_CARDS;
    } else if (rarity < 0.30) {
      cardPool = UNCOMMON_CARDS;
    } else {
      cardPool = CARDS;
    }
    
    if (!cardPool || cardPool.length === 0) continue;

    const cardTemplate = cardPool[Math.floor(Math.random() * cardPool.length)];
    if (deck.some(c => c.id === cardTemplate.id)) continue;

    const isEnhanced = cardTemplate.id !== 'null' && cardTemplate.id !== 'awareness' && !cardTemplate.enhanced && Math.random() < 0.05;
    deck.push({
      ...cardTemplate,
      power: isEnhanced ? cardTemplate.power + 2 : cardTemplate.power,
      enhanced: isEnhanced || cardTemplate.enhanced,
      shield: cardTemplate.shield // Preserve shield value if it exists
    });
  }
  
  // Final validation - replace any undefined with NULL
  return deck.map(card => {
    if (!card || !card.id) {
      return {...nullCard};
    }
    return card;
  }).slice(0, 9);
}