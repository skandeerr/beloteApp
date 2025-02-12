import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BeloteGame, createDeck } from './src/game/GameLogic';
import Card from './src/components/Card';
import { useTranslation } from 'react-i18next';
//import 'react-native-set-immediate';
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (callback, ...args) => setTimeout(callback, 0, ...args);
}


const App = () => {
  const { t } = useTranslation();
  const [game, setGame] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [announces, setAnnounces] = useState([]);

  // Initialize the game
  useEffect(() => {
    
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newGame = new BeloteGame(['Player 1', 'Player 2']);
    newGame.shuffleDeck();
    newGame.dealCards();
    setGame(newGame);
    setPlayerHand(newGame.players[0].hand);
    
    setAnnounces([]);
  };

  // Handle card selection
  const handleCardPlay = (card) => {
    if (!game || game.currentPlayer !== 0) return;

    game.playCard(0, card);
    setPlayerHand([...game.players[0].hand]);
    setAnnounces(game.checkAnnounces(game.players[0].hand));
  };

  // Render player's hand
  const renderHand = () => {
    return playerHand.map((card) => (
      <Card
        key={card.id}
        card={card}
        onPress={() => handleCardPlay(card)}
        disabled={!game || game.currentPlayer !== 0}
      />
    ));
  };

  // Render announcements
  const renderAnnounces = () => {
    return announces.map((announce, index) => (
      <Text key={index} style={styles.announceText}>
        {t(`announcements.${announce.type}`, { value: announce.value })}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('belote')}</Text>

      {/* Announcements */}
      <View style={styles.announceContainer}>
        {renderAnnounces()}
      </View>

      {/* Player's Hand */}
      <View style={styles.handContainer}>
        {renderHand()}
      </View>

      {/* New Game Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={initializeGame}
      >
        <Text style={styles.buttonText}>{t('newGame')}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  announceContainer: {
    marginBottom: 20,
  },
  announceText: {
    fontSize: 16,
    color: '#333',
  },
  handContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;