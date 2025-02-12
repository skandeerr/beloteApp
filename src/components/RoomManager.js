import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import { db, ref, set, onValue } from '../../services/firebase';
import { useNavigation } from '@react-navigation/native';
import { db, ref, set, onValue, push } from '../../services/firebase';


const RoomManager = () => {
  const navigation = useNavigation();
  const [roomCode, setRoomCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  // Function to create a new room
  const createRoom = async () => {
    setCreating(true);
    try {
      const roomRef = ref(db, 'rooms');
      const newRoomRef = push(roomRef); // Automatically generates a unique room ID
      const roomId = newRoomRef.key;

      // Initialize room data
      await set(newRoomRef, {
        id: roomId,
        createdAt: new Date().toISOString(),
        players: [{ id: 'player1', name: 'Player 1' }], // Add the first player
        status: 'waiting',
        game: null,
      });

      // Navigate to the game screen
      navigation.navigate('Game', { roomId });
    } catch (error) {
      Alert.alert('Error', 'Failed to create room. Please try again.');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  // Function to join an existing room
  const joinRoom = async () => {
    if (!roomCode) {
      Alert.alert('Error', 'Please enter a room code.');
      return;
    }

    setJoining(true);
    try {
      const roomRef = ref(db, `rooms/${roomCode}`);
      onValue(roomRef, (snapshot) => {
        if (!snapshot.exists()) {
          Alert.alert('Error', 'Invalid room code.');
        } else {
          const room = snapshot.val();
          if (room.players.length >= 4) {
            Alert.alert('Error', 'Room is full.');
          } else {
            // Add the new player to the room
            const updatedPlayers = [...room.players, { id: `player${room.players.length + 1}`, name: `Player ${room.players.length + 1}` }];
            set(ref(db, `rooms/${roomCode}/players`), updatedPlayers);

            // Navigate to the game screen
            navigation.navigate('Game', { roomId: roomCode });
          }
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to join room. Please try again.');
      console.error(error);
    } finally {
      setJoining(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Create Room Button */}
      <Button
        title={creating ? "Creating Room..." : "Create Room"}
        onPress={createRoom}
        disabled={creating}
      />

      {/* Separator Text */}
      <Text style={styles.orText}>OR</Text>

      {/* Room Code Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Room Code"
        value={roomCode}
        onChangeText={setRoomCode}
        editable={!joining}
      />

      {/* Join Room Button */}
      <Button
        title={joining ? "Joining Room..." : "Join Room"}
        onPress={joinRoom}
        disabled={joining || !roomCode}
      />

      {/* Loading Indicator */}
      {(creating || joining) && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default RoomManager;