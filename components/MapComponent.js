import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import ColetaMarkers from './ColetaMarkers';

const MapComponent = ({ location, coletas, mapRef, onMarkerPress }) => {
  // Definir uma região padrão caso a localização não esteja disponível
  const defaultRegion = {
    latitude: -22.0729042,
    longitude: -51.4666111,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : defaultRegion;

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
      followsUserLocation={true}
      showsMyLocationButton={true}
    >
      <ColetaMarkers coletas={coletas} onMarkerPress={onMarkerPress} />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapComponent;


