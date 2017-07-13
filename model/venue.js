'use strict'

const mongoose = require('mongoose')

const venueSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true},
  capacity: {type: Number, required: true},
  amenities: [{type: String}],
  description: {type: String},
  images: [{type: String}],
  price: {type: Number},
  owner: {type: mongoose.Schema.Types.ObjectId, required: true}, // TODO: make required when appropriate
  events: [{type: mongoose.Schema.Types.ObjectId, default: null}],
})

const Venue = mongoose.model('venue', venueSchema)

module.exports = Venue
