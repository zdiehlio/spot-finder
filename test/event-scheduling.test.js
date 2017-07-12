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

  it('should throw when booking an event that overlaps with another event', () => {
    let venueId = null
    let events = []
    mockVenue.createOne()
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


})
