'use strict'

const mongoose = require('mongoose')
const moment = require('moment')
const dotenv = require('dotenv')
const expect = require('expect')

const eventController = require('../controllers/event-controller.js')
const Event = require('../model/event.js')

const NO_SUCH_ID = 42 // an arbitrary number

describe('event controller', () => {
  before(() => {
    dotenv.config({ path: `${__dirname}/../.test.env`})
    mongoose.Promise = Promise
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGODB_URI, err => {
        if(err) reject(err)
        Event.remove({}).then(() => resolve())
      })
    })
  })

  after((done) => {
    mongoose.disconnect(err => {
      expect(err).toNotExist()
      done()
    })
  })

  const testEvent = {
    start: moment(),
    end: moment().add(4, 'hours'),
    numberOfPeople: 12,
  }
  let testEventId

  it('should create a valid event and add it to the db (ignoring owner)', () => {
    return eventController.create(testEvent)
      .then(event => {
        expect(event.start.isSame(testEvent.start)).toEqual(true)
        expect(event.end.isSame(testEvent.end)).toEqual(true)
        expect(event.numberOfPeople).toEqual(testEvent.numberOfPeople)
        testEventId = event._id
      })
  })

  it('should throw when creating an invalid event', () => {
    return eventController.create({fun: 'yes'})
      .catch(err => expect(err).toExist())
  })

  it('should read a valid event from the db', () => {
    return eventController.read(testEventId)
      .then(event => {
        expect(event.start.isSame(testEvent.start)).toEqual(true)
        expect(event.end.isSame(testEvent.end)).toEqual(true)
        expect(event.numberOfPeople).toEqual(testEvent.numberOfPeople)
        testEventId = event._id
      })
  })

  const eventUpdate = {
    numberOfPeople: 20,
  }

  it('should update an event in the db', () => {
    return eventController.update(testEventId, eventUpdate)
      .then(event => {
        expect(event.start.isSame(testEvent.start)).toEqual(true)
        expect(event.end.isSame(testEvent.end)).toEqual(true)
        expect(event.numberOfPeople).toEqual(eventUpdate.numberOfPeople)
        testEventId = event._id
      })
  })

  it('should throw when updating a nonexistent id', () => {
    return eventController.update(NO_SUCH_ID, eventUpdate)
      .catch(err => expect(err).toExist())
  })

  it('should remove an event from the db', () => {
    return eventController.destroy(testEventId)
      .catch(err => expect(err).toNotExist())
      .then(eventController.read(testEventId))
      .catch(err => expect(err).toExist())
  })
})
