require('dotenv').config();  

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB', err));

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const platosRoutes = require('./routes/platos.routes');
app.use('/api/platos', platosRoutes);

const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor backend en puerto ${PORT}`));
