const mongoose = require('mongoose');

// El esquema solo incluye name y kcal
const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del alimento es obligatorio.'],
        trim: true
    },
    kcal: {
        type: Number,
        required: [true, 'Las kilocalorías son obligatorias.'],
        min: [0, 'Las kcal no pueden ser negativas.']
    },
    // Nota: MongoDB gestionará automáticamente el 'id' como '_id'.
    // No necesitamos el campo 'unit'.
});

module.exports = mongoose.model('Food', FoodSchema);