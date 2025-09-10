export const characters = {
    cupiditas: {
        name: "Cupiditas",
        power: 7,
        image: "cupiditas.png",
        cost: 0,
        description: "A creature of desire and shadow",
        health: 100
    },
    kite: {
        name: "Kite",
        power: 6,
        image: "kite.png",
        cost: 0,
        description: "An adaptable entity with remarkable learning capabilities",
        health: 90
    },
    subject_192: {
        name: "Subject 192",
        power: 8,
        image: "subject_192.png",
        cost: 0,
        description: "The most socially connected of specimens",
        health: 110
    },
    penelope: {
        name: "Penelope",
        power: 5,
        image: "penelope.png",
        cost: 100,
        description: "A being of pure optimism and joy",
        health: 80
    },
    terra: {
        name: "Terra",
        power: 6,
        image: "terra.png",
        cost: 150,
        description: "Connected to natural forces and earth energies",
        health: 95
    },
    kc: {
        name: "KC",
        power: 6,
        image: "kc.png",
        cost: 175,
        description: "A cheerful feline fighter with unbreakable bonds",
        health: 85
    },
    mona: {
        name: "Mona",
        power: 6,
        image: "mona.png",
        cost: 200,
        description: "An alien stargazer trapped in the void",
        health: 100
    },
    cyrus: {
        name: "Cyrus",
        power: 10,
        image: "cyrus.png",
        cost: 250,
        description: "A precise gunslinger with exceptional marksmanship",
        health: 120
    },
    maturity: {
        name: "Maturity",
        power: 9,
        image: "maturity.png",
        cost: 300,
        description: "An embodiment of chaos and unpredictability",
        health: 115
    },
    vicki: {
        name: "Vicki",
        power: 7,
        image: "vicki.png",
        cost: 350,
        description: "An alien entity with advanced technology",
        health: 105
    },
    ginger: {
        name: "Ginger",
        power: 7,
        image: "ginger.png",
        cost: 400,
        description: "A deadly gunslinger surpassing all in skill",
        health: 110
    },
    blitz: {
        name: "Blitz",
        power: 9,
        image: "blitz.png",
        cost: 500,
        description: "A fallen celestial driven by divine fury",
        health: 130
    },
    navia: {
        name: "Navia",
        power: 9,
        image: "navia.png",
        cost: 600,
        description: "A mysterious virus entity with unknown intentions",
        health: 125
    },
    knight: {
        name: "The Knight",
        power: 7,
        image: "knight.png",
        cost: 700,
        description: "A noble warrior bound by honor",
        health: 100
    },
    seven: {
        name: "Seven",
        power: 7,
        image: "seven.png",
        cost: 777,
        description: "A gambler whose existence is tied to chance",
        health: 100
    },
    prime: {
        name: "Prime",
        power: 8,
        image: "prime.png",
        cost: 800,
        description: "An immortal goddess who transcends understanding",
        health: 135
    },
    reflection: {
        name: "Reflection",
        power: 1,
        image: "reflection.png",
        cost: 1000,
        description: "Appears weak but transforms when facing defeat",
        health: 50
    },
    awareness: {
        name: "Awareness",
        power: 999,
        image: "awareness.png",
        cost: Infinity,
        description: "My greatest achievement and greatest concern",
        health: 200
    }
};

