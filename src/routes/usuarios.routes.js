const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new User({ username, email, password: hashedPassword, rol });
    await nuevoUsuario.save();
    res.status(201).json({ msg: 'Usuario creado correctamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const filtros = { eliminado: false, ...req.query };
    const usuarios = await User.find(filtros).select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { username, email, rol } = req.body;
    const usuarioActualizado = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, rol },
      { new: true, runValidators: true }
    );
    if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const eliminadoPor = req.user._id;
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      {
        eliminado: true,
        eliminadoPor,
        fechaEliminacion: new Date()
      },
      { new: true }
    );
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ msg: 'Usuario eliminado lógicamente', usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
