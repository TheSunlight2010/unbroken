import { characters, abilities } from './characters.js';
import { battleSystem } from './battle.js';
import { loreData } from './lore.js';

class Game {
    constructor() {
        this.credits = 0;
        this.unlockedCharacters = ['cupiditas', 'kite', 'subject_192'];
        this.currentCharacter = null;
        this.currentOpponent = null;
        this.battle = null;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.soundLevel = 50; // Add sound level property
        
        this.init();
    }

    init() {
        this.loadSaveData();
        this.updateUI();
        this.setupSoundLevelControl();
    }

    setupSoundLevelControl() {
        const soundLevelInput = document.getElementById('sound-level');
        const soundLevelValue = document.getElementById('sound-level-value');
        const soundLevelContainer = document.querySelector('.sound-level-control');
        
        // Check if Task1 is complete - if so, hide the sound level control
        if (this.isTask1Complete()) {
            if (soundLevelContainer) {
                soundLevelContainer.style.display = 'none';
            }
            return;
        }
        
        // Set initial value
        soundLevelValue.textContent = this.soundLevel;
    }

    loadSaveData() {
        const saved = localStorage.getItem('unbroken_save');
        if (saved) {
            const data = JSON.parse(saved);
            this.credits = data.credits || 0;
            this.unlockedCharacters = data.unlocked || ['cupiditas', 'kite', 'subject_192'];
            this.soundLevel = data.soundLevel || 50; // Load sound level
            
            // Hide sound level control if Task1 is complete
            if (data.Task1) {
                const soundLevelContainer = document.querySelector('.sound-level-control');
                if (soundLevelContainer) {
                    soundLevelContainer.style.display = 'none';
                }
            }
        }
    }

    saveData() {
        localStorage.setItem('unbroken_save', JSON.stringify({
            credits: this.credits,
            unlocked: this.unlockedCharacters,
            soundLevel: this.soundLevel
        }));
        this.updateUI(); // Update credits display immediately after saving
    }

    playMusic(track) {
        const audio = document.getElementById('battle-music');
        audio.src = track;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }

