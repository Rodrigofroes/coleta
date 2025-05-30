import * as Location from 'expo-location';
import { useEffect, useState, useRef, useCallback } from 'react'; // Adicionado useCallback
import { StyleSheet, Text, View } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import MapComponent from '../components/MapComponent';
import MapControls from '../components/MapControls';
import ColetaModal from '../components/ColetaModal';
import { useFocusEffect } from '@react-navigation/native'; // Importar useFocusEffect

export default function HomePage({ navigation }) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [coletas, setColetas] = useState([]);
    const [selectedColeta, setSelectedColeta] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const mapRef = useRef(null);

    const fetchColetas = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'coletas'));
            const coletasData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    latitude: data.latitude ? parseFloat(data.latitude) : null,
                    longitude: data.longitude ? parseFloat(data.longitude) : null,
                    lat: data.lat ? parseFloat(data.lat) : null,
                    long: data.long ? parseFloat(data.long) : null
                };
            });
            setColetas(coletasData);
        } catch (error) {
            console.error('Erro ao buscar coletas: ', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchColetas();
        }, [])
    );

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const zoomIn = () => {
        mapRef.current?.getCamera().then((camera) => {
            camera.zoom += 1;
            mapRef.current?.animateCamera(camera);
        });
    };

    const zoomOut = () => {
        mapRef.current?.getCamera().then((camera) => {
            camera.zoom -= 1;
            mapRef.current?.animateCamera(camera);
        });
    };

    const handleMarkerPress = (coleta) => {
        setSelectedColeta(coleta);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedColeta(null);
    };

    const handleDenunciaPress = () => {
        navigation.navigate('Denuncia');
    };

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapComponent
                location={location}
                coletas={coletas}
                mapRef={mapRef}
                onMarkerPress={handleMarkerPress}
            />
            <MapControls
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onDenunciaPress={handleDenunciaPress}
            />
            <ColetaModal
                visible={modalVisible}
                coleta={selectedColeta}
                onClose={handleCloseModal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
    }
});
