'use strict'

const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  // username: {type: String, required: true, minlength: 1},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  ownedVenues: [{type: mongoose.Schema.Types.ObjectId}],
  ownedEvents: [{type: mongoose.Schema.Types.ObjectId}],
})

module.exports = mongoose.model('profile', profileSchema)
