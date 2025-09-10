import { characters, abilities } from './characters.js';

class Battle {
    constructor(playerChar, opponentChar) {
        this.playerChar = playerChar;
        this.opponentChar = opponentChar;
        this.playerHealth = 100;
        this.opponentHealth = 100;
        this.playerMaxHealth = 100;
        this.opponentMaxHealth = 100;
        this.abilityCooldowns = [0, 0, 0];
        this.gameOver = false;
        this.mercyMeter = 0;
        this.battleMode = 'fight'; // 'fight' or 'act'
        this.actCooldowns = [0, 0, 0, 0]; // Cooldowns for ACT abilities
    }

    useAbility(abilityIndex, isPlayerTurn = true) {
        if (this.gameOver) return { gameOver: true };

        let result = this.executeTurn(abilityIndex, isPlayerTurn);
        return result;
    }

    performAITurn() {
        const aiAbility = this.selectAIAbility();
        const result = this.executeTurn(aiAbility, false);
        this.updateCooldowns();
        return result;
    }

    executeTurn(abilityIndex, isPlayerTurn) {
        const attacker = isPlayerTurn ? this.playerChar : this.opponentChar;
        const defender = isPlayerTurn ? this.opponentChar : this.playerChar;
        const attackerName = characters[attacker].name;
        const defenderName = characters[defender].name;
        
        let damage = 0;
        let message = '';
        
        // Enraged mode for Reflection
        const attackerPower = (attacker === 'reflection' && (isPlayerTurn ? this.playerHealth : this.opponentHealth) <= 30) ? 25 : characters[attacker].power;
        
        if (abilityIndex === 0) {
            // Basic attack
            damage = Math.floor(attackerPower * 1.5);
            message = this.getAttackActionText(attackerName, defenderName, damage);
        } else {
            // Special ability
            const ability = abilities[attacker][abilityIndex - 1];
            if (isPlayerTurn && this.abilityCooldowns[abilityIndex - 1] > 0) {
                return { message: `${ability.name} is on cooldown!`, gameOver: false };
            }
            
            if (!isPlayerTurn) {
                // AI uses abilities - apply effects properly
                if (ability.damage && ability.damage > 0) {
                    damage = ability.damage;
                    message = this.getAbilityActionText(attackerName, ability.name, ability.effect, damage);
                } else if (ability.heal) {
                    const healAmount = ability.heal;
                    this.opponentHealth = Math.min(100, this.opponentHealth + healAmount);
                    message = this.getHealActionText(attackerName, ability.name, healAmount);
                } else {
                    // Apply special effects for non-damage abilities
                    damage = this.applyAbilityEffect(ability, attacker, defender, isPlayerTurn);
                    message = this.getAbilityActionText(attackerName, ability.name, ability.effect, damage);
                }
            } else {
                // Player uses abilities - calculate damage properly
                damage = ability.damage || 0;
                if (ability.heal) {
                    const healAmount = ability.heal;
                    if (isPlayerTurn) {
                        this.playerHealth = Math.min(100, this.playerHealth + healAmount);
                    } else {
                        this.opponentHealth = Math.min(100, this.opponentHealth + healAmount);
                    }
                    message = this.getHealActionText(attackerName, ability.name, healAmount);
                } else {
                    // Apply special effects for non-damage abilities
                    const effectDamage = this.applyAbilityEffect(ability, attacker, defender, isPlayerTurn);
                    damage += effectDamage;
                    message = this.getAbilityActionText(attackerName, ability.name, ability.effect, effectDamage);
                }
                
                this.abilityCooldowns[abilityIndex - 1] = ability.cooldown;
            }
        }
        
        // Apply damage
        if (isPlayerTurn) {
            const oldHealth = this.opponentHealth;
            this.opponentHealth = Math.max(0, this.opponentHealth - damage);
            const actualDamage = oldHealth - this.opponentHealth;
            // Update message with actual damage if different from calculated
            if (actualDamage !== damage && actualDamage > 0) {
                message = message.replace(`${damage} damage`, `${actualDamage} damage`);
            }
        } else {
            const oldHealth = this.playerHealth;
            this.playerHealth = Math.max(0, this.playerHealth - damage);
            const actualDamage = oldHealth - this.playerHealth;
            // Update message with actual damage if different from calculated
            if (actualDamage !== damage && actualDamage > 0) {
                message = message.replace(`${damage} damage`, `${actualDamage} damage`);
            }
        }
        
        // Check win conditions
        if (this.playerHealth <= 0) {
            this.gameOver = true;
            return { winner: 'opponent', message, gameOver: true };
        } else if (this.opponentHealth <= 0) {
            this.gameOver = true;
            return { winner: 'player', message, gameOver: true };
        }
        
        return { message, gameOver: false };
    }

