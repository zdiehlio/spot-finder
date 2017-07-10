'use strict'

const mongoose = require('mongoose')

const venueSchema = mongoose.Schema({
  location: {type: String, required: true, minlength: 1},
  amenities: [{type: String, required: true, minlength: 1}],
  description: {type: String, required: true, minlength: 1},
  images: {type: String, required: true, minlength: 1},
  price: {type: Number, required: true, minlength: 1},
  capacity: {type: Number, required: true, minlength: 1},
  owner: {type: mongoose.Schema.Types.ObjectId, required: true},
  events: [{type: mongoose.Schema.Types.ObjectId, required: null}],
})

module.exports = mongoose.model('venue', venueSchema)
