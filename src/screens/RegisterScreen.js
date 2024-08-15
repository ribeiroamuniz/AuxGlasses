import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import ratinho from '../../assets/ratinho.png';
import cadastrese from '../../assets/cadastrese.png';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProhibited, setIsProhibited] = useState(false);

  const handleRegister = async () => {
    // Verificar se todos os campos estão preenchidos
    if (!name || !birthDate || !cpf || !email || !password || !confirmPassword) {
      setErrorMessage('Todos os campos são obrigatórios.');
      return;
    }

    // Verificar se a senha e a confirmação coincidem
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    // Verificar se a data de nascimento é válida
    if (!isValidDate(birthDate)) {
      setErrorMessage('Data de nascimento inválida.');
      return;
    }

    // Verificar se a pessoa é maior de idade
    if (!isOldEnough(birthDate)) {
      setIsProhibited(true);
      return;
    }

    // Se tudo estiver correto, envia os dados para o backend
    try {
      const response = await fetch('http://192.168.3.8:3001/api/register', { // Ajuste a URL conforme necessário
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: name,
          email: email,
          senha: password,
          endereco: cpf, // Adapte conforme necessário
          data_nascimento: birthDate
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // Registro bem-sucedido
        navigation.navigate('Welcome');
      } else {
        // Exibe mensagem de erro
        setErrorMessage(result.message || 'Erro desconhecido.');
      }
    } catch (error) {
      setErrorMessage('Erro na conexão com o servidor.');
      console.error('Erro na conexão com o servidor:', error);
    }
  };

  const isValidDate = (dateString) => {
    // Verifica se a data está no formato DD/MM/YYYY
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    // Separa a data em dia, mês e ano
    const [day, month, year] = dateString.split('/').map(Number);

    // Verifica se o mês é válido (1-12)
    if (month < 1 || month > 12) return false;

    // Cria um objeto de data e verifica se a data é válida
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  };

  const isOldEnough = (birthDate) => {
    const [day, month, year] = birthDate.split('/').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const formatBirthDate = (dateString) => {
    // Adiciona barras à data no formato DD/MM/YYYY
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (regex.test(dateString)) return dateString;

    // Remove caracteres não numéricos e adiciona barras
    const numbers = dateString.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={cadastrese} />
      
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Nome Completo"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setBirthDate(formatBirthDate(text))}
        value={birthDate}
        placeholder="Data de Nascimento (DD/MM/YYYY)"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        maxLength={10}
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

      {isProhibited && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={ratinho} style={styles.mouseImage} />
              <Text style={styles.modalText}>
                A equipe Auxiliary Glasses parabeniza você pela sua bondade em querer cuidar dos mais necessitados; seu altruísmo é admirável!
                No entanto, devido às nossas políticas, o uso do nosso app não está disponível para usuários menores de 18 anos. 
                Agradecemos sua compreensão e esperamos que continue cultivando esse espírito, pois no futuro, teremos prazer em recebê-lo em nossa equipe!
              </Text>
              <Text style={styles.modalLink}>Tem 18 anos ou mais? <Text style={styles.linkText}>CLIQUE AQUI</Text></Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C84FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
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
  logo: {
    width: 270,
    height: 53,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  mouseImage: {
    width: 100,
    height: 115,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#111',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLink: {
    fontSize: 14,
    color: '#111',
    textAlign: 'center',
  },
  linkText: {
    color: '#1C84FF',
  },
});

export default RegisterScreen;