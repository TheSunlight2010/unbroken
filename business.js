// Core business logic module
import { gsap } from 'gsap';

const BUSINESS_COMMENTS = {
  performance: {
    perfect: [
      "Now THAT'S what I call a profitable venture!",
      "You've got serious potential, kid. I like that.",
      "I should offer you a position in my company!",
    ],
    good: [
      "Not bad, not bad at all. Room for improvement though.",
      "A decent return on investment, I'd say.",
      "You're showing promise, keep at it.",
    ],
    poor: [
      "Well... we all have to start somewhere.",
      "Consider this a learning opportunity.",
      "Let's just call this a market research phase.",
    ]
  },
  cardRelations: {
    kite: [
      "Ugh, that trickster... Always disrupting my business meetings with their pranks.",
      "Do you know how many contracts they've copied and messed with?",
      "Keep an eye on this one - they're not to be trusted with sensitive documents.",
    ],
    high_kite: [
      "Finally, a version of Kite I can actually do business with.",
      "At least this one understands the importance of professionalism.",
      "Now THIS is how you conduct yourself in a corporate environment.",
    ],
    enraged_kite: [
      "Had to replace three office chairs after their last... incident.",
      "We don't talk about what happened at the company retreat.",
      "Oh..! Security has been tripled since their last visit.",
    ],
    sally: [
      "*straightens tie* Ah yes, Sally... quite the... professional...",
      "Have you seen her defensive legal strategies? Simply magnificent!",
      "I've been trying to get her on my board of directors for months...",
    ],
    justice: [
      "Such enthusiasm! Reminds me of my intern days.",
      "She keeps trying to start a workplace superhero club.",
      "Had to create a 'No Cape' policy because of her.",
    ],
    null: [
      "Our systems crash every time they enter the building.",
      "IT department still hasn't recovered from their job interview.",
      "█████████████████████████",
    ],
    moonlight: [
      "ERROR: Employee file not found",
      "I don't recall hiring... wait, what was I saying?",
      "§̵̛̠͚̲̓̽̓͝ỳ̸̯̝͔͉͎̆̒͘͝s̷̩͕̎̈́̆͜st̷̨͍͎̹̏͒̎t̷̨͍͎̹̏͒̎t̵͈͍̩̿",
    ],
    awareness: [
      "They know EVERYTHING about our quarterly reports...",
      "Somehow predicted our stock prices for the next decade.",
      "Best financial advisor ever... terrifying, but effective.",
    ],
    prime: [
      "Excellent long-term investment potential.",
      "Their retirement plan is... interesting.",
      "Never ages a day. HR is very confused.",
    ],
    terra: [
      "Had to implement a plant-friendly workplace policy.",
      "Excellent at growing our profit margins!",
      "Turned the break room into a mini-forest...",
    ],
    penelope: [
      "She keeps drawing on my important documents with crayons...",
      "Brings her stuffed animals to every board meeting.",
      "The office morale goes up 200% when she visits!"
    ],
    ginger: [
      "Our security budget has tripled since they joined...",
      "Best marksman in the company! Though the target practice room needs repairs...",
      "They keep asking for a 'gun allowance' in their contract..."
    ],
    kc: [
      "The office therapy pet! Everyone loves her visits.",
      "HR's secret weapon for conflict resolution.",
      "She organized the best company picnic ever!"
    ],
    salvo: [
      "The fire department is on speed dial now...",
      "They handle our... heated negotiations.",
      "At least the office is always warm in winter."
    ],
    assassin: [
      "I... I don't remember hiring them...",
      "Our competition keeps... disappearing...",
      "█̷̖̈́E̷̳͌R̷͚̋R̵̢̂O̶͚̽R̷̙̈́"
    ]
  }
};

