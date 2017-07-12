const mongoose = require('mongoose')
const moment = require('moment')
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
          start: events[0].start.add(1, 'minute'),
          end: events[0].end.subtract(1, 'minute'),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('event times overlap with booked times'))
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
          start: events[0].start.add(10, 'minute'),
          end: events[0].end.add(3, 'hour'),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('event times overlap with booked times'))
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
          start: events[0].start.subtract(1, 'hour'),
          end: events[0].start.add(10, 'minute'),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('event times overlap with booked times'))
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
          start: events[0].start.subtract(1, 'hour'),
          end: events[0].end.add(1, 'hour'),
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('event times overlap with booked times'))
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
          start: events[0].start,
          end: events[0].end,
        })
      })
      .then(() => expect(true).toBe(false)) // should be unreachable test
      .catch(err => expect(err.message).toEqual('event times overlap with booked times'))
  })


})
