const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json()); // Para permitir o parsing de JSON no corpo das requisições

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'guigui',
  password: 'teste@123',
  database: 'auxglasses'
});

// Conectar ao banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados como ID ' + connection.threadId);
});

// Rotas para Usuários

// Criar um novo usuário
app.post('/usuarios', (req, res) => {
  const { email, data_nascimento, nome } = req.body;

  const query = 'INSERT INTO usuario (email, data_nascimento, nome) VALUES (?, ?, ?)';
  connection.query(query, [email, data_nascimento, nome], (err, results) => {
    if (err) {
      console.error('Erro ao inserir usuário: ' + err.stack);
      res.status(500).json({ error: 'Erro ao inserir usuário' });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

// Criar um novo usuário (adicionando a nova rota)
app.post('/adicionarUsuario', (req, res) => {
  const { email, data_nascimento, nome } = req.body;

  const query = 'INSERT INTO usuario (email, data_nascimento, nome) VALUES (?, ?, ?)';
  connection.query(query, [email, data_nascimento, nome], (err, results) => {
    if (err) {
      console.error('Erro ao inserir usuário: ' + err.stack);
      res.status(500).json({ error: 'Erro ao inserir usuário' });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

// Ler todos os usuários
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuario';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários: ' + err.stack);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
      return;
    }
    res.json(results);
  });
});

// Ler um usuário por ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM usuario WHERE userid = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário: ' + err.stack);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    res.json(results[0]);
  });
});

// Atualizar um usuário por ID
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { email, data_nascimento, nome } = req.body;

  const query = 'UPDATE usuario SET email = ?, data_nascimento = ?, nome = ? WHERE userid = ?';
  connection.query(query, [email, data_nascimento, nome, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar usuário: ' + err.stack);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    res.json({ message: 'Usuário atualizado com sucesso' });
  });
});

// Deletar um usuário por ID
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuario WHERE userid = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar usuário: ' + err.stack);
      res.status(500).json({ error: 'Erro ao deletar usuário' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  });
});

// Rotas para Dispositivos

// Criar um novo dispositivo
app.post('/dispositivos', (req, res) => {
  const { oculos_id, codigo } = req.body;

  const query = 'INSERT INTO dispositivo (oculos_id, codigo) VALUES (?, ?)';
  connection.query(query, [oculos_id, codigo], (err, results) => {
    if (err) {
      console.error('Erro ao inserir dispositivo: ' + err.stack);
      res.status(500).json({ error: 'Erro ao inserir dispositivo' });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

// Ler todos os dispositivos
app.get('/dispositivos', (req, res) => {
  const query = 'SELECT * FROM dispositivo';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dispositivos: ' + err.stack);
      res.status(500).json({ error: 'Erro ao buscar dispositivos' });
      return;
    }
    res.json(results);
  });
});

// Ler um dispositivo por ID
app.get('/dispositivos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM dispositivo WHERE oculos_id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dispositivo: ' + err.stack);
      res.status(500).json({ error: 'Erro ao buscar dispositivo' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Dispositivo não encontrado' });
      return;
    }
    res.json(results[0]);
  });
});

// Atualizar um dispositivo por ID
app.put('/dispositivos/:id', (req, res) => {
  const { id } = req.params;
  const { codigo } = req.body;

  const query = 'UPDATE dispositivo SET codigo = ? WHERE oculos_id = ?';
  connection.query(query, [codigo, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar dispositivo: ' + err.stack);
      res.status(500).json({ error: 'Erro ao atualizar dispositivo' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Dispositivo não encontrado' });
      return;
    }
    res.json({ message: 'Dispositivo atualizado com sucesso' });
  });
});

// Deletar um dispositivo por ID
app.delete('/dispositivos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM dispositivo WHERE oculos_id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar dispositivo: ' + err.stack);
      res.status(500).json({ error: 'Erro ao deletar dispositivo' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Dispositivo não encontrado' });
      return;
    }
    res.json({ message: 'Dispositivo deletado com sucesso' });
  });
});

// Definir a porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});