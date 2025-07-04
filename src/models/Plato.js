
const mongoose = require('mongoose');

const platoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  categoria: String,
  imagen: String, 
  eliminado: { type: Boolean, default: false },
  eliminadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  fechaEliminacion: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Plato', platoSchema);
