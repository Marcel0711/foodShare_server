const User = require('../models/User')
const Recipe = require('../models/Recipe')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//create Token
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d'})
}

//login user
const loginUser = async (req,res) => {
    const {username, password} = req.body

    try{
        const user = await User.login(username,password)
        const token = createToken(user._id)

        res.status(200).json({_id: user._id, username, token, avatar: user.avatar})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//register user
const registerUser = async (req,res) => {
    const {username, password, avatar } = req.body

    try{
        const user = await User.register(username,password,avatar)
        const token = createToken(user._id)

        res.status(200).json({_id: user._id, username, avatar, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//get user
const getUser = async (req,res) => {
    const { username } = req.params

    try{
        const user = await User.findOne({username}).select('_id username avatar')

        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete user
const deleteUser = async(req,res) => {
    const {id} = req.params
    const { password } = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'wrong id'})
    }

    try{
        const user = await User.findById(id)
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            throw Error('Wrong password')
        }

        await Recipe.deleteMany({author: id})
        const deletedUser = await User.findByIdAndDelete(id).select('_id username avatar')
        
        res.status(200).json(deletedUser)
    }catch(error){
        return res.status(400).json({error: error.message})
    }
}

module.exports = { loginUser, registerUser, deleteUser, getUser }