'use strict'
const moment = require('moment')
const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  _start: { type: Number, required: true },
  _end: { type: Number, required: true },
  numberOfPeople: { type: Number, required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, default: null },
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

eventSchema.virtual('start').get(function() {
  return moment(this._start)
})

eventSchema.virtual('end').get(function() {
  return moment(this._end)
})

eventSchema.virtual('start').set(function(time) {
  console.log('setting start time for event: ')
  console.dir(this)
  console.log('----------')
  console.log(time)
  console.log(time.valueOf())
  this._start = time.valueOf()
})

eventSchema.virtual('end').set(function(time) {
  this._end = time.valueOf()
})

const Event = mongoose.model('event', eventSchema)

module.exports = Event