    selectAIAbility() {
        const aiAbilities = abilities[this.opponentChar];
        const weights = [50, 25, 20, 5]; // Basic attack weight is higher
        
        let totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) return i;
        }
        
        return 0; // Default to basic attack
    }

    updateCooldowns() {
        for (let i = 0; i < this.abilityCooldowns.length; i++) {
            if (this.abilityCooldowns[i] > 0) {
                this.abilityCooldowns[i]--;
            }
        }
        
        // Also update ACT cooldowns if battle has them
        if (this.actCooldowns) {
            for (let i = 0; i < this.actCooldowns.length; i++) {
                if (this.actCooldowns[i] > 0) {
                    this.actCooldowns[i]--;
                }
            }
        }
    }

    applyAbilityEffect(ability, attacker, defender, isPlayerTurn) {
        let damage = 0;
        const attackerPower = characters[attacker].power;
        const defenderName = characters[defender].name;
        
        switch (ability.effect) {
            case 'copy':
                // Mimic opponent's last move (simulate with bonus damage)
                damage = Math.floor(attackerPower * 1.2);
                break;
            case 'buff':
                // Increase next attack damage (simulate with immediate bonus)
                damage = Math.floor(attackerPower * 0.8);
                break;
            case 'predict':
                // See opponent's next move (grants bonus accuracy/damage)
                damage = Math.floor(attackerPower * 1.1);
                break;
            case 'bond':
                // Social connection strengthens attack
                damage = Math.floor(attackerPower * 1.3);
                break;
            case 'protect':
                // Defensive stance - reduces incoming damage next turn
                // This is handled by reducing future damage, for now apply small counter damage
                damage = Math.floor(attackerPower * 0.5);
                break;
            case 'teamwork':
                // Stronger with specific allies
                if ((attacker === 'kc' && defender === 'penelope') || (attacker === 'penelope' && defender === 'kc')) {
                    damage = Math.floor(attackerPower * 1.5);
                } else {
                    damage = Math.floor(attackerPower * 0.7);
                }
                break;
            case 'confuse':
                // Confusion causes self-damage to opponent
                if (!isPlayerTurn) {
                    this.playerHealth = Math.max(0, this.playerHealth - 10);
                } else {
                    this.opponentHealth = Math.max(0, this.opponentHealth - 10);
                }
                damage = 0; // Confusion damage is applied separately
                break;
            case 'counter':
                // Counter attack - reflects some damage back
                damage = Math.floor(attackerPower * 0.6);
                break;
            case 'dodge':
                // Avoid next attack - apply immediate defensive damage
                damage = Math.floor(attackerPower * 0.4);
                break;
            case 'random':
                // Random damage between 10-30
                damage = Math.floor(Math.random() * 20) + 10;
                break;
            case 'chaos':
                // Randomize effects - causes unpredictable damage
                damage = Math.floor(Math.random() * 25) + 5;
                break;
            case 'infect':
                // Virus damage that spreads
                damage = Math.floor(attackerPower * 0.9);
                // Additional infect effect on next turn
                break;
            case 'control':
                // Force opponent's move - psychological damage
                damage = Math.floor(attackerPower * 0.8);
                break;
            case 'gamble':
                // Random damage 10-40
                damage = Math.floor(Math.random() * 30) + 10;
                break;
            case 'chance':
                // Random buff/debuff - apply moderate damage
                damage = Math.floor(attackerPower * 0.8);
                break;
            case 'risk':
                // High risk high reward - 50% chance of double damage or self-harm
                if (Math.random() < 0.5) {
                    damage = Math.floor(attackerPower * 2.5);
                } else {
                    if (isPlayerTurn) {
                        this.playerHealth = Math.max(0, this.playerHealth - 15);
                    } else {
                        this.opponentHealth = Math.max(0, this.opponentHealth - 15);
                    }
                    damage = Math.floor(attackerPower * 0.5);
                }
                break;
            case 'transform':
                // Transformation effect - big damage when low health
                if ((isPlayerTurn && this.playerHealth <= 30) || (!isPlayerTurn && this.opponentHealth <= 30)) {
                    damage = Math.floor(attackerPower * 2);
                } else {
                    damage = Math.floor(attackerPower * 0.3);
                }
                break;
            default:
                // Default effect - small bonus damage
                damage = Math.floor(attackerPower * 0.6);
                break;
        }
        
        return damage;
    }
    
    getEffectDescription(effect, defenderName) {
        switch (effect) {
            case 'copy': return "Copies the opponent's technique!";
            case 'buff': return "Empowers their next attack!";
            case 'predict': return "Anticipates the next move!";
            case 'bond': return "Strengthened by connections!";
            case 'protect': return "Assumes a defensive stance!";
            case 'teamwork': return "Powered by friendship!";
            case 'confuse': return `Confuses ${defenderName}!`;
            case 'counter': return "Prepares to counterattack!";
            case 'dodge': return "Prepares to evade!";
            case 'random': return "Unleashes chaotic energy!";
            case 'chaos': return "Warps reality around them!";
            case 'infect': return "Infects with a virus!";
            case 'control': return `Takes control of ${defenderName}'s actions!`;
            case 'gamble': return "Rolls the dice of fate!";
            case 'chance': return "Leaves it to luck!";
            case 'risk': return "Gambles everything!";
            case 'transform': return "Begins to transform!";
            default: return "Uses mysterious power!";
        }
    }

    getAttackActionText(attackerName, defenderName, damage) {
        // Special matchup attack messages
        const specialAttacks = {
            'The Knight': {
                'Awareness': [
                    `${attackerName} strikes with reluctant precision, burdened by guilt`,
                    `${attackerName} attacks while memories of Moonlight flood back`,
                    `${attackerName} moves with the weight of his past mistakes`
                ]
            },
            'Awareness': {
                'The Knight': [
                    `${attackerName} strikes with knowledge that cuts deeper than steel`,
                    `${attackerName} attacks, revealing truths best left forgotten`,
                    `${attackerName} moves with unsettling purpose`
                ]
            },
            'Mona': {
                'Kite': [
                    `${attackerName} lunges with the fury of a hunted criminal`,
                    `${attackerName} strikes, remembering their past chase`,
                    `${attackerName} attacks with the desperation of the pursued`
                ]
            },
            'Kite': {
                'Mona': [
                    `${attackerName} moves with calculated law enforcement precision`,
                    `${attackerName} strikes like an officer pursuing justice`,
                    `${attackerName} attacks with the methodical approach of the law`
                ]
            },
            'Ginger': {
                'Navia': [
                    `${attackerName} fires with the precision of someone who ended a digital nightmare`,
                    `${attackerName} attacks, remembering the console he destroyed`,
                    `${attackerName} strikes with the confidence of one who escaped digital imprisonment`
                ]
            },
            'Navia': {
                'Ginger': [
                    `${attackerName} lashes out with the fury of a virus denied its host`,
                    `${attackerName} attacks, seeking revenge for her broken console`,
                    `${attackerName} strikes with digital rage against the one who trapped her`
                ]
            }
        };

        // Check for special matchup
        const currentSpecial = specialAttacks[attackerName];
        if (currentSpecial) {
            const opponentSpecial = currentSpecial[defenderName];
            if (opponentSpecial) {
                return opponentSpecial[Math.floor(Math.random() * opponentSpecial.length)];
            }
        }

        // Default attack messages
        const actions = [
            `${attackerName} lunges forward with primal fury`,
            `${attackerName} strikes with calculated precision`,
            `${attackerName} unleashes a devastating blow`,
            `${attackerName} attacks with relentless force`,
            `${attackerName} charges with unstoppable momentum`,
            `${attackerName} delivers a crushing strike`,
            `${attackerName} strikes from the shadows`,
            `${attackerName} attacks with fierce determination`,
            `${attackerName} unleashes their full might`,
            `${attackerName} strikes with deadly intent`
        ];
        return actions[Math.floor(Math.random() * actions.length)];
    }

    getAbilityActionText(attackerName, abilityName, effect, damage) {
        const effectTexts = {
            'copy': [
                `${attackerName} mirrors their opponent's technique`,
                `${attackerName} adapts to their foe's fighting style`,
                `${attackerName} learns from the enemy's moves`
            ],
            'buff': [
                `${attackerName} channels inner strength`,
                `${attackerName} focuses their energy`,
                `${attackerName} prepares for a powerful strike`
            ],
            'predict': [
                `${attackerName} reads their opponent's intentions`,
                `${attackerName} anticipates the next move`,
                `${attackerName} sees through the enemy's strategy`
            ],
            'bond': [
                `${attackerName} draws strength from connections`,
                `${attackerName} feels the power of friendship`,
                `${attackerName} channels social energy`
            ],
            'protect': [
                `${attackerName} raises their guard defensively`,
                `${attackerName} prepares to withstand attacks`,
                `${attackerName} takes a protective stance`
            ],
            'teamwork': [
                `${attackerName} fights alongside their ally`,
                `${attackerName} coordinates with their partner`,
                `${attackerName} unleashes combined power`
            ],
            'confuse': [
                `${attackerName} disorients their opponent`,
                `${attackerName} clouds the enemy's mind`,
                `${attackerName} creates mental chaos`
            ],
            'counter': [
                `${attackerName} prepares to retaliate`,
                `${attackerName} sets up a counterattack`,
                `${attackerName} waits for the perfect moment`
            ],
            'dodge': [
                `${attackerName} prepares to evade`,
                `${attackerName} focuses on avoiding attacks`,
                `${attackerName} becomes difficult to hit`
            ],
            'random': [
                `${attackerName} unleashes unpredictable energy`,
                `${attackerName} taps into chaos`,
                `${attackerName} releases wild power`
            ],
            'chaos': [
                `${attackerName} warps reality around them`,
                `${attackerName} creates disorder`,
                `${attackerName} bends the rules of combat`
            ],
            'infect': [
                `${attackerName} spreads corruption`,
                `${attackerName} unleashes a virus`,
                `${attackerName} infects their foe`
            ],
            'control': [
                `${attackerName} dominates their opponent's will`,
                `${attackerName} takes command of the situation`,
                `${attackerName} forces their enemy's hand`
            ],
            'gamble': [
                `${attackerName} takes a chance`,
                `${attackerName} rolls the dice`,
                `${attackerName} trusts in luck`
            ],
            'chance': [
                `${attackerName} leaves it to fate`,
                `${attackerName} accepts randomness`,
                `${attackerName} embraces uncertainty`
            ],
            'risk': [
                `${attackerName} gambles everything`,
                `${attackerName} takes a dangerous chance`,
                `${attackerName} risks it all`
            ],
            'transform': [
                `${attackerName} begins to change`,
                `${attackerName} feels power building`,
                `${attackerName} starts to evolve`
            ],
            'dominate': [
                `${attackerName} asserts total control`,
                `${attackerName} dominates the battlefield`,
                `${attackerName} shows their true power`
            ]
        };

        // Special matchup messages
        const specialMatchups = {
            'The Knight': {
                'Awareness': {
                    'Sword Strike': `${attackerName} reluctantly raises his blade, haunted by memories of Moonlight`,
                    'Honor Guard': `${attackerName} steels himself against the void's corruption`,
                    'Lunar Blade': `${attackerName} channels Moonlight's memory into his strike`
                }
            },
            'Awareness': {
                'The Knight': {
                    'Knowledge Strike': `${attackerName} strikes with knowledge that shouldn't exist`,
                    'Void Control': `${attackerName} manipulates the void with unsettling familiarity`,
                    'Transcendence': `${attackerName} transcends, showing glimpses of forgotten truths`
                }
            },
            'Mona': {
                'Kite': {
                    'Starlight': `${attackerName} calls down starlight, glaring at her former pursuer`,
                    'Cosmic Shield': `${attackerName} creates a barrier, still wary of the law`,
                    'Meteor Strike': `${attackerName} unleashes cosmic fury at her old enemy`
                }
            },
            'Kite': {
                'Mona': {
                    'Mimic': `${attackerName} copies Mona's technique with practiced precision`,
                    'Adapt': `${attackerName} adapts, remembering their past encounters`,
                    'Learn': `${attackerName} learns from their history together`
                }
            },
            'Ginger': {
                'Navia': {
                    'Aimed Shot': `${attackerName} aims with deadly precision, remembering the console he destroyed`,
                    'Tactical Reload': `${attackerName} prepares her weapon, recalling the digital prison he shattered`,
                    'Perfect Shot': `${attackerName} executes the perfect shot, ending what he started in the digital world`
                }
            },
            'Navia': {
                'Ginger': {
                    'Virus Upload': `${attackerName} uploads a virus fueled by digital vengeance`,
                    'Simon Says': `${attackerName} forces Ginger to relive breaking her console`,
                    'System Crash': `${attackerName} crashes the system, seeking retribution for her shattered prison`
                }
            }
        };

        // Check for special matchups
        const currentMatchup = specialMatchups[attackerName];
        if (currentMatchup) {
            const opponentMatchup = currentMatchup[characters[this.opponentChar]?.name];
            if (opponentMatchup && opponentMatchup[abilityName]) {
                return opponentMatchup[abilityName];
            }
        }

        // Check reverse matchups (opponent vs attacker)
        const reverseMatchup = specialMatchups[characters[this.opponentChar]?.name];
        if (reverseMatchup && reverseMatchup[attackerName]) {
            const abilityMatchup = reverseMatchup[attackerName][abilityName];
            if (abilityMatchup) {
                return abilityMatchup;
            }
        }

        // Default effect texts
        if (effect && effectTexts[effect]) {
            const texts = effectTexts[effect];
            return texts[Math.floor(Math.random() * texts.length)];
        }

        // Default ability descriptions
        const defaultTexts = {
            'Shadow Drain': `${attackerName} drains life force with dark tendrils`,
            'Desire Wave': `${attackerName} weaves illusions of longing`,
            'Dark Pulse': `${attackerName} releases waves of shadow energy`,
            'Mimic': `${attackerName} perfectly copies their opponent`,
            'Adapt': `${attackerName} evolves to match the situation`,
            'Learn': `${attackerName} studies the enemy's patterns`,
            'Social Link': `${attackerName} strengthens bonds with allies`,
            'Dark Shield': `${attackerName} creates a barrier of darkness`,
            'Friendship Power': `${attackerName} unleashes the power of bonds`,
            'Healing Light': `${attackerName} bathes in restorative light`,
            'Cheer Up': `${attackerName} inspires themselves to fight harder`,
            'Joy Burst': `${attackerName} attacks with pure happiness`,
            'Earth Shield': `${attackerName} calls upon natural protection`,
            'Natural Heal': `${attackerName} draws strength from the earth`,
            'Gaia Strike': `${attackerName} channels planetary force`,
            'Cat\'s Grace': `${attackerName} moves with feline agility`,
            'Friendship Boost': `${attackerName} powers up with friendship`,
            'Precision Claw': `${attackerName} strikes with perfect accuracy`,
            'Starlight': `${attackerName} calls down celestial energy`,
            'Cosmic Shield': `${attackerName} creates a stellar barrier`,
            'Meteor Strike': `${attackerName} summons falling stars`,
            'Quick Draw': `${attackerName} fires with lightning speed`,
            'Protective Fire': `${attackerName} creates a defensive barrage`,
            'Headshot': `${attackerName} aims for a critical strike`,
            'Chaos Bolt': `${attackerName} unleashes wild magic`,
            'Disorder Field': `${attackerName} creates an area of chaos`,
            'Friend Synergy': `${attackerName} combines powers with allies`,
            'Plasma Shot': `${attackerName} fires alien weaponry`,
            'Tech Shield': `${attackerName} deploys energy shields`,
            'Orbital Strike': `${attackerName} calls down orbital support`,
            'Aimed Shot': `${attackerName} takes careful aim`,
            'Tactical Reload': `${attackerName} prepares for the next shot`,
            'Perfect Shot': `${attackerName} executes a flawless attack`,
            'Divine Strike': `${attackerName} attacks with fallen grace`,
            'Fallen Shield': `${attackerName} creates dark protection`,
            'Judgment': `${attackerName} delivers divine punishment`,
            'Virus Upload': `${attackerName} transmits malicious code`,
            'Simon Says': `${attackerName} forces their opponent's actions`,
            'System Crash': `${attackerName} overloads the system`,
            'Sword Strike': `${attackerName} swings with noble purpose`,
            'Honor Guard': `${attackerName} takes a defensive stance`,
            'Lunar Blade': `${attackerName} channels moonlight into their blade`,
            'Lucky Shot': `${attackerName} takes a chance with their aim`,
            'Dice Roll': `${attackerName} leaves the outcome to fate`,
            'All In': `${attackerName} commits everything to one attack`,
            'Divine Light': `${attackerName} unleashes divine radiance`,
            'Shadow Form': `${attackerName} shifts between dimensions`,
            'Reality Break': `${attackerName} shatters the laws of physics`,
            'Weak Strike': `${attackerName} barely manages to hit`,
            'Desperation': `${attackerName} feels power building within`,
            'Final Stand': `${attackerName} unleashes their ultimate form`,
            'Knowledge Strike': `${attackerName} attacks with forbidden knowledge`,
            'Void Control': `${attackerName} manipulates the void itself`,
            'Transcendence': `${attackerName} ascends beyond mortal limits`
        };

        if (defaultTexts[abilityName]) {
            return defaultTexts[abilityName];
        }

        return `${attackerName} uses ${abilityName}`;
    }

    getHealActionText(attackerName, abilityName, healAmount) {
        const healTexts = [
            `${attackerName} draws upon inner strength to recover`,
            `${attackerName} channels healing energy`,
            `${attackerName} finds the will to continue fighting`,
            `${attackerName} restores their vitality`,
            `${attackerName} mends their wounds through determination`,
            `${attackerName} calls upon restorative power`,
            `${attackerName} finds comfort in the heat of battle`,
            `${attackerName} recovers through sheer force of will`
        ];
        return healTexts[Math.floor(Math.random() * healTexts.length)];
    }
}

export const battleSystem = {
    Battle
};