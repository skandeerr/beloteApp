import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../components/Card';

const cardBack = require('../assets/cardback.png'); // Ensure you have a card back image

const GameTable = ({ game }) => {
  if (!game || !game.players) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    );
  }

  // Destructure the four players
  const [player1, player2, player3, player4] = game.players;

  return (
    <View style={styles.container}>
      {/* Top Player (Player 3) */}
      <View style={styles.topPlayer}>
        <Icon name="person" size={40} color="#FFF" />
        <Text style={styles.playerName}>{player3.name}</Text>
      </View>

      {/* Center Play Area */}
      <View style={styles.playArea}>
        {/* Left Player (Player 2) - Standing Upright */}
        <View style={styles.sidePlayer}>
          <Icon name="person" size={40} color="#FFF" />
          <Text style={styles.playerName}>{player2.name}</Text>
        </View>

        {/* Central Game Space (Oval Poker Table) */}
        <View style={styles.gameSpace}>
          {/* You could later add played cards here */}
          <Text style={styles.placeholderText}>Play Area</Text>
        </View>

        {/* Right Player (Player 4) - Standing Upright */}
        <View style={styles.sidePlayer}>
          <Icon name="person" size={40} color="#FFF" />
          <Text style={styles.playerName}>{player4.name}</Text>
        </View>
      </View>

      {/* Bottom Player (Player 1 - Visible Cards) */}
      <View style={styles.bottomPlayer}>
        <Text style={styles.playerName}>{player1.name}</Text>
        <View style={styles.hand}>
          {player1.hand.map((card, index) => (
            <Card 
              key={index}
              card={card}
              style={styles.playerCard}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E441E', // Dark green felt
    justifyContent: 'space-between',
    padding: 10,
  },
  playArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  topPlayer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomPlayer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  sidePlayer: {
    alignItems: 'center',
    // Removed any rotation so they stand upright
    marginHorizontal: 10,
  },
  gameSpace: {
    width: 300,
    height: 150,
    backgroundColor: '#2A5A2A',
    borderRadius: 75, // Half of the height for an oval shape
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  hand: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  playerCard: {
    width: 60,
    height: 90,
    margin: 5,
  },
  playerName: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 5,
  },
  placeholderText: {
    color: '#FFD700',
    fontSize: 20,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E441E',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 20,
  },
});

export default GameTable;