export const abilities = {
    cupiditas: [
        { name: "Shadow Drain", damage: 20, heal: 10, cooldown: 2, description: "Drain life from the opponent" },
        { name: "Desire Wave", damage: 15, effect: "confuse", cooldown: 3, description: "Confuse the opponent" },
        { name: "Dark Pulse", damage: 25, cooldown: 4, description: "Unleash a wave of dark energy" }
    ],
    kite: [
        { name: "Mimic", damage: 10, effect: "copy", cooldown: 2, description: "Copy opponent's last ability" },
        { name: "Adapt", heal: 15, effect: "buff", cooldown: 3, description: "Increase next attack damage" },
        { name: "Learn", effect: "predict", cooldown: 4, description: "See opponent's next move" }
    ],
    subject_192: [
        { name: "Social Link", heal: 20, effect: "bond", cooldown: 2, description: "Heal through connections" },
        { name: "Dark Shield", effect: "protect", cooldown: 3, description: "Reduce incoming damage" },
        { name: "Friendship Power", damage: 30, cooldown: 5, description: "Attack powered by bonds" }
    ],
    penelope: [
        { name: "Healing Light", heal: 25, cooldown: 2, description: "Restore health with optimism" },
        { name: "Cheer Up", effect: "buff", cooldown: 3, description: "Increase attack power" },
        { name: "Joy Burst", damage: 20, cooldown: 4, description: "Attack with pure happiness" }
    ],
    terra: [
        { name: "Earth Shield", effect: "protect", cooldown: 2, description: "Nature's protection" },
        { name: "Natural Heal", heal: 20, cooldown: 3, description: "Draw strength from earth" },
        { name: "Gaia Strike", damage: 25, cooldown: 4, description: "Attack with nature's fury" }
    ],
    kc: [
        { name: "Cat's Grace", effect: "dodge", cooldown: 2, description: "Avoid next attack" },
        { name: "Friendship Boost", damage: 15, effect: "teamwork", cooldown: 3, description: "Stronger with Penelope" },
        { name: "Precision Claw", damage: 30, cooldown: 4, description: "Deadly accurate strike" }
    ],
    mona: [
        { name: "Starlight", damage: 20, cooldown: 2, description: "Celestial attack" },
        { name: "Cosmic Shield", effect: "protect", cooldown: 3, description: "Star-powered defense" },
        { name: "Meteor Strike", damage: 35, cooldown: 5, description: "Call down cosmic fury" }
    ],
    cyrus: [
        { name: "Quick Draw", damage: 25, cooldown: 2, description: "Rapid gunfire" },
        { name: "Protective Fire", effect: "counter", cooldown: 3, description: "Counter next attack" },
        { name: "Headshot", damage: 40, cooldown: 5, description: "Perfect accuracy shot" }
    ],
    maturity: [
        { name: "Chaos Bolt", damage: 20, effect: "random", cooldown: 2, description: "Unpredictable damage" },
        { name: "Disorder Field", effect: "chaos", cooldown: 3, description: "Randomize opponent's abilities" },
        { name: "Friend Synergy", damage: 30, cooldown: 4, description: "Stronger with Kite" }
    ],
    vicki: [
        { name: "Plasma Shot", damage: 22, cooldown: 2, description: "Alien weapon fire" },
        { name: "Tech Shield", effect: "protect", cooldown: 3, description: "Energy barrier" },
        { name: "Orbital Strike", damage: 35, cooldown: 5, description: "Call for orbital support" }
    ],
    ginger: [
        { name: "Aimed Shot", damage: 30, cooldown: 2, description: "Precise bullet" },
        { name: "Tactical Reload", effect: "buff", cooldown: 3, description: "Increase next shot damage" },
        { name: "Perfect Shot", damage: 50, cooldown: 6, description: "Ultimate precision" }
    ],
    blitz: [
        { name: "Divine Strike", damage: 25, cooldown: 2, description: "Angelic attack" },
        { name: "Fallen Shield", effect: "protect", cooldown: 3, description: "Dark angel protection" },
        { name: "Judgment", damage: 40, cooldown: 5, description: "Divine punishment" }
    ],
    navia: [
        { name: "Virus Upload", damage: 20, effect: "infect", cooldown: 2, description: "Infect opponent" },
        { name: "Simon Says", effect: "control", cooldown: 3, description: "Force opponent's move" },
        { name: "System Crash", damage: 35, cooldown: 5, description: "Digital overload" }
    ],
    knight: [
        { name: "Sword Strike", damage: 20, cooldown: 2, description: "Noble blade attack" },
        { name: "Honor Guard", effect: "protect", cooldown: 3, description: "Defensive stance" },
        { name: "Lunar Blade", damage: 35, cooldown: 5, description: "Moon-powered strike" }
    ],
    seven: [
        { name: "Lucky Shot", damage: 25, effect: "gamble", cooldown: 2, description: "Random damage 10-40" },
        { name: "Dice Roll", effect: "chance", cooldown: 3, description: "Random buff or debuff" },
        { name: "All In", damage: 50, effect: "risk", cooldown: 6, description: "High risk, high reward" }
    ],
    prime: [
        { name: "Divine Light", damage: 25, cooldown: 2, description: "Goddess's wrath" },
        { name: "Shadow Form", effect: "protect", cooldown: 3, description: "Phase shift" },
        { name: "Reality Break", damage: 45, cooldown: 6, description: "Distort reality" }
    ],
    reflection: [
        { name: "Weak Strike", damage: 5, cooldown: 1, description: "Pathetic attack" },
        { name: "Desperation", effect: "transform", cooldown: 5, description: "Transform when low health" },
        { name: "Final Stand", damage: 60, cooldown: 8, description: "Ultimate vengeance form" }
    ],
    awareness: [
        { name: "Knowledge Strike", damage: 35, cooldown: 1, description: "Strike with forbidden knowledge" },
        { name: "Void Control", effect: "dominate", cooldown: 2, description: "Control the battlefield" },
        { name: "Transcendence", damage: 50, cooldown: 3, description: "Ascend beyond limits" }
    ]
};

export const actAbilities = {
    // This will be expanded with specific ACT abilities for each character
    // The main logic is in the getActAbilities() method in game.js
};