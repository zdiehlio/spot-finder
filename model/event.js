'use strict'
const moment = require('moment')
const mongoose = require('mongoose')

const Venue = require('./venue.js')

const eventSchema = mongoose.Schema({
  _start: { type: Number, required: true },
  _end: { type: Number, required: true },
  name: { type: String },
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
  this._start = time.valueOf()
})

eventSchema.virtual('end').set(function(time) {
  this._end = time.valueOf()
})

eventSchema.pre('save', function(next) {
  if(!this.venueId)
    return next()
  Venue.findById(this.venueId)
    .then(venue => {
      if(!venue.events.includes(this._id))
        venue.events.push(this._id)
      return venue.save()
    })
    .then(() => next())
    .catch(err => next(err))
})

eventSchema.post('remove', function(removedEvent, next) {
  if(!removedEvent.venueId)
    return next()
  Venue.findById(removedEvent.venueId)
    .catch(() => next())
    .then(venue => {
      venue.events = venue.events.filter(event => event._id !== removedEvent._id)
      return venue.save()
    })
    .then(() => next())
    .catch(err => next(err))
})

const Event = mongoose.model('event', eventSchema)

module.exports = Event
