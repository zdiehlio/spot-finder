'use strict'
const moment = require('moment')

const Event = require('../model/event.js')
const Venue = require('../model/venue.js')

const areTimesOkay = (start, end) => {
  if(!(start && end))
    return false
  if(end.isBefore(start))
    return false
  if(end.isBefore(moment()))
    return false
  return true
}

const doTimesOverlap = (testTime, start, end) => {
  return testTime.isBetween(start, end, null, '[]')
}

const isVenueBookable = (venue, event) => {
  return Promise.all(venue.events.map((event) => Event.findById(event)))
    .then(events => {
      return events.some(bookedEvent => (
        doTimesOverlap(event.start, bookedEvent.start, bookedEvent.end)
        || doTimesOverlap(event.end, bookedEvent.start, bookedEvent.end)
        || doTimesOverlap(bookedEvent.start, event.start, event.end)
        || doTimesOverlap(bookedEvent.end, event.start, event.end)
      ))
    })
    .then(timesOverlap => {
      if(timesOverlap)
        throw new Error('event times overlap with booked times')
    })
}


module.exports = {
  create: (event) => {
    event.start = moment(event.start)
    event.end = moment(event.end)
    if(!areTimesOkay(event.start, event.end))
      throw new Error(`bad times: ${event.start.toString()} -- ${event.end.toString()}`)
      // TODO: make this better
    if(event.venueId) { // attempting to book a venue
      return Venue.findById(event.venueId)
        .catch(err => {
          console.log(err)
          throw new Error('no such venue')
        })
        .then(venue => isVenueBookable(venue, event))
        .then(isBookable => {
          if(!isBookable) {
            throw new Error('venue is already booked')
          }
        })
        .then(() => new Event(event).save())
    } else { // not trying to book a venue
      return new Event(event)
        .save()
    }

  },

  read: (id) => {
    return Event.findById(id)
  },

  update: (id, patch) => {
    if('start' in patch) {
      patch.start = moment(patch.start)
    }
    if('end' in patch) {
      patch.end = moment(patch.end)
    }
    if('start' in patch && 'end' in patch && !areTimesOkay(patch.start, patch.end)) {
      console.log('UPDATED EVENT GOT BAD TIMES: ')
      console.dir(patch)
      throw new Error(`bad times: ${patch.start.toString()} -- ${patch.end.toString()}`)
    }
    if(patch.venueId) {
      return Venue.findById(event.venueId)
        .catch(err => {
          console.log(err)
          throw new Error('no such venue')
        })
        .then(venue => isVenueBookable(venue, event))
        .then(isBookable => {
          if(!isBookable) {
            throw new Error('venue is already booked')
          }
        })
        .then(() => Event.findByIdAndUpdate(id, patch, { new: true }))
    } else { // not trying to book a venue
      return Event.findByIdAndUpdate(id, patch, { new: true })
    }
  },

  destroy: (id) => {
    return Event.findByIdAndRemove(id)
  },

  index: (pageLength, pageNumber) => {
    return Event.find({})
      .sort({ start: 'asc' })
      .skip(Number(pageNumber) > 0 ? pageNumber - 1 : 0)
      .limit(pageLength)
  },

}
