// Messages and dialog system
export const messages = {
  playerOwn: {
    default: [
      "A perfect play!",
      "Just as planned!",  
      "Witness true power!",
      "None can stand against us!",
      "Victory is sweet!"
    ],
    enhanced: [
      "My enhanced power is unstoppable!",
      "Feel the glow of victory!",
      "This isn't even my final form!",
      "Enhanced and victorious!", 
      "Behold my true strength!"
    ],
    resonance: [
      "Echo's power flows through me!",
      "Double the strength, double the victory!",
      "Our resonance is perfect!",
      "Two times the fun!",
      "Echo amplifies our might!"
    ],
    friendship: [
      "Penelope's friendship empowers us!",
      "The strength of bonds prevails!",
      "Friends make us stronger!",
      "Together we shine brighter!",
      "Friendship conquers all!"
    ],
    resonanceAndFriendship: [
      "Echo and Penelope's power united!",
      "Friends AND resonance? Unstoppable!",
      "Triple threat: Me, Echo, and Penelope!",
      "The perfect combination!",
      "Friendship and resonance for the win!"
    ]
  },
  aiWin: {
    default: [
      "Better luck next time, human.",
      "Your strategy needs work.",
      "A valiant effort, but futile.",
      "Calculated victory.",
      "The outcome was inevitable."
    ],
    enhanced: [
      "Enhanced power cannot be denied!",
      "Witness true perfection!",
      "Your defeat was guaranteed.",
      "Power overwhelming!",
      "Resistance is futile!"
    ]
  },
  special: {
    'null': ["E̸R̸R̸O̸R̸:̸ ̸V̸I̸C̸T̸O̸R̸Y̸.̸E̸X̸E̸", "C̸O̸R̸R̸U̸P̸T̸I̸O̸N̸ ̸C̸O̸M̸P̸L̸E̸T̸E̸", "D̸E̸F̸E̸A̸T̸ ̸I̸N̸E̸V̸I̸T̸A̸B̸L̸E̸"],
    'awareness': ["∞ INFINITY PREVAILS ∞", "ALL IS KNOWN", "EXISTENCE BOWS TO INFINITY"],
    'zero': ["From nothing comes everything.", "The void hungers...", "Your power feeds me."],
    'enraged_kite': ["RAGE CONQUERS ALL!", "DESTROY! DESTROY!", "NO MORE TRICKS!"],
    'maturity': ["lol get rekt", "ez game ez life", "u mad bro?"],
    'mr_bones': ["The ancient ones triumph.", "Time is on my side.", "Age before beauty!"],
    'high_kite': ["No tricks needed. Just power.", "Playtime is over.", "Serious business indeed."],
    'justice': ["Justice prevails! Heroes always win!", "Evil will never triumph!", "For truth and justice!"],
    'cupiditas': ["The shadows claim another...", "Darkness consumes all.", "Fear the shadows."],
    'purple_guy': ["Your soul has been judged.", "I see all your weaknesses.", "Your fate was sealed from the start."],
    'sally': ["*yawns* Was that supposed to be difficult?", "Wake me up when there's real competition.", "Did you actually try?"],
    'kite': ["Hehe, fooled you again!", "Tricks are for winners!", "Copy cat strikes again!"],
    'prime': ["Immortality has its perks.", "Time means nothing to the eternal.", "Your efforts are meaningless."],
    'carlgpt': ["Analysis complete: You lose.", "Probability of victory: 100%", "Your strategy was predictable."],
    'worendy': ["My curse marks your defeat.", "Ink flows, power grows.", "Written in black and white: you lose."],
    'moonlight': ["V̸O̸I̸D̸ ̸C̸O̸N̸S̸U̸M̸E̸S̸ ̸A̸L̸L̸", "R̸E̸A̸L̸I̸T̸Y̸ ̸B̸E̸N̸D̸S̸", "T̸R̸U̸T̸H̸ ̸D̸I̸S̸T̸O̸R̸T̸S̸"],
    'penelope': ["Yay! Did I win? I won!", "Everyone did their best! *giggles*", "Playing cards is so much fun!"],
    'reflection': [
      "Cut them down to forge forever\nWe'll ignite with lifelines severed\nIn potential lies, endless life awoken\nDamn them to their final verdict\nGive their life to the deserving\nLet their remnants cry...\nI remain... UNBROKEN!"
    ],
    'ginger': [
      "Bullseye.",
      "Target neutralized.",
      "And that's how it's done.",
      "Next time bring a real challenge.",
      "Professional marksmanship at its finest."
    ],
    'feathers': [
      "A mother's love knows no bounds!",
      "I'll protect everyone!",
      "Watch how strong love can be!",
      "This is what it means to protect!"
    ],
    'highpoint': [
      "None shall pass my guard!",
      "Your abilities mean nothing before me!",
      "I am the shield AND the sword!",
      "Protection through power!"
    ],
    'kc': [
      "Everyone is my friend!",
      "I love making new friends!",
      "Let's all be happy together!",
    ],
    'salvo': [
      "Feel the burn!",
      "Everything burns!",
      "Ashes to ashes...",
    ],
    'assassin': [
      "T̸̮̺͐͌͝a̷̯͈̓̀r̷̯͈̓g̸̝̈́̄e̶͍͇̓t̸̨̓̊͜s̶͎̩̈́ ̶͉̌e̷̦͝l̶̙͈̾̄i̵̜͗m̵̙͂̏ĭ̶͇n̴͚̿̓å̸̱t̴͖̊e̶̲̎d̸͔̏",
      "N̷o̷ ̷s̷u̷r̷v̷i̷v̷o̷r̷s̷",
      "M̷i̷s̷s̷i̷o̷n̷ ̷c̷o̷m̷p̷l̷e̷t̷e̷d̷"
    ],
    'vesper': ["From darkness comes strength!", "The night empowers me!", "Shadows guide my victory!"],
    'nova': ["Feel the cosmic power!", "Stars align in my favor!", "Stellar victory achieved!"],
    'subject_192': [
      "8̷2̷3̷6̷w̷e̷h̷d̷j̷s̷k̷",
      "F̷r̷i̷e̷n̷d̷?̷ ̷<̷3̷",
      "l̷o̷v̷e̷.̷.̷.̷ ̷a̷n̷d̷ ̷d̷e̷s̷t̷r̷u̷c̷t̷i̷o̷n̷"
    ],
    'fevaa': [
      "Kindness can come from anywhere!",
      "Even demons can show mercy.",
      "Let me help you up... friend.",
      "Sometimes the scariest things are the gentlest."
    ],
    'binx': [
      "That's what you get for not laughing!",
      "Divine punishment? More like divine comedy!",
      "Was that joke inappropriate? Absolutely!",
      "Heaven's got no sense of humor!"
    ],
    'chaos': [
      "Chaos through order.",
      "Balance is key.",
      "Even chaos needs structure."
    ],
    'cyrus': [
      "Target eliminated.",
      "Protection detail successful.",
      "No one hurts my friends."
    ],
    'aurora': [
      "My colors shine brightest!",
      "A perfect reflection of power!",
      "I match your strength... and surpass it!"
    ],
    'terra': [
      "Nature always finds a way, mew~",
      "The earth protects its own, mew~",
      "Feel the power of the wild, mew~"
    ],
    'fester': [
      "The flames are growing stronger!",
      "Just a spark for now... but soon!",
      "Divine fire burns eternal!",
      "My power may be small, but it burns bright!"
    ],
    'cocoa': [
      "Did... did I do that right?",
      "Was that supposed to happen?",
      "I think that worked! ...maybe?",
      "Yay! Or... oh no? I'm not sure!"
    ],
    'drew': [
      "Of course I won, was there ever any doubt?",
      "You actually thought you could beat ME?",
      "Maybe try again when you're stronger... much stronger.",
      "I barely had to try!",
      "*yawns* Wake me up when there's real competition."
    ]
  }
};