    determineBattleMusic() {
        const player = this.currentCharacter;
        const opponent = this.currentOpponent;
        
        // Special cases first
        if (opponent === 'awareness' && player === 'knight') {
            return 'Spare Them The Rod.mp3';
        }
        if (player === 'navia' && opponent === 'ginger' || player === 'ginger' && opponent === 'navia') {
            return 'Reset.mp3';
        }
        if (opponent === 'reflection' || player === 'reflection') {
            return 'A Reflection Of Mistakes.mp3';
        }
        if (opponent === 'awareness') {
            return 'Moonshine.mp3';
        }
        if (player === 'mona' && opponent === 'kite' || player === 'kite' && opponent === 'mona') {
            return 'House Arrest.mp3';
        }
        
        // Check for trio
        const trio = ['cyrus', 'subject_192', 'vicki'];
        if (trio.includes(player) && trio.includes(opponent)) {
            return 'Can You Feel It_.mp3';
        }
        
        // Check power level match
        if (characters[player].power === characters[opponent].power) {
            return 'Anticipation (High).mp3';
        }
        
        // Default battle music
        return 'Battle.mp3';
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showCharacterSelect() {
        const grid = document.getElementById('character-grid');
        grid.innerHTML = '';
        
        this.unlockedCharacters.forEach(charId => {
            const char = characters[charId];
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <img src="${char.image}" alt="${char.name}">
                <h3>${char.name}</h3>
                <p>Power: ${char.power}</p>
                <p>${char.description}</p>
            `;
            card.onclick = () => this.selectCharacter(charId);
            grid.appendChild(card);
        });
        
        this.showScreen('character-select');
    }

    selectCharacter(charId) {
        // Check for Easter egg: Sound level 64 and trying to play as Mona
        if (charId === 'mona' && this.soundLevel === 64 && !this.isTask1Complete()) {
            window.location.href = 'tuesday.html';
            return;
        }
        
        this.currentCharacter = charId;
        this.startBattle();
    }

    // Helper method to check if Task1 is complete
    isTask1Complete() {
        const saved = localStorage.getItem('unbroken_save');
        if (saved) {
            const data = JSON.parse(saved);
            return data.Task1 === true;
        }
        return false;
    }

    showShop() {
        const grid = document.getElementById('shop-grid');
        grid.innerHTML = '';
        
        Object.keys(characters).forEach(charId => {
            const char = characters[charId];
            const isUnlocked = this.unlockedCharacters.includes(charId);
            const isAwareness = charId === 'awareness';
            
            if (!isUnlocked && !isAwareness) {
                const item = document.createElement('div');
                item.className = 'shop-item';
                item.innerHTML = `
                    <img src="${char.image}" alt="${char.name}">
                    <h3>${char.name}</h3>
                    <p>Power: ${char.power}</p>
                    <p>Cost: ${char.cost} Credits</p>
                `;
                
                if (this.credits >= char.cost) {
                    item.onclick = () => this.purchaseCharacter(charId);
                } else {
                    item.classList.add('locked');
                }
                
                grid.appendChild(item);
            }
        });
        
        this.showScreen('shop');
    }

    purchaseCharacter(charId) {
        const char = characters[charId];
        if (this.credits >= char.cost && !this.unlockedCharacters.includes(charId)) {
            this.credits -= char.cost;
            this.unlockedCharacters.push(charId);
            this.saveData(); // This will also update the UI
            this.showShop();
        }
    }

    startBattle() {
        const availableOpponents = Object.keys(characters).filter(id => id !== 'awareness');
        let canFightAwareness = Math.random() < 0.05;
        
        // Increase Awareness encounter chance when playing as The Knight
        if (this.currentCharacter === 'knight') {
            canFightAwareness = Math.random() < 0.25; // 25% chance instead of 5%
        }
        
        let opponentPool = canFightAwareness ? [...availableOpponents, 'awareness'] : [...availableOpponents];
        
        // Special case: If player is Mona or Kite and Mona is unlocked, make the other more common
        const isMonaUnlocked = this.unlockedCharacters.includes('mona');
        if (isMonaUnlocked) {
            if (this.currentCharacter === 'mona') {
                // Remove one instance of Kite if present and add two more
                opponentPool = opponentPool.filter(id => id !== 'kite');
                opponentPool.push('kite', 'kite');
            } else if (this.currentCharacter === 'kite') {
                // Remove one instance of Mona if present and add two more
                opponentPool = opponentPool.filter(id => id !== 'mona');
                opponentPool.push('mona', 'mona');
            }
        }
        
        // Special case: If player is Ginger, make Navia more common
        if (this.currentCharacter === 'ginger') {
            // Add multiple Navia instances to increase encounter rate
            opponentPool.push('navia', 'navia', 'navia');
        }
        
        // Make Ginger extremely common when playing as Navia
        if (this.currentCharacter === 'navia') {
            // Add many Ginger instances to make her appear way more often
            opponentPool.push('ginger', 'ginger', 'ginger', 'ginger', 'ginger', 'ginger', 'ginger', 'ginger', 'ginger', 'ginger');
        }
        
        const randomOpponent = opponentPool[Math.floor(Math.random() * opponentPool.length)];
        
        this.currentOpponent = randomOpponent;
        this.battle = new battleSystem.Battle(this.currentCharacter, this.currentOpponent);
        
        const musicTrack = this.determineBattleMusic();
        this.playMusic(musicTrack);
        
        this.showBattleScreen();
    }

    showBattleScreen() {
        // Reset battle mode to fight at the start of each battle
        this.setBattleMode('fight');
        // Reset mercy meter to 0 at the start of each battle
        if (this.battle) {
            this.battle.mercyMeter = 0;
            this.battle.actCooldowns = [0, 0, 0, 0]; // Reset ACT cooldowns too
            
            // Special matchups: Kite vs Mona and Ginger vs Navia
            const playerChar = characters[this.currentCharacter];
            const opponentChar = characters[this.currentOpponent];
            
            // Kite vs Mona - Kite's mercy meter starts at 100% but can't spare
            if (this.currentCharacter === 'kite' && this.currentOpponent === 'mona') {
                this.battle.mercyMeter = 100;
                this.battle.kiteVsMona = true;
            }
            // Mona vs Kite - Mona's mercy meter caps at 75%
            else if (this.currentCharacter === 'mona' && this.currentOpponent === 'kite') {
                this.battle.mercyMeter = 0;
                this.battle.monaVsKite = true;
            }
            // Ginger vs Navia - Ginger's mercy meter starts at 100% but can't spare
            else if (this.currentCharacter === 'ginger' && this.currentOpponent === 'navia') {
                this.battle.mercyMeter = 100;
                this.battle.gingerVsNavia = true;
            }
            // Navia vs Ginger - Navia's mercy meter caps at 75%
            else if (this.currentCharacter === 'navia' && this.currentOpponent === 'ginger') {
                this.battle.mercyMeter = 0;
                this.battle.naviaVsGinger = true;
            }
        }
        
        this.updateBattleUI();
        this.showScreen('battle');
    }

    setBattleMode(mode) {
        this.battle.battleMode = mode;
        
        // Update button states
        document.getElementById('fight-mode').classList.toggle('active', mode === 'fight');
        document.getElementById('act-mode').classList.toggle('active', mode === 'act');
        
        // Show/hide ability grids
        document.getElementById('fight-abilities').style.display = mode === 'fight' ? 'flex' : 'none';
        document.getElementById('act-abilities').style.display = mode === 'act' ? 'flex' : 'none';
        
        this.updateBattleUI();
    }

    updateBattleUI() {
        const playerChar = characters[this.currentCharacter];
        const oppChar = characters[this.currentOpponent];
        
        // Handle special sprites
        let playerSprite = playerChar.image;
        let opponentSprite = oppChar.image;
        
        if ((this.currentCharacter === 'mona' && this.currentOpponent === 'kite') || 
            (this.currentCharacter === 'kite' && this.currentOpponent === 'mona')) {
            if (this.currentCharacter === 'mona') playerSprite = '/mona_housearrest.png';
            else if (this.currentCharacter === 'kite') playerSprite = '/kite_housearrest.png';
            if (this.currentOpponent === 'mona') opponentSprite = '/mona_housearrest.png';
            else if (this.currentOpponent === 'kite') opponentSprite = '/kite_housearrest.png';
        }
        
        document.getElementById('player-name').textContent = playerChar.name;
        document.getElementById('player-power').textContent = playerChar.power;
        document.getElementById('player-sprite').src = playerSprite;
        document.getElementById('player-health').style.width = `${this.battle.playerHealth}%`;
        
        document.getElementById('opponent-name').textContent = oppChar.name;
        // Enraged mode for Reflection
        const oppPower = (oppChar.name === 'Reflection' && this.battle && this.battle.opponentHealth <= 30) ? 25 : oppChar.power;
        document.getElementById('opponent-power').textContent = oppPower;
        document.getElementById('opponent-sprite').src = opponentSprite;
        document.getElementById('opponent-health').style.width = `${this.battle.opponentHealth}%`;
        
        // Update mercy meter
        if (this.battle.mercyMeter > 0) {
            const mercyContainer = document.querySelector('.mercy-meter') || this.createMercyMeter();
            let displayMercy = this.battle.mercyMeter;
            
            // Apply special display caps
            if (this.battle.monaVsKite && displayMercy > 75) {
                displayMercy = 75;
            } else if (this.battle.naviaVsGinger && displayMercy > 75) {
                displayMercy = 75;
            }
            
            document.querySelector('.mercy-fill').style.width = `${displayMercy}%`;
            
            // Update mercy text for special matchups
            const mercyText = document.querySelector('.mercy-text');
            if (this.battle.monaVsKite || this.battle.naviaVsGinger) {
                mercyText.textContent = `MERCY (${displayMercy}/75)`;
            } else if (this.battle.kiteVsMona || this.battle.gingerVsNavia) {
                mercyText.textContent = `MERCY (SPARE LOCKED)`;
            } else {
                mercyText.textContent = 'MERCY';
            }
        } else {
            // Hide mercy meter if it's at 0
            const mercyContainer = document.querySelector('.mercy-meter');
            if (mercyContainer) {
                mercyContainer.remove();
            }
        }
        
        // Update abilities based on mode
        if (this.battle.battleMode === 'fight') {
            // Update FIGHT abilities
            const playerAbilities = abilities[this.currentCharacter];
            for (let i = 0; i < 4; i++) {
                const btn = document.getElementById(`ability-${i}`);
                if (i === 0) {
                    btn.textContent = 'Attack';
                    btn.disabled = false;
                } else {
                    const ability = playerAbilities[i - 1];
                    btn.textContent = ability.name;
                    btn.disabled = this.battle.abilityCooldowns[i - 1] > 0;
                }
            }
            // Enable FIGHT and ACT mode buttons
            document.getElementById('fight-mode').disabled = false;
            document.getElementById('act-mode').disabled = false;
        } else {
            // Update ACT abilities
            const actAbilities = this.getActAbilities();
            for (let i = 0; i < 4; i++) {
                const btn = document.getElementById(`act-${i}`);
                const ability = actAbilities[i];
                btn.textContent = ability.name;
                
                // Disable ACT buttons for special matchups
                if (this.battle.kiteVsMona || this.battle.gingerVsNavia) {
                    btn.disabled = true;
                } else {
                    btn.disabled = this.battle.actCooldowns[i] > 0;
                }
            }
            
            // Update spare button
            const spareBtn = document.getElementById('act-spare');
            let canSpare = this.battle.mercyMeter >= 100;
            
            // Disable spare for special matchups
            if (this.battle.monaVsKite || this.battle.naviaVsGinger || this.battle.kiteVsMona || this.battle.gingerVsNavia) {
                canSpare = false;
            }
            
            spareBtn.disabled = !canSpare;
            
            // Enable FIGHT and ACT mode buttons
            document.getElementById('fight-mode').disabled = false;
            document.getElementById('act-mode').disabled = false;
        }
    }

    createMercyMeter() {
        const meter = document.createElement('div');
        meter.className = 'mercy-meter';
        meter.innerHTML = `
            <div class="mercy-text">MERCY</div>
            <div class="mercy-fill" style="width: 0%"></div>
        `;
        document.querySelector('.battle-arena').appendChild(meter);
        return meter;
    }

    getActAbilities() {
        const playerChar = characters[this.currentCharacter];
        const opponentChar = characters[this.currentOpponent];
        const baseActs = {
            cupiditas: [
                { name: "Flirt", mercy: 15, description: "Show interest in Cupiditas" },
                { name: "Challenge", mercy: 10, description: "Challenge their desires" },
                { name: "Ignore", mercy: 20, description: "Deny them attention" },
                { name: "Empathize", mercy: 25, description: "Understand their longing" }
            ],
            kite: [
                { name: "Teach", mercy: 20, description: "Share knowledge with Kite" },
                { name: "Mimic", mercy: 15, description: "Copy Kite's movements" },
                { name: "Challenge", mercy: 10, description: "Test their adaptability" },
                { name: "Befriend", mercy: 25, description: "Offer genuine friendship" }
            ],
            subject_192: [
                { name: "Connect", mercy: 25, description: "Reach out socially" },
                { name: "Listen", mercy: 20, description: "Hear their story" },
                { name: "Accept", mercy: 15, description: "Accept their darkness" },
                { name: "Include", mercy: 30, description: "Make them feel welcome" }
            ],
            penelope: [
                { name: "Smile", mercy: 30, description: "Share joy with Penelope" },
                { name: "Play", mercy: 25, description: "Engage in playfulness" },
                { name: "Comfort", mercy: 20, description: "Offer comfort" },
                { name: "Hope", mercy: 35, description: "Share hope together" }
            ],
            terra: [
                { name: "Ground", mercy: 20, description: "Connect with earth" },
                { name: "Respect", mercy: 25, description: "Show respect for nature" },
                { name: "Harmonize", mercy: 15, description: "Find natural harmony" },
                { name: "Protect", mercy: 30, description: "Protect the earth" }
            ],
            kc: [
                { name: "Pet", mercy: 35, description: "Offer gentle pets" },
                { name: "Play", mercy: 25, description: "Play like a cat" },
                { name: "Nap", mercy: 20, description: "Rest together" },
                { name: "Protect", mercy: 30, description: "Protect like KC would" }
            ],
            mona: [
                { name: "Stargaze", mercy: 25, description: "Share her love of stars" },
                { name: "Listen", mercy: 20, description: "Hear her cosmic tales" },
                { name: "Free", mercy: 30, description: "Offer freedom from prison" },
                { name: "Understand", mercy: 15, description: "Understand her loneliness" }
            ],
            cyrus: [
                { name: "Trust", mercy: 20, description: "Trust in Cyrus's aim" },
                { name: "Respect", mercy: 25, description: "Respect their protection" },
                { name: "Follow", mercy: 15, description: "Follow their lead" },
                { name: "Thank", mercy: 30, description: "Thank them for guarding" }
            ],
            maturity: [
                { name: "Accept", mercy: 15, description: "Accept their chaos" },
                { name: "Order", mercy: 20, description: "Bring order to chaos" },
                { name: "Understand", mercy: 25, description: "Understand their nature" },
                { name: "Balance", mercy: 30, description: "Find balance with chaos" }
            ],
            vicki: [
                { name: "Hope", mercy: 30, description: "Share hope of returning home" },
                { name: "Trust", mercy: 25, description: "Trust in alien technology" },
                { name: "Connect", mercy: 20, description: "Connect across species" },
                { name: "Support", mercy: 35, description: "Support her mission" }
            ],
            ginger: [
                { name: "Respect", mercy: 25, description: "Respect Ginger's skill" },
                { name: "Learn", mercy: 20, description: "Learn from their precision" },
                { name: "Trust", mercy: 30, description: "Trust their judgment" },
                { name: "Admire", mercy: 35, description: "Admire their mastery" }
            ],
            blitz: [
                { name: "Forgive", mercy: 30, description: "Offer forgiveness" },
                { name: "Accept", mercy: 25, description: "Accept their fall" },
                { name: "Redeem", mercy: 35, description: "Offer redemption" },
                { name: "Understand", mercy: 20, description: "Understand their pain" }
            ],
            navia: [
                { name: "Trust", mercy: 20, description: "Trust despite virus nature" },
                { name: "Accept", mercy: 25, description: "Accept her parasitic form" },
                { name: "Connect", mercy: 30, description: "Connect beyond the virus" },
                { name: "Free", mercy: 35, description: "Offer freedom from infection" }
            ],
            knight: [
                { name: "Honor", mercy: 30, description: "Honor their noble purpose" },
                { name: "Support", mercy: 25, description: "Support their quest" },
                { name: "Respect", mercy: 35, description: "Respect their honor" },
                { name: "Remember", mercy: 20, description: "Remember Moonlight with them" }
            ],
            seven: [
                { name: "Trust", mercy: 25, description: "Trust in luck" },
                { name: "Gamble", mercy: 20, description: "Take a chance together" },
                { name: "Accept", mercy: 30, description: "Accept randomness" },
                { name: "Hope", mercy: 35, description: "Hope for good fortune" }
            ],
            prime: [
                { name: "Worship", mercy: 20, description: "Show proper reverence" },
                { name: "Accept", mercy: 25, description: "Accept divine will" },
                { name: "Understand", mercy: 30, description: "Understand eternity" },
                { name: "Serve", mercy: 35, description: "Serve the goddess" }
            ],
            reflection: [
                { name: "Accept", mercy: 15, description: "Accept their weakness" },
                { name: "Encourage", mercy: 25, description: "Encourage their strength" },
                { name: "Believe", mercy: 30, description: "Believe in their power" },
                { name: "Hope", mercy: 35, description: "Hope for their success" }
            ],
            awareness: [
                { name: "Understand", mercy: 20, description: "Try to understand Awareness" },
                { name: "Accept", mercy: 25, description: "Accept the unknown" },
                { name: "Question", mercy: 15, description: "Question what you know" },
                { name: "Know", mercy: 30, description: "Seek true knowledge" }
            ]
        };

        // Special matchup ACT abilities
        const specialMatchups = {
            'The Knight': {
                'Awareness': [
                    { name: "Remember", mercy: 40, description: "Remember Moonlight together" },
                    { name: "Mourn", mercy: 35, description: "Mourn what was lost" },
                    { name: "Forgive", mercy: 45, description: "Offer forgiveness" },
                    { name: "Hope", mercy: 30, description: "Hope for reunion" }
                ]
            },
            'Mona': {
                'Kite': [
                    { name: "Trust", mercy: 35, description: "Trust your former pursuer" },
                    { name: "Forgive", mercy: 40, description: "Forgive past conflicts" },
                    { name: "Understand", mercy: 30, description: "Understand both perspectives" },
                    { name: "Free", mercy: 45, description: "Offer mutual freedom" }
                ]
            },
            'Ginger': {
                'Navia': [
                    { name: "Apologize", mercy: 40, description: "Apologize for destroying her console" },
                    { name: "Understand", mercy: 35, description: "Understand her digital prison" },
                    { name: "Free", mercy: 45, description: "Offer freedom from the virus" },
                    { name: "Trust", mercy: 30, description: "Trust despite the past" }
                ]
            },
            'Navia': {
                'Ginger': [
                    { name: "Forgive", mercy: 40, description: "Forgive the console destruction" },
                    { name: "Understand", mercy: 35, description: "Understand his escape" },
                    { name: "Accept", mercy: 45, description: "Accept the past" },
                    { name: "Trust", mercy: 30, description: "Trust in new beginnings" }
                ]
            },
            'Kite': {
                'Mona': [
                    { name: "Remember", mercy: 40, description: "Remember their past encounters" },
                    { name: "Forgive", mercy: 35, description: "Forgive past conflicts" },
                    { name: "Understand", mercy: 30, description: "Understand both perspectives" },
                    { name: "Free", mercy: 45, description: "Offer mutual freedom" }
                ]
            },
            'Mona': {
                'Kite': [
                    { name: "Trust", mercy: 35, description: "Trust your former pursuer" },
                    { name: "Forgive", mercy: 40, description: "Forgive past conflicts" },
                    { name: "Understand", mercy: 30, description: "Understand both perspectives" },
                    { name: "Free", mercy: 45, description: "Offer mutual freedom" }
                ]
            }
        };

        // Check for special matchups
        const currentMatchup = specialMatchups[playerChar.name];
        if (currentMatchup) {
            const opponentMatchup = currentMatchup[opponentChar.name];
            if (opponentMatchup) {
                return opponentMatchup;
            }
        }

        return baseActs[this.currentCharacter] || baseActs['cupiditas'];
    }

    useActAbility(abilityIndex) {
        if (!this.battle || this.battle.gameOver) return;
        
        // Check for special matchups where ACT is disabled
        if (this.battle.kiteVsMona || this.battle.gingerVsNavia) {
            this.addToBattleLog("You cannot use ACT in this special matchup!");
            return;
        }
        
        const actAbilities = this.getActAbilities();
        const ability = actAbilities[abilityIndex];
        
        if (this.battle.actCooldowns[abilityIndex] > 0) {
            this.addToBattleLog(`${ability.name} is on cooldown!`);
            return;
        }
        
        // Increase mercy meter with special caps
        let mercyGain = ability.mercy + Math.floor(Math.random() * 10) - 5; // Random variation
        let actualGain = Math.max(5, Math.min(50, mercyGain)); // Clamp between 5-50
        
        // Apply special mercy caps
        if (this.battle.monaVsKite && this.battle.mercyMeter >= 75) {
            this.addToBattleLog("Mercy meter cannot exceed 75% against Kite!");
            actualGain = 0;
        } else if (this.battle.naviaVsGinger && this.battle.mercyMeter >= 75) {
            this.addToBattleLog("Mercy meter cannot exceed 75% against Ginger!");
            actualGain = 0;
        }
        
        this.battle.mercyMeter = Math.min(100, this.battle.mercyMeter + actualGain);
        
        // Apply special caps after increase
        if (this.battle.monaVsKite && this.battle.mercyMeter > 75) {
            this.battle.mercyMeter = 75;
        } else if (this.battle.naviaVsGinger && this.battle.mercyMeter > 75) {
            this.battle.mercyMeter = 75;
        }
        
        // Set cooldown
        this.battle.actCooldowns[abilityIndex] = 2;
        
        // Add message
        const playerName = characters[this.currentCharacter].name;
        const opponentName = characters[this.currentOpponent].name;
        
        this.addToBattleLog(`${playerName} ${ability.description.toLowerCase()} (${actualGain}% mercy)`);
        
        // Update UI
        this.updateBattleUI();
        
        // AI turn after ACT
        setTimeout(() => {
            const aiResult = this.battle.performAITurn();
            this.updateBattleUI();
            this.addToBattleLog(aiResult.message);
            
            if (aiResult.gameOver) {
                this.endBattle(aiResult);
            } else {
                // Update cooldowns after AI turn
                this.updateActCooldowns();
                this.updateBattleUI();
            }
        }, 1500);
    }

    updateActCooldowns() {
        if (!this.battle) return;
        
        for (let i = 0; i < this.battle.actCooldowns.length; i++) {
            if (this.battle.actCooldowns[i] > 0) {
                this.battle.actCooldowns[i]--;
            }
        }
    }

    attemptMercy() {
        if (!this.battle || this.battle.mercyMeter < 100) return;
        
        // Check for special matchups where mercy is disabled
        if (this.battle.kiteVsMona) {
            this.addToBattleLog("Kite cannot show mercy to Mona due to their complex history!");
            return;
        }
        if (this.battle.gingerVsNavia) {
            this.addToBattleLog("Ginger cannot show mercy to Navia due to their digital past!");
            return;
        }
        if (this.battle.monaVsKite) {
            this.addToBattleLog("Mona cannot spare Kite - their mercy is capped at 75%!");
            return;
        }
        if (this.battle.naviaVsGinger) {
            this.addToBattleLog("Navia cannot spare Ginger - their mercy is capped at 75%!");
            return;
        }
        
        // End battle with mercy
        this.battle.gameOver = true;
        const creditsEarned = Math.floor(characters[this.currentOpponent].power * 5); // Reduced credits for mercy
        this.credits += creditsEarned;
        this.saveData();
        
        document.getElementById('credits-earned').textContent = creditsEarned;
        document.getElementById('victory-text').textContent = `${characters[this.currentCharacter].name} showed mercy to ${characters[this.currentOpponent].name}!`;
        
        const audio = document.getElementById('battle-music');
        audio.pause();
        audio.src = '';
        
        this.showScreen('victory');
    }

    useAbility(abilityIndex) {
        if (!this.battle || this.battle.gameOver) return;
        
        const result = this.battle.useAbility(abilityIndex);
        this.updateBattleUI();
        this.addToBattleLog(result.message);
        
        if (result.gameOver) {
            this.endBattle(result);
            return;
        }
        
        // Disable buttons during AI turn
        const buttons = document.querySelectorAll('.abilities button');
        buttons.forEach(btn => btn.disabled = true);
        
        // AI turn after 1.5 seconds
        setTimeout(() => {
            const aiResult = this.battle.performAITurn();
            this.updateBattleUI();
            this.addToBattleLog(aiResult.message);
            
            if (aiResult.gameOver) {
                this.endBattle(aiResult);
            } else {
                // Re-enable buttons
                this.updateBattleUI();
            }
        }, 1500);
    }

    addToBattleLog(message) {
        const log = document.getElementById('battle-log');
        const entry = document.createElement('div');
        entry.textContent = `> ${message}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    endBattle(result) {
        const audio = document.getElementById('battle-music');
        audio.pause();
        audio.src = '';
        
        if (result.winner === 'player') {
            const creditsEarned = Math.floor(characters[this.currentOpponent].power * 10);
            this.credits += creditsEarned;
            this.saveData(); // This will also update the UI
            
            document.getElementById('credits-earned').textContent = creditsEarned;
            this.showScreen('victory');
        } else {
            setTimeout(() => {
                document.getElementById('defeat-text').textContent = 
                    `${characters[this.currentOpponent].name} has defeated ${characters[this.currentCharacter].name}`;
                this.showScreen('defeat');
            }, 1500);
        }
        
        this.battle = null;
    }

    updateUI() {
        document.getElementById('player-credits').textContent = this.credits;
        
        // Hide sound level control if Task1 is complete
        if (this.isTask1Complete()) {
            const soundLevelContainer = document.querySelector('.sound-level-control');
            if (soundLevelContainer) {
                soundLevelContainer.style.display = 'none';
            }
        }
    }

    showLore() {
        const grid = document.getElementById('lore-character-select');
        const detail = document.getElementById('lore-detail');
        
        grid.innerHTML = '';
        detail.style.display = 'none';
        
        Object.keys(characters).forEach(charId => {
            const char = characters[charId];
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <img src="${char.image}" alt="${char.name}">
                <h3>${char.name}</h3>
                <p>Power: ${char.power}</p>
            `;
            card.onclick = () => this.showLoreDetail(charId);
            grid.appendChild(card);
        });
        
        grid.style.display = 'grid';
        this.showScreen('lore');
    }

    showLoreDetail(charId) {
        const grid = document.getElementById('lore-character-select');
        const detail = document.getElementById('lore-detail');
        const lore = loreData[charId];
        const char = characters[charId];
        
        if (!lore) return;
        
        document.getElementById('lore-title').textContent = lore.title;
        document.getElementById('lore-text').textContent = lore.content;
        document.getElementById('lore-author').textContent = `— ${lore.author}`;
        
        grid.style.display = 'none';
        detail.style.display = 'block';
    }

    randomizeSoundLevel() {
        const newLevel = Math.floor(Math.random() * 100) + 1;
        this.soundLevel = newLevel;
        const soundLevelValue = document.getElementById('sound-level-value');
        soundLevelValue.textContent = newLevel;
        this.saveData();
    }
}

// Global functions for HTML onclick
window.showMainMenu = () => game.showScreen('main-menu');
window.showCharacterSelect = () => game.showCharacterSelect();
window.showShop = () => game.showShop();
window.showLore = () => game.showLore();
window.hideLoreDetail = () => game.showLore();
window.useAbility = (index) => game.useAbility(index);
window.setBattleMode = (mode) => game.setBattleMode(mode);
window.useActAbility = (index) => game.useActAbility(index);
window.attemptMercy = () => game.attemptMercy();

const game = new Game();