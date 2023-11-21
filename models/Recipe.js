const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    steps: {
        type: [{
            title: String,
            description: String
        }]
    },
    ingredients: [String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        enum: ['fast food', 'breakfast', 'dinner', 'lunch', 'dessert']
    }
},{timestamps: true })

module.exports = mongoose.model('Recipe', recipeSchema)