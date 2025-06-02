import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function DenunciaPage({ navigation }) {
  const [endereco, setEndereco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    // Solicitar permissões ao carregar a tela
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Permissão para câmera
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert(
        'Permissões necessárias',
        'Precisamos de permissão para acessar a câmera e galeria de fotos.'
      );
    }

    // Permissão para localização
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    if (locationPermission.status !== 'granted') {
      Alert.alert(
        'Permissão de localização',
        'Precisamos de permissão para acessar sua localização.'
      );
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      // Tentar obter o endereço a partir das coordenadas
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          const fullAddress = `${address.street || ''} ${address.streetNumber || ''}, ${address.district || ''}, ${address.city || ''} - ${address.region || ''}`.trim();
          setEndereco(fullAddress);
        }
      } catch (error) {
        console.log('Erro ao obter endereço:', error);
      }

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
      console.error('Erro ao obter localização:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const pickImage = () => {
    Alert.alert(
      'Selecionar Foto',
      'Escolha uma opção:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: openCamera },
        { text: 'Galeria', onPress: openGallery },
      ]
    );
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
    }
  };

  const submitDenuncia = async () => {
    if (!endereco.trim()) {
      Alert.alert('Erro', 'Por favor, informe o endereço');
      return;
    }

    if (!location) {
      Alert.alert('Erro', 'Por favor, obtenha sua localização atual');
      return;
    }

    setLoading(true);

    try {
      const denunciaData = {
        endereco: endereco.trim(),
        descricao: descricao.trim(),
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
        lat: location.coords.latitude.toString(),
        long: location.coords.longitude.toString(),
        tipo: 'denuncia',
        timestamp: new Date().toISOString(),
        img: foto ? foto.uri : null,
      };

      await addDoc(collection(db, 'coletas'), denunciaData);

      Alert.alert(
        'Sucesso!',
        'Sua denúncia foi enviada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error('Erro ao enviar denúncia:', error);
      Alert.alert('Erro', 'Não foi possível enviar a denúncia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Denúncia</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço *</Text>
          <View style={styles.addressContainer}>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Digite o endereço do problema"
              multiline
            />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <MaterialIcons name="my-location" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>
          {location && (
            <Text style={styles.locationInfo}>
              📍 Localização obtida: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o problema encontrado (opcional)"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Foto</Text>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            {foto ? (
              <Image source={{ uri: foto.uri }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialIcons name="camera-alt" size={40} color="#999" />
                <Text style={styles.photoText}>Toque para adicionar foto</Text>
              </View>
            )}
          </TouchableOpacity>
          {foto && (
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => setFoto(null)}
            >
              <Text style={styles.removePhotoText}>Remover foto</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={submitDenuncia}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialIcons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Enviar Denúncia</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressInput: {
    flex: 1,
    marginRight: 10,
    minHeight: 50,
  },
  locationButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  locationInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  removePhotoButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  removePhotoText: {
    color: '#ff4444',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
