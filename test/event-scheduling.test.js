'use strict'

const mongoose = require('mongoose')
// const moment = require('moment')
const dotenv = require('dotenv')
const expect = require('expect')

const eventController = require('../controllers/event-controller.js')
const Event = require('../model/event.js')
const Venue = require('../model/venue.js')
const mockEvent = require('./lib/mock-event.js')
const mockVenue = require('./lib/mock-venue.js')

describe('event scheduling', () => {
  before(() => {
    dotenv.config({ path: `${__dirname}/../.test.env`})
    mongoose.Promise = Promise
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGODB_URI, err => {
        if(err) reject(err)
        Event.remove({})
          .then(() => Venue.remove({}))
          .then(() => resolve())
      })
    })
  })

  after((done) => {
    mongoose.disconnect(err => {
      expect(err).toNotExist()
      done()
    })
  })

  afterEach(() => {
    return Event.remove({})
      .then(() => Venue.remove({}))
  })

  it('should throw when booking an event that is completely within an existing event', () => {
    let venueId = null
    let events = []
    return mockVenue.createOne()
      .then(venue => venueId = venue._id)
      .then(() => mockEvent.createOneWithVenue(null, venueId))
      .then(event => events.push(event))
      .then(() => {
        return eventController.create({
          numberOfPeople: 17,
          owner: null,
          venue: venueId,
          start: events[0].start.clone().add(1, 'minute'),
          end: events[0].end.clone().subtract(1, 'minute'),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('venue is already booked'))
  })

  it('should throw when booking an event that begins during an existing event', () => {
    let venueId = null
    let events = []
    return mockVenue.createOne()
      .then(venue => venueId = venue._id)
      .then(() => mockEvent.createOneWithVenue(null, venueId))
      .then(event => events.push(event))
      .then(() => {
        return eventController.create({
          numberOfPeople: 17,
          owner: null,
          venue: venueId,
          start: events[0].start.clone().add(10, 'minute'),
          end: events[0].end.clone().add(3, 'hour'),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('venue is already booked'))
  })

  it('should throw when booking an event that ends after an existing event begins', () => {
    let venueId = null
    let events = []
    return mockVenue.createOne()
      .then(venue => venueId = venue._id)
      .then(() => mockEvent.createOneWithVenue(null, venueId))
      .then(event => events.push(event))
      .then(() => {
        return eventController.create({
          numberOfPeople: 17,
          owner: null,
          venue: venueId,
          start: events[0].start.clone().subtract(1, 'hour'),
          end: events[0].start.clone().add(10, 'minute'),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('venue is already booked'))
  })

  it('should throw when booking an event that completely surrounds an existing event', () => {
    let venueId = null
    let events = []
    return mockVenue.createOne()
      .then(venue => venueId = venue._id)
      .then(() => mockEvent.createOneWithVenue(null, venueId))
      .then(event => events.push(event))
      .then(() => {
        return eventController.create({
          numberOfPeople: 17,
          owner: null,
          venue: venueId,
          start: events[0].start.clone().subtract(1, 'hour'),
          end: events[0].end.clone().add(1, 'hour'),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('venue is already booked'))
  })

  it('should throw when booking an event with precisely the same schedule as an existing event', () => {
    let venueId = null
    let events = []
    return mockVenue.createOne()
      .then(venue => venueId = venue._id)
      .then(() => mockEvent.createOneWithVenue(null, venueId))
      .then(event => events.push(event))
      .then(() => {
        return eventController.create({
          numberOfPeople: 17,
          owner: null,
          venue: venueId,
          start: events[0].start.clone(),
          end: events[0].end.clone(),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('venue is already booked'))
  })

  it('should schedule an event ok when using update', () => {
    let venueId, eventId
    return mockVenue.createOne()
      .then(venue => {
        console.log(venue)
        return venue
      })
      .then(venue => venueId = venue._id)
      .then(() => mockEvent.createOne())
      .then(event => {
        console.log(event)
        console.log('start: ', event.start.toString())
        console.log('end:   ', event.end.toString())
        return event
      })
      .then(event => eventId = event._id)
      .then(() => {
        return eventController.update(eventId, { venue: venueId })
      })
      .then(() => Venue.findById(venueId))
      .then(venue => {
        console.log('venue after event added: ')
        console.log(venue)
        // FIXME: the two values are equal but venue.events[0] === eventId -> false !??!?!?!?!
        // seems venue.events[0] is an object while eventId is a number
        console.log('venue#events[0]', venue.events[0])
        console.log('eventid        ', eventId)
        console.log('they are equal: ', venue.events[0].equals(eventId))
        console.log('typeof venue#events[0]: ', typeof venue.events[0])
        console.log('typeof eventid: ', typeof eventId)
        return venue
      })
      .then(venue => expect(venue.events.some(id => id.equals(eventId))).toBe(true))
  })


})
