import React, { useState } from 'react';
import { View, Text, Slider, StyleSheet, Modal, Button } from 'react-native';

const ANNOUNCE_VALUES = [90, 100, 110, 120, 130, 140, 150, 160, 250, 270, 'Pass'];

const AnnounceModal = ({ visible, onAnnounce }) => {
  const [selectedValue, setSelectedValue] = useState(90);

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Make Your Announce</Text>
          
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={ANNOUNCE_VALUES.length - 1}
            step={1}
            onValueChange={value => setSelectedValue(ANNOUNCE_VALUES[Math.round(value)])}
          />
          
          <Text style={styles.selectedValue}>
            {selectedValue === 'Pass' ? 'Pass' : `${selectedValue} Points`}
          </Text>
          
          <Button
            title="Confirm"
            onPress={() => onAnnounce(selectedValue)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10
  },
  slider: { height: 40 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 10 },
  selectedValue: { textAlign: 'center', fontSize: 18, marginVertical: 10 }
});

export default AnnounceModal;