function createMiniCardElement(card, callback) {
  const element = document.createElement('div');
  // Basic styling, should match game's .card but smaller
  element.style.width = '80px';
  element.style.height = '120px';
  element.style.background = '#222';
  element.style.borderRadius = '5px';
  element.style.margin = '5px';
  element.style.cursor = 'pointer';
  element.style.position = 'relative';
  element.style.color = 'white';
  element.style.fontSize = '10px';
  element.style.textAlign = 'center';
  element.style.border = '1px solid #444';
  element.style.display = 'flex';
  element.style.flexDirection = 'column';
  element.style.justifyContent = 'space-between';
  element.style.padding = '5px';

  const characterDiv = document.createElement('div');
  characterDiv.style.width = '60px';
  characterDiv.style.height = '60px';
  characterDiv.style.margin = '0 auto';
  characterDiv.style.borderRadius = '3px';
  if (card.image && card.image !== 'null.png') { // Assuming null.png is a placeholder or special
    characterDiv.style.background = `url(${card.image}) no-repeat center/cover`;
  } else {
    characterDiv.style.background = '#333'; // Fallback for no image
  }

  const nameDiv = document.createElement('div');
  nameDiv.textContent = card.name.substring(0,12) + (card.name.length > 12 ? '...' : ''); // Truncate name
  nameDiv.style.fontWeight = 'bold';

  const powerDiv = document.createElement('div');
  powerDiv.textContent = `P: ${card.power}`;
  powerDiv.style.fontSize = '12px';

  element.appendChild(characterDiv);
  element.appendChild(nameDiv);
  element.appendChild(powerDiv);

  element.addEventListener('click', () => {
    callback(card);
  });
  return element;
}

export function showBusinessReview(playerScore, totalPlayers, allCards, nextGameCallback) {
  const maxPossibleScore = 9; // Max score in a 9-round game.
  const performanceRatio = playerScore / maxPossibleScore;

  let performanceCategory;
  if (performanceRatio >= 0.75) { // Example: 7+ wins out of 9
    performanceCategory = 'perfect';
  } else if (performanceRatio >= 0.4) { // Example: 4-6 wins
    performanceCategory = 'good';
  } else { // Less than 4 wins
    performanceCategory = 'poor';
  }

  const businessModal = document.getElementById('business-modal');
  const closeButton = document.getElementById('close-business');
  const cardOfferSection = document.getElementById('card-offer-section');
  const cardChoicesContainer = document.getElementById('card-choices');

  const performanceComment = BUSINESS_COMMENTS.performance[performanceCategory][
    Math.floor(Math.random() * BUSINESS_COMMENTS.performance[performanceCategory].length)
  ];

  document.getElementById('business-comment').textContent = performanceComment;

  // Clean up any existing event listeners on closeButton
  const newCloseButton = closeButton.cloneNode(true);
  closeButton.parentNode.replaceChild(newCloseButton, closeButton);

  let cardSelected = false; // Flag to ensure callback only happens once

  // Card offer logic - changed to always show cards regardless of performance
  cardChoicesContainer.innerHTML = ''; // Clear previous choices
  if (allCards && allCards.length > 0) {
    cardOfferSection.style.display = 'block';
    const shuffledCards = [...allCards].sort(() => 0.5 - Math.random());
    const uniqueOfferedCards = [];
    
    for (const card of shuffledCards) {
      // Skip null, awareness, and already offered cards
      if (!uniqueOfferedCards.some(offered => offered.id === card.id) && 
          card.id !== 'awareness' && 
          card.id !== 'null') {
        const cardCopy = {...card}; // Make copy to avoid reference issues
        
        // Initialize necessary properties
        if (cardCopy.id === 'allie') {
          cardCopy.selectVariant(); // Ensure Allie variants work
        }
        
        // Handle special cases that need defaults
        if (!cardCopy.power) cardCopy.power = 1;
        if (!cardCopy.ability) cardCopy.ability = 'No ability';
        if (!cardCopy.name) cardCopy.name = cardCopy.id;
        
        uniqueOfferedCards.push(cardCopy);
        if (uniqueOfferedCards.length >= 3) break;
      }
    }

    uniqueOfferedCards.forEach(card => {
      const cardElement = createMiniCardElement(card, (selectedCard) => {
        if (!cardSelected) {
          cardSelected = true;
          if (nextGameCallback) nextGameCallback(selectedCard);
          businessModal.style.display = 'none';
        }
      });
      cardChoicesContainer.appendChild(cardElement);
    });
  } else {
    cardOfferSection.style.display = 'none';
  }

  newCloseButton.addEventListener('click', () => {
    if (!cardSelected) { // If no card was selected (e.g. poor performance or user closes manually)
      cardSelected = true; // Prevent multiple calls
      if (nextGameCallback) nextGameCallback(null); // Pass null if no card selected
    }
    businessModal.style.display = 'none';
  });

  // Show the modal with a fade in animation
  businessModal.style.display = 'block';
  gsap.fromTo(businessModal, 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.3 }
  );
}