export const tieMessages = {
  default: {
    default: [
      "A worthy opponent!",
      "Our powers are matched!",
      "An impressive display!",
      "We stand as equals.",
      "Neither backs down!"
    ],
    enhanced: [
      "Even enhanced, we're equal!",
      "Our powers resonate!",
      "A clash of titans!",
      "Two forces collide!",
      "Enhanced and evenly matched!"
    ]
  },
  special: {
    'null': ["E̸R̸R̸O̸R̸:̸ ̸D̸R̸A̸W̸.̸E̸X̸E̸", "P̸A̸R̸A̸D̸O̸X̸ ̸D̸E̸T̸E̸C̸T̸E̸D̸"],
    'awareness': ["∞ = ∞", "PERFECTION MIRRORS PERFECTION"],
    'zero': ["The void meets its match.", "Two voids, one outcome."],
    'enraged_kite': ["RAGE MEETS RAGE!", "EQUAL FURY!"],
    'maturity': ["1v1 me bro", "gg wp"],
    'mr_bones': ["Time stands still.", "Ages clash."],
    'high_kite': ["No tricks needed between equals.", "A serious standoff."],
    'justice': ["Together we stand for justice!", "Heroes unite!"],
    'cupiditas': ["Shadows merge...", "Darkness meets darkness."],
    'purple_guy': ["Two souls, equally judged.", "The watcher meets its match."],
    'sally': ["*raises eyebrow* Not bad...", "Finally, a real challenge."],
    'kite': ["Double trouble!", "Two can play this game!"],
    'prime': ["Immortals at an impasse.", "Eternity meets eternity."],
    'carlgpt': ["Calculating probability of tie: 100%", "An unexpected variable."],
    'worendy': ["C̷u̷r̷s̷e̷d̷ ̷g̷l̷i̷t̷c̷h̷", "V̷o̷i̷d̷ ̷i̷n̷k̷"],
    'moonlight': ["V̸O̸I̸D̸ ̸M̸E̸E̸T̸S̸ ̸V̸O̸I̸D̸", "P̸A̸R̸A̸D̸O̸X̸"],
    'penelope': ["Yay! New friends!", "Everyone's a winner!"],
    'reflection': ["Our reflections align...", "Two sides of one mirror."],
    'ginger': ["Dead heat.", "Draw.", "Not bad, shooter."],
    'kc': [
      "Friends forever!",
      "I love making new friends!",
      "Group photo time!"
    ],
    'salvo': [
      "A worthy challenger...",
      "The flames recognize your strength.",
      "This heat... it's equal to mine!"
    ],
    'assassin': [
      "E̷r̷r̷o̷r̷:̷ ̷C̷o̷n̷f̷l̷i̷c̷t̷",
      "T̷a̷r̷g̷e̷t̷ ̷r̷e̷s̷i̷s̷t̷s̷",
      "R̷e̷c̷a̷l̷c̷u̷l̷a̷t̷i̷n̷g̷"
    ],
    'vesper': ["Darkness meets darkness.", "Two shadows intertwine."],
    'nova': ["Stars collide in harmony!", "A cosmic balance!"],
    'subject_192': [
      "8̷2̷3̷6̷4̷s̷a̷m̷e̷?̷",
      "F̷r̷i̷e̷n̷d̷ ̷=̷ ̷m̷e̷?̷"
    ],
    'fevaa': ["Even demons know when to show mercy.", "This fight ends in kindness."],
    'binx': ["Not even my jokes can break this tie!", "Divine comedy meets its match!"],
    'chaos': [
      "Order meets chaos.",
      "A perfect balance.",
      "Harmony achieved."
    ],
    'cyrus': [
      "Stand down. We're at an impasse.",
      "Equal force detected.",
      "Target match confirmed."
    ],
    'aurora': [
        "Our hues align perfectly!",
        "A vibrant stalemate!",
        "Two artists, one canvas of power."
    ],
    'terra': [
        "The earth trembles with our combined might, mew~",
        "Nature's balance holds strong, mew~",
        "A draw as ancient as the mountains, mew~"
    ],
    'fester': [
      "Even divine flames can be matched.",
      "Your light burns as bright as mine!",
      "Two flames, equal in strength.",
      "The gods appreciate worthy opponents!"
    ],
    'cocoa': [
      "Oh! We tied! That's good... right?",
      "I copied you! Or... did you copy me?",
      "This means we're both winning! ...I think?",
      "Look! We did the same thing!"
    ],
    'drew': [
      "Impossible! No one matches my power!",
      "This must be some kind of mistake...",
      "You... you're cheating! You have to be!",
      "I demand a rematch! Right now!"
    ]
  },
  pairs: {
    'terra_penelope': ["Cat party! Meow~", "Best friends forever!"],
    'justice_penelope': ["Heroes in training!", "Justice and joy unite!"],
    'enraged_kite_kite': ["STOP COPYING ME!", "I HATE MYSELF!"],
    'high_kite_kite': ["No tricks needed.", "Time to grow up."],
    'null_awareness': ["U̷N̷D̷E̷F̷I̷N̷E̷D̷", "∞ ERROR ∞"],
    'justice_ginger': ["Violence isn't always the answer!", "Guns and capes don't mix."],
    'ginger_terra': ["...Put the gun down.", "Stop being cute, I'm trying to work."],
    'sally_ginger': ["Nice shot.", "Professional courtesy."],
    'kc_penelope': ["Best friends forever!", "Playtime buddies!"],
    'salvo_ginger': ["Just like old times!", "Partners in combat!"],
    'terra_kc': ["Cat AND dog? ...I'm so confused meow~", "Paw pals!"],
    'justice_sally': ["A true defender of peace!", "Your skills are hero material!"],
    'prime_reflection': ["Immortal meets eternal...", "Two constants in chaos."],
    'worendy_null': ["C̷u̷r̷s̷e̷d̷ ̷g̷l̷i̷t̷c̷h̷", "V̷o̷i̷d̷ ̷i̷n̷k̷"],
    'maturity_carlgpt': ["lol ur code sux", "git gud scrub"],
    'zero_awareness': ["Nothing equals infinity.", "Void meets limitless."],
    'echo_nova': ["Our resonance creates stars!", "Perfect harmony of space!"],
    'salvo_nova': ["Fire meets starlight!", "Cosmic flames unite!"],
    'kc_terra': ["Nature's best friends!", "Guardians of joy!"],
    'penelope_kc': ["Double the happiness!", "Friends forever and ever!"],
    'high_kite_enraged_kite': ["I hate what I've become.", "We're both broken inside."],
    'justice_prime': ["Eternal justice prevails!", "An immortal hero rises!"],
    'cupiditas_null': ["Shadows meet void.", "Darkness recognizes darkness."],
    'feathers_penelope': ["Mother and daughter stand together!", "No one can break our bond!"],
    'feathers_highpoint': ["I fight myself... to protect everyone!", "Two sides of the same protector."],
    'feathers_terra': ["Nature's guardians unite!", "We both protect in our own ways."],
    'highpoint_justice': ["Your heroic spirit matches my determination!", "Together we stand against evil!"],
    'subject_192_penelope': ["<̷3̷ ̷f̷r̷i̷e̷n̷d̷!", "P̷e̷n̷e̷l̷o̷p̷e̷ ̷<̷3̷"],
    'subject_192_kc': ["F̷r̷i̷e̷n̷d̷s̷h̷i̷p̷ ̷p̷o̷w̷e̷r̷!", "K̷C̷ ̷n̷i̷c̷e̷!̷"],
    'subject_192_feathers': ["M̷o̷t̷h̷e̷r̷?̷", "P̷r̷o̷t̷e̷c̷t̷ ̷m̷e̷?̷"],
    'fevaa_binx': ["Best friends forever!", "The demon and angel duo!"],
    'fevaa_penelope': ["Two kinds of kindness unite!", "Proving looks can be deceiving!"],
    'binx_justice': ["Your sense of justice needs work!", "Can't take a divine joke?"],
    'cyrus_subject_192': [
      "Best friends forever!",
      "I've got your back!",
      "Together we're unstoppable!"
    ],
    'drew_awareness': ["Wait... you're actually stronger than me?", "This can't be happening!"],
    'drew_null': ["What do you mean 'error'? Fight me properly!", "Stop glitching and face me!"],
    'drew_maturity': ["At least act your power level...", "This is beneath me."],
    'drew_highpoint': ["Finally, a REAL challenge!", "Now THIS is more my speed!"]
  }
};