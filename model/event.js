'use strict'

const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  numberOfPeople: { type: Number, required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
})

module.exports = mongoose.model('event', eventSchema)
