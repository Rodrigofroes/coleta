import { Marker } from 'react-native-maps';

const ColetaMarkers = ({ coletas, onMarkerPress }) => {
  return (
    <>
      {coletas.map((coleta) => {
        const latitude = coleta.latitude || coleta.lat;
        const longitude = coleta.longitude || coleta.long;

        if (latitude && longitude) {
          return (
            <Marker
              key={`marker-${coleta.id}`}
              coordinate={{ latitude, longitude }}
              title={coleta.title || coleta.endereco || 'Local de coleta'}
              description={coleta.description || ''}
              onCalloutPress={() => onMarkerPress && onMarkerPress(coleta)}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export default ColetaMarkers;

