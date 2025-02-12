import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button,TouchableOpacity  } from 'react-native';
import { BeloteGame, createDeck } from '../game/GameLogic';
import Card from '../components/Card';
import { useTranslation } from 'react-i18next';
import GameTable from '../components/GameTable';
import * as ScreenOrientation from 'expo-screen-orientation';

const lockToLandscape = async () => {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
};

const GameScreen = () => {
  const { t } = useTranslation();
  const [game, setGame] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [announces, setAnnounces] = useState([]);

  useEffect(() => {
    //initializeGame();
    lockToLandscape();
  }, []);

  const initializeGame = () => {
    const newGame = new BeloteGame(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
    newGame.shuffleDeck();
    newGame.dealCards();
    setGame(newGame);
    
    setPlayerHand(newGame.players[0].hand);
    console.log(newGame.players[0].hand)

  };
 
  const handleCardPlay = (card) => {
    if (!game || game.currentPlayer !== 0) return;

    game.playCard(0, card);
    setPlayerHand([...game.players[0].hand]);
    setAnnounces(game.checkAnnounces(game.players[0].hand));
  };

  return (
    <View style={styles.container}>
      {!game ? (
        <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
      ) : (
        <GameTable game={game} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E441E', // Dark green for card game ambiance
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#FFD700', // Gold color for a luxury feel
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E441E',
  },
});

export default GameScreen;


// Add styles and export