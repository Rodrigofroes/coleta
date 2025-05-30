import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MapControls = ({ onZoomIn, onZoomOut, onDenunciaPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onZoomIn}>
        <MaterialIcons name="add" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onZoomOut}>
        <MaterialIcons name="remove" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.dangerButton]}
        onPress={onDenunciaPress}
      >
        <MaterialIcons name="warning" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  dangerButton: {
    backgroundColor: 'red',
  }
});

export default MapControls;