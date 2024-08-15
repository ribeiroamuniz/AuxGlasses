const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3001;

app.use(express.json());

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: '192.168.3.8',
  user: 'guigui',
  password: 'teste@123',
  database: 'auxglasses'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados.');
});

// Endpoint de teste para a raiz
app.get('/', (req, res) => {
  res.send('Servidor funcionando corretamente.');
});

// Endpoint de cadastro de usuário
app.post('/api/register', (req, res) => {
  const { nome, email, senha, endereco, data_nascimento } = req.body;

  bcrypt.hash(senha, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar a senha:', err);
      return res.status(500).json({ error: 'Erro ao criptografar a senha.' });
    }

    connection.query(
      'INSERT INTO usuario (nome, email, senha, endereco, data_nascimento) VALUES (?, ?, ?, ?, ?)',
      [nome, email, hashedPassword, endereco, data_nascimento],
      (error, results) => {
        if (error) {
          console.error('Erro ao registrar o usuário:', error);
          return res.status(500).json({ error: 'Erro ao registrar o usuário.' });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      }
    );
  });
});

// Endpoint de login de usuário
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  console.log('Recebido no login:', { email, senha });

  connection.query('SELECT * FROM usuario WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Erro ao buscar o usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar o usuário.' });
    }
    if (results.length === 0) {
      console.log('Usuário não encontrado!');
      return res.status(401).json({ message: 'Usuário não encontrado!' });
    }
    const user = results[0];

    console.log('Senha armazenada:', user.senha);

    bcrypt.compare(senha, user.senha, (err, isMatch) => {
      if (err) {
        console.error('Erro ao comparar a senha:', err);
        return res.status(500).json({ error: 'Erro ao comparar a senha.' });
      }
      console.log('Senha corresponde:', isMatch);

      if (!isMatch) {
        return res.status(401).json({ message: 'Senha incorreta!' });
      }
      const token = jwt.sign({ id: user.userid }, 'seu_segredo', { expiresIn: '1h' });
      console.log('Login bem-sucedido, token gerado:', token);
      res.json({ token });
    });
  });
});

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});