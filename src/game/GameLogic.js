export const createDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    return suits.flatMap(suit => 
      ranks.map(rank => ({
        suit,
        rank,
        value: getCardValue(rank),
        id: `${suit}-${rank}`,
      }))
    );
  };
  export const organizeHand = (hand) => {
    const suitsOrder = ['clubs', 'diamonds', 'hearts', 'spades'];
    const rankOrder = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    return suitsOrder.map(suit => ({
      suit,
      cards: hand
        .filter(card => card.suit === suit)
        .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank))
    })).filter(group => group.cards.length > 0);
  };
  
  const getCardValue = (rank) => {
    const values = { '7': 0, '8': 0, '9': 14, '10': 10, 'J': 20, 'Q': 3, 'K': 4, 'A': 11 };
    return values[rank];
  };
  
  // src/game/GameLogic.js
export class BeloteGame {
  constructor(players) {
    this.players = players.map(name => ({ name, hand: [], tricksWon: [] }));
    this.deck = createDeck();
    this.trumpSuit = null;
    this.currentPlayer = 0;
    this.announces = [];
    this.scores = { team1: 0, team2: 0 };
    this.currentTrick = [];
    this.playedCards = [];
    this.hand = [];
  }

  startGame() {
    this.shuffleDeck();
    this.dealCards();
    this.selectTrumpSuit();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCards() {
    this.players.forEach(player => {
      player.hand = this.deck.splice(0, 8);
    });
  }

  selectTrumpSuit(suit) {
    this.trumpSuit = suit;
  }

  playCard(playerIndex, card) {
    const player = this.players[playerIndex];
    if (!player.hand.includes(card)) return;

    this.currentTrick.push({ card, playerIndex });
    player.hand = player.hand.filter(c => c.id !== card.id);

    if (this.currentTrick.length === 4) {
      this.resolveTrick();
    }
  }

  resolveTrick() {
    const winningCard = this.determineWinningCard();
    const winningPlayer = this.players[winningCard.playerIndex];
    winningPlayer.tricksWon.push(...this.currentTrick);

    this.currentTrick = [];
    this.currentPlayer = winningCard.playerIndex;
  }

  determineWinningCard() {
    const leadSuit = this.currentTrick[0].card.suit;
    const trumpCards = this.currentTrick.filter(c => c.card.suit === this.trumpSuit);

    if (trumpCards.length > 0) {
      return trumpCards.reduce((max, curr) => 
        curr.card.value > max.card.value ? curr : max
      );
    } else {
      return this.currentTrick.filter(c => c.card.suit === leadSuit)
        .reduce((max, curr) => 
          curr.card.value > max.card.value ? curr : max
        );
    }
  }

  calculateScores() {
    // Implement scoring logic based on Belote rules
  }
  handleAnnounce(playerIndex, announceValue) {
    if (announceValue === 'Pass') {
      this.announces.push({ playerIndex, value: 0 });
    } else {
      this.announces.push({ playerIndex, value: announceValue });
    }
    
    if (this.announces.length === 4) {
      this.resolveAnnounces();
    }
  }

  resolveAnnounces() {
    const validAnnounces = this.announces.filter(a => a.value !== 0);
    if (validAnnounces.length === 0) {
      this.startNewRound();
      return;
    }

    const highestAnnounce = validAnnounces.reduce((max, curr) => 
      curr.value > max.value ? curr : max
    );
    
    this.scores[highestAnnounce.playerIndex % 2 === 0 ? 'team1' : 'team2'] += highestAnnounce.value;
    this.startNewRound();
  }

  startNewRound() {
    this.deck = createDeck();
    this.shuffleDeck();
    this.dealCards();
    this.announces = [];
    this.currentPlayer = 0;
  }
}
     
  