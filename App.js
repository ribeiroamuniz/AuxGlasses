import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import logoImage from './assets/ilustrationOne.png';
import RegisterScreen from './src/screens/RegisterScreen'; // Verifique o caminho correto
import WelcomeScreen from './src/screens/Welcome'; 

// Tela de Login
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn() {
    try {
      // Requisição de login para o backend
      const response = await axios.post('http://192.168.3.8:3001/api/login', {
        email,
        senha: password,
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Login bem-sucedido');
        // Navegar para a tela de boas-vindas após o login bem-sucedido
        navigation.navigate('Welcome');
      }
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro desconhecido');
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logoImage} />
      <StatusBar style="auto" />

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Insira aqui seu email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Informe sua senha"
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Register')}
      >
        Ainda não possuo conta
      </Text>
    </View>
  );
}

// Configuração da navegação
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Remove o cabeçalho de todas as telas
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C84FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 182,
    top: -23,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#111',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});