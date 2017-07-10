'use strict'
const moment = require('moment')
const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  numberOfPeople: { type: Number, required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, required: false },
  // TODO: change to "true"
})

// "virtual" fields are ones that are not stored to MongoDB,
// but that can be queried and set as if they were part of the model.
// we store the start and end times of an Event as integer (Unix timestamp)
// and use these virtual fields to provide get and set for these times as Moment.js moments
// which are much more convenient.
//
// So any time we read or manipulate times, we should do so with Moment.js.

eventSchema.virtual('startTime').get(function() {
  return moment(this.start)
})

eventSchema.virtual('endTime').get(function() {
  return moment(this.end)
})

eventSchema.virtual('startTime').set(function(time) {
  this.start = time.valueOf()
})

eventSchema.virtual('endTime').set(function(time) {
  this.end = time.valueOf()
})

const Event = mongoose.model('event', eventSchema)

module.exports = Event
