// gpsapi/server.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // Porta para a API GPS

app.use(express.json());

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('API GPS está funcionando!');
});

// Endpoint para enviar dados GPS
app.post('/locations', async (req, res) => {
  const { latitude, longitude } = req.body;
  
  try {
    // Enviar dados para o servidor backend
    await axios.post('http://localhost:3001/api/location', { latitude, longitude });
    
    res.json({ status: 'Dados enviados com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API GPS rodando na porta ${port}`);
});