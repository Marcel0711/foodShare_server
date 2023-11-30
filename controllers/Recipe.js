const Recipe = require('../models/Recipe')
const User = require('../models/User')
const mongoose = require('mongoose')

//get all recipes
const getAllRecipes = async (req,res) => {
    try{
        const recipes = await Recipe.find().sort({createdAt: -1})
        res.status(200).json(recipes)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//get recipes by category
const getRecipesByCategory = async (req,res) => {
    const { category } = req.params
    try{
        const recipes = await Recipe.find({category}).sort({createdAt: -1})
        res.status(200).json(recipes)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//get single recipe
const getSingleRecipe = async(req,res) => {
    const { id } = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'wrong id'})
    }

    try{
        const recipe = await Recipe.findById(id).populate('author', 'username _id avatar').exec()
        
        res.status(200).json(recipe)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// get user Recipes
const getUserRecipes = async (req,res) => {
    const { username } = req.params

    const user = await User.findOne({username})
    if(!user){
        return res.status(404).json({error: 'No such user'})
    }

    try{
        const posts = await Recipe.find({author: user._id}).sort({createdAt: -1})

        res.status(200).json(posts)
    }catch(error){
        return res.status(400).json({error: error.message})
    }
}

//add recipe
const addRecipe = async(req,res) => {
    const { title, description, steps, ingredients, author_id, category } = req.body

    if(!title || !description || !steps || !ingredients || !author_id || !category){
        return res.status(400).json({error: 'all fields required'})
    }

    const user = await User.findById(author_id)
    if(!user){
        return res.status(404).json({error: 'no such user'})
    }
    
    const image = req.file?.path

    if(image == undefined){
        image  = `https://res.cloudinary.com/dal6qgtfh/image/upload/v1701358542/FoodShare/up5hjrbuwqjxo59t1o1d.jpg`
    }
    
    try{
        const newRecipe = await Recipe.create({
            title,
            description,
            steps: JSON.parse(steps),
            ingredients: JSON.parse(ingredients),
            author: author_id,
            category,
            image: image,
        })
        res.status(200).json(newRecipe)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete recipe
const deleteRecipe = async(req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'no such recipe'})
    }

    const recipe = await Recipe.findOneAndDelete({_id: id})

    if(!recipe){
        return res.status(404).json({error: "no such recipe"})
    }

    res.status(200).json(recipe)
}

module.exports = { getAllRecipes, getSingleRecipe, getRecipesByCategory, getUserRecipes, addRecipe, deleteRecipe }
