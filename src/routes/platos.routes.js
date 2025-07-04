const express = require('express');
const Plato = require('../models/Plato');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const plato = new Plato(req.body);
    await plato.save();
    res.status(201).json(plato);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const filtros = { eliminado: false, ...req.query };
    const platos = await Plato.find(filtros);
    res.json(platos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const platoActualizado = await Plato.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!platoActualizado) return res.status(404).json({ error: 'Plato no encontrado' });
    res.json(platoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const eliminadoPor = req.user._id; 
    const plato = await Plato.findByIdAndUpdate(
      req.params.id,
      {
        eliminado: true,
        eliminadoPor,
        fechaEliminacion: new Date()
      },
      { new: true }
    );
    if (!plato) return res.status(404).json({ error: 'Plato no encontrado' });
    res.json({ msg: 'Plato eliminado lógicamente', plato });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
