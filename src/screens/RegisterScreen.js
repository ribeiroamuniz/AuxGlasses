import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import cadastrese from '../../assets/cadastrese.png';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleRegister() {
    // Lógica para o registro do usuário
    const userData = { name, birthDate, cpf, email, password, confirmPassword };
    console.log(userData);
  }

  return (
    <View style={styles.container}>

      <Image style={styles.logo} source={cadastrese} />

      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Nome Completo"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        onChangeText={setBirthDate}
        value={birthDate}
        placeholder="Data de Nascimento"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        onChangeText={setCpf}
        value={cpf}
        placeholder="CPF"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirmar Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C84FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    top: 25,
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    top: 45,
    width: '100%',
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
  logo:{
    top: -15, 
    width: 270,
    height: 53,
  },
});