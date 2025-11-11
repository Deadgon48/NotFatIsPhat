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

    protein: {
        type: Number,
        required: [true, 'Las proteinas son obligatorias.'],
        min: [0, 'Las proteinas no pueden ser negativas.']
    },

    fat: {
        type: Number,
        required: [true, 'La grasas son obligatorias.'],
        min: [0, 'Las grasas no pueden ser negativas.']
    },

    carbs: {
        type: Number,
        required: [true, 'Los carbohidratos son obligatorias.'],
        min: [0, 'Los carbohidratos no pueden ser negativos.']
    },

    fiber: {
        type: Number,
        required: [true, 'Las fibras son obligatorias.'],
        min: [0, 'Las fibras no pueden ser negativas.']
    },
    // Nota: MongoDB gestionará automáticamente el 'id' como '_id'.
    // No necesitamos el campo 'unit'.
});

module.exports = mongoose.model('Food', FoodSchema);