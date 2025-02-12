import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ card, small, vertical }) => {
  return (
    <View style={[styles.card, small && styles.smallCard, vertical && styles.verticalCard]}>
      <Text style={styles.rank}>{card.rank}</Text>
      <Text style={styles.suit}>{getSuitSymbol(card.suit)}</Text>
    </View>
  );
};

// Function to get Unicode symbols for suits
const getSuitSymbol = (suit) => {
  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  return suitSymbols[suit] || '?';
};

const styles = StyleSheet.create({
  card: {
    width: 50,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  smallCard: {
    width: 40,
    height: 60,
    fontSize: 12,
  },
  verticalCard: {
    transform: [{ rotate: '90deg' }],
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  suit: {
    fontSize: 16,
  },
});

export default Card;
