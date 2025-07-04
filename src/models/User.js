
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rol: { type: String, default: "admin" }, 
  eliminado: { type: Boolean, default: false },
  eliminadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  fechaEliminacion: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
