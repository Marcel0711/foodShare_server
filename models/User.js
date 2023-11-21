const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
})

userSchema.statics.register = async function(username, password, avatar){
    if(!username){
        throw Error('Username required')
    }
    if(!password){
        throw Error('Password required')
    }

    const duplicate = await this.findOne({username})
    if(duplicate){
        throw Error('Username taken')
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = await this.create({
        username,
        password: hashPassword,
        avatar: avatar || ""
    })

    return newUser
}

userSchema.statics.login = async function(username, password){
    if(!username){
        throw Error('username required')
    }
    if(!password){
        throw Error('password required')
    }

    const match = await this.findOne({username})
    if(!match){
        throw Error("username does not exist")
    }

    const passwordMatch = await bcrypt.compare(password, match.password)
    if(!passwordMatch){
        throw Error('Wrong Password')
    }

    return match
}

module.exports = mongoose.model('User', userSchema)
