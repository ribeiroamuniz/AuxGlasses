import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Modal, TextInput, Dimensions, Alert } from 'react-native';
import logoTwo from '../../assets/logoTwo.png';
import ImgWelcome from '../../assets/ImgWelcome.png';
import manYdog from '../../assets/manYdog.png';
import Poxa from '../../assets/Poxa!.png';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [lastLocationTime, setLastLocationTime] = useState('');
  const [isDeviceNamed, setIsDeviceNamed] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleOpenInputModal = () => {
    setInputModalVisible(true);
  };

  const handleCloseInputModal = async () => {
    setInputModalVisible(false);
    await getLocation();
    setMapModalVisible(true);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    setLastLocationTime(new Date().toISOString()); // Armazena a última hora de visualização
  };

  const handleCloseMapModal = () => {
    setMapModalVisible(false);
    setNameModalVisible(true);
  };

  const handleCloseNameModal = async () => {
    setNameModalVisible(false);
    if (!deviceName.trim()) {
      setDeviceName(inputCode);
    }

    try {
      await AsyncStorage.setItem('deviceName', deviceName);
      await AsyncStorage.setItem('lastLocationTime', lastLocationTime);
      setIsDeviceNamed(true); // Atualiza o estado indicando que o dispositivo foi nomeado
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  useEffect(() => {
    if (inputModalVisible) {
      getLocation();
    }
  }, [inputModalVisible]);

  // Função para calcular o tempo desde a última localização
  const getTimeSinceLastLocation = () => {
    if (!lastLocationTime) return '';
    const now = new Date();
    const lastLocationDate = new Date(lastLocationTime);
    const diffInSeconds = Math.floor((now - lastLocationDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const remainingSeconds = diffInSeconds % 60;
    return `Última visualização há ${diffInMinutes} min ${remainingSeconds} s atrás`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Image style={styles.logo} source={logoTwo} />
      </View>

      <View style={styles.mainContent}>
        {/* Conteúdo principal da tela */}
        {isDeviceNamed ? (
          <View style={styles.deviceInfoContainer}>
            <View style={styles.deviceInfoTextContainer}>
              <Text style={styles.deviceText}>Dispositivo: {deviceName}</Text>
              <Text style={styles.deviceText}>{getTimeSinceLastLocation()}</Text>
            </View>
            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playButtonText}>▶</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Image source={Poxa} style={styles.Poxa} />
            <TouchableOpacity style={styles.addButton} onPress={handleOpenInputModal}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Image source={ImgWelcome} style={styles.ImgWelcome} />
            <Image source={manYdog} style={styles.manYdog} />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={inputModalVisible}
        animationType="slide"
        onRequestClose={handleCloseInputModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.inputModalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseInputModal}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Informe abaixo o código presente na lateral direita interna de seu aparelho</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#999"
              onChangeText={setInputCode}
              value={inputCode}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleCloseInputModal}>
              <Text style={styles.confirmButtonText}>✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={mapModalVisible}
        animationType="slide"
        onRequestClose={handleCloseMapModal}
      >
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location ? location.latitude : 37.78825,
              longitude: location ? location.longitude : -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {location && (
              <Marker coordinate={location} pinColor="red" />
            )}
          </MapView>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseMapModal}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={nameModalVisible}
        animationType="slide"
        onRequestClose={handleCloseNameModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.inputModalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseNameModal}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Nomeie seu dispositivo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do dispositivo"
              placeholderTextColor="#999"
              onChangeText={setDeviceName}
              value={deviceName}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleCloseNameModal}>
              <Text style={styles.confirmButtonText}>✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    height: 80,
    backgroundColor: '#1C84FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    position: 'relative',
  },
  logo: {
    top: 20,
    width: 90,
    height: 50,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  logoTwo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  ImgWelcome: {
    margin: 20,
    resizeMode: 'contain',
    width: '100%',
    height: undefined,
    aspectRatio: 3,
  },
  manYdog: {
    margin: 20,
    resizeMode: 'contain',
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1C84FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 40,
  },
  Poxa: {
    width: width * 1.0,
    height: height * 0.6,
    resizeMode: 'contain',
    alignSelf: 'center',
    position: 'absolute',
    top: height * 0.2,
  },
  inputModalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  confirmButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1C84FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButtonText: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 40,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  map: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 10,
  },
  deviceInfoContainer: {
    top: '-80%',
    width: width * 0.9, // Maior largura
    paddingVertical: 10, // Ajusta o padding para um melhor ajuste
    paddingRight: 70, // Adiciona padding à direita para o botão de play
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row', // Alinha os itens horizontalmente
    alignItems: 'center',
    marginTop: 20, // Margem superior
  },
  deviceInfoTextContainer: {
    flex: 1,
    marginLeft: 10, // Adiciona margem à esquerda do texto
    alignItems: 'flex-start', // Alinha os textos à esquerda
  },
  deviceText: {
    fontSize: 14, // Fonte menor
    marginBottom: 5, // Menor margem inferior
    textAlign: 'left', // Alinha o texto à esquerda
  },
  playButton: {
    width: 40, // Botão menor
    height: 40, // Botão menor
    borderRadius: 20, // Borda arredondada para o botão menor
    backgroundColor: '#1C84FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    right: 10, // Alinha o botão à direita
  },
  playButtonText: {
    fontSize: 24, // Tamanho menor para o ícone de play
    color: '#fff',
  },
});

export default WelcomeScreen;