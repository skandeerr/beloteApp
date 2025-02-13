import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  Modal,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, ref, set, push, get } from '../../services/firebase';
import * as Clipboard from 'expo-clipboard';

const RoomManager = () => {
  const navigation = useNavigation();
  const [roomCode, setRoomCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  // New state to manage the room modal
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState(null);

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

      // Save the created room id and show the modal
      setCreatedRoomId(roomId);
      setRoomModalVisible(true);
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
      const snapshot = await get(roomRef);
      if (!snapshot.exists()) {
        Alert.alert('Error', 'Invalid room code.');
      } else {
        const room = snapshot.val();
        if (room.players.length >= 4) {
          Alert.alert('Error', 'Room is full.');
        } else {
          // Add the new player to the room
          const updatedPlayers = [
            ...room.players,
            { id: `player${room.players.length + 1}`, name: `Player ${room.players.length + 1}` }
          ];
          await set(ref(db, `rooms/${roomCode}/players`), updatedPlayers);

          // Navigate to the game screen
          navigation.navigate('Game', { roomId: roomCode });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join room. Please try again.');
      console.error(error);
    } finally {
      setJoining(false);
    }
  };

  // Function to copy the room code to the clipboard
  const copyRoomCode = async () => {
    if (createdRoomId) {
      await Clipboard.setStringAsync(createdRoomId);
      Alert.alert('Copied!', 'Room code copied to clipboard.');
    }
  };

  // Function to continue after showing the room modal
  const continueToGame = () => {
    setRoomModalVisible(false);
    navigation.navigate('Game', { roomId: createdRoomId });
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

      {/* Modal for Room Code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={roomModalVisible}
        onRequestClose={() => setRoomModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Room Created!</Text>
            <Text style={styles.modalText}>Room Code: {createdRoomId}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyRoomCode}>
              <Text style={styles.copyButtonText}>Copy Room Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueButton} onPress={continueToGame}>
              <Text style={styles.continueButtonText}>Continue to Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  copyButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  copyButtonText: {
    color: '#1E441E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#1E441E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoomManager;
