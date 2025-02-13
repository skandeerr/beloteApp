// Utility Functions
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getCardValue = (rank) => {
  const values = { '7': 0, '8': 0, '9': 14, '10': 10, 'J': 20, 'Q': 3, 'K': 4, 'A': 11 };
  return values[rank];
};

export const createDeck = () => {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  // Generate a deck with unique IDs for each card.
  return suits.flatMap(suit =>
    ranks.map(rank => ({
      suit,
      rank,
      value: getCardValue(rank),
      id: `${suit}-${rank}-${generateUUID()}`
    }))
  );
};

export const organizeHand = (hand) => {
  const suitsOrder = ['clubs', 'diamonds', 'hearts', 'spades'];
  const rankOrder = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  // Sort first by suit order, then by rank order.
  return hand.sort((a, b) => {
    const suitComparison = suitsOrder.indexOf(a.suit) - suitsOrder.indexOf(b.suit);
    if (suitComparison !== 0) return suitComparison;
    return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
  });
};

// Belote Game Logic Class
export class BeloteGame {
  constructor(playerNames) {
    // Ensure exactly 4 players are provided.
    if (playerNames.length !== 4) {
      throw new Error('Belote requires exactly 4 players.');
    }
    // Initialize players; assign teams (players 0 & 2: team1; players 1 & 3: team2)
    this.players = playerNames.map((name, index) => ({
      name,
      team: (index % 2 === 0) ? 'team1' : 'team2',
      hand: [],
      tricksWon: []
    }));
    // Initialize game state.
    this.deck = createDeck();
    this.trumpSuit = null;
    this.currentPlayer = 0;
    this.announces = []; // Stores announcements as objects: { playerIndex, value }
    this.scores = { team1: 0, team2: 0 };
    this.currentTrick = []; // Array of { card, playerIndex } for the current trick.
    this.playedCards = []; // Optional: All cards played in the round.
  }

  // Start or restart a game round.
  startGame() {
    this.deck = createDeck();
    this.validateDeckUnique();
    this.shuffleDeck();
    this.dealCards();
    this.announces = [];
    this.currentTrick = [];
    this.currentPlayer = 0;
    // Optionally, set trump suit here.
    // e.g., this.selectTrumpSuit('hearts');
  }

  // Ensure no duplicate cards exist in the deck.
  validateDeckUnique() {
    const ids = new Set();
    this.deck.forEach(card => {
      if (ids.has(card.id)) {
        throw new Error(`Duplicate card detected in deck: ${card.id}`);
      }
      ids.add(card.id);
    });
  }

  // Shuffle the deck using Fisher-Yates algorithm.
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  // Deal 8 cards to each player from the deck.
  dealCards() {
    if (this.deck.length < this.players.length * 8) {
      throw new Error('Not enough cards in deck to deal.');
    }
    this.players.forEach(player => {
      // Deal 8 cards by splicing from the deck.
      player.hand = this.deck.splice(0, 8);
      // Organize (sort) the hand.
      player.hand = organizeHand(player.hand);
      // Ensure all 8 cards are unique.
      const cardIds = new Set(player.hand.map(c => c.id));
      if (cardIds.size !== 8) {
        throw new Error(`Duplicate cards in hand for player ${player.name}`);
      }
    });
  }

  // Optionally select a trump suit.
  selectTrumpSuit(suit) {
    const validSuits = ['hearts', 'diamonds', 'clubs', 'spades'];
    if (validSuits.includes(suit)) {
      this.trumpSuit = suit;
    } else {
      throw new Error('Invalid trump suit.');
    }
  }

  // Player plays a card.
  playCard(playerIndex, card) {
    const player = this.players[playerIndex];
    const cardIndex = player.hand.findIndex(c => c.id === card.id);
    if (cardIndex === -1) return; // Card not found in player's hand.
    const playedCard = player.hand.splice(cardIndex, 1)[0];
    this.currentTrick.push({ card: playedCard, playerIndex });
    this.playedCards.push(playedCard);
    
    // If 4 cards have been played, resolve the trick.
    if (this.currentTrick.length === 4) {
      this.resolveTrick();
    } else {
      // Set the next player's turn.
      this.currentPlayer = (playerIndex + 1) % 4;
    }
  }

  // Resolve a trick when 4 cards have been played.
  resolveTrick() {
    const winningData = this.determineWinningCard();
    const winningPlayer = this.players[winningData.playerIndex];
    // Award the trick to the winning player.
    winningPlayer.tricksWon.push(...this.currentTrick.map(item => item.card));
    // Clear current trick and set turn to the winner.
    this.currentTrick = [];
    this.currentPlayer = winningData.playerIndex;
  }

  // Determine the winning card in the current trick.
  determineWinningCard() {
    // The first card played sets the lead suit.
    const leadSuit = this.currentTrick[0].card.suit;
    // Start with cards that follow the lead suit.
    let validCards = this.currentTrick.filter(item => item.card.suit === leadSuit);
    // If a trump suit is set and one or more trump cards are played, consider only trump cards.
    if (this.trumpSuit) {
      const trumpCards = this.currentTrick.filter(item => item.card.suit === this.trumpSuit);
      if (trumpCards.length > 0) {
        validCards = trumpCards;
      }
    }
    // Determine the highest card among valid cards based on the card value.
    return validCards.reduce((max, curr) => 
      curr.card.value > max.card.value ? curr : max
    );
  }

  // Calculate scores for each team based on tricks won.
  calculateScores() {
    // Example: Sum up the values of cards in tricks won.
    // You can modify this based on specific Belote scoring rules.
    this.players.forEach(player => {
      const trickPoints = player.tricksWon.reduce((sum, card) => sum + card.value, 0);
      this.scores[player.team] += trickPoints;
    });
  }

  // Handle a player's announcement (bid) or pass.
  handleAnnounce(playerIndex, announceValue) {
    // If the player passes, treat it as a 0 bid.
    const value = (announceValue === 'Pass') ? 0 : announceValue;
    this.announces.push({ playerIndex, value });
    
    // Once all 4 players have announced, resolve the bids.
    if (this.announces.length === 4) {
      this.resolveAnnounces();
    }
  }

  // Resolve announcements: determine highest bid and assign points.
  resolveAnnounces() {
    const validAnnounces = this.announces.filter(a => a.value > 0);
    // If all players passed, no bid; start a new round.
    if (validAnnounces.length === 0) {
      this.startNewRound();
      return;
    }
    // Determine the highest bid. In case of a tie, the first bid wins.
    const highest = validAnnounces.reduce((max, curr) => curr.value > max.value ? curr : max);
    // Add the bid value to the winning team’s score.
    const winningTeam = (highest.playerIndex % 2 === 0) ? 'team1' : 'team2';
    this.scores[winningTeam] += highest.value;
    this.startNewRound();
  }

  // Start a new round: reinitialize deck, reshuffle, and redeal.
  startNewRound() {
    this.deck = createDeck();
    this.validateDeckUnique();
    this.shuffleDeck();
    this.dealCards();
    this.announces = [];
    this.currentTrick = [];
    this.currentPlayer = 0;
    // Optionally, you might clear tricksWon to start scoring anew,
    // or accumulate over rounds based on your game rules.
  }
}
