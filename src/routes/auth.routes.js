const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, rol });
    await newUser.save();
    res.status(201).json({ msg: 'Usuario creado correctamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password)
    const user = await User.findOne({ username, eliminado: false });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { _id: user._id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, username: user.username, rol: user.rol });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
