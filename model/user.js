'use strict'

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  passwordHash: {type: String, required: true},
  tokenSeed: {type: String, required: true, unique: true},
})

const User = module.exports = mongoose.model('user', userSchema)
