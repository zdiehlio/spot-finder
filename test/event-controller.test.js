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
    start: moment().add(1, 'day'),
    end: moment().add(1, 'day').add(4, 'hours'),
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

  it('should throw when creating an event that ends before it starts', () => {
    return eventController.create({
      start: moment(),
      end: moment().subtract(2, 'hours'),
      numberOfPeople: 33,
    })
      .catch(err => expect(err.message.toLowerCase().includes('bad times')).toBe(true))
  })

  it('should throw when creating an event without start/end times', () => {
    return eventController.create({
      start: moment(),
      numberOfPeople: 17,
    })
      .catch(err => expect(err).toExist())
  })

  it('should throw when creating an event ending in the past', () => {
    return eventController.create({
      start: moment().subtract(2, 'days'),
      end: moment().subtract(1, 'days'),
    })
      .catch(err => expect(err.message.toLowerCase().includes('bad times')).toBe(true))
  })

  it('should throw when creating an event assigned to an invalid venue', () => {
    return eventController.create({
      start: moment().add(1, 'd'),
      end: moment().add(2, 'd'),
      numberOfPeople: 34,
      venue: 18747190281,
    })
      .catch(err => expect(err.message.toLowerCase().includes('no such venue')).toBe(true))
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

  it('should update an event in the db\'s start time', () => {
    const newStartTime = testEvent.start.clone().add(1, 'hour')
    return eventController.update(testEventId,
      {
        start: newStartTime,
      })
      .then(event => {
        expect(event.start.isSame(newStartTime)).toBe(true)
      })
  })

  it('should update an event in the db\'s end time', () => {
    const newEndTime = testEvent.end.clone().add(4, 'hour')
    return eventController.update(testEventId,
      {
        end: newEndTime,
      })
      .then(event => {
        console.log('hihihih look here')
        console.log(event.end)
        console.log('//////////')
        console.log(newEndTime)
        expect(event.end.isSame(newEndTime)).toBe(true)
      })
  })

  it('should throw when update includes nonsense times', () => {
    const newStartTime = moment().add(1, 'hour')
    const newEndTime = moment().subtract(12, 'years')
    return eventController.update(testEventId,
      {
        start: newStartTime,
        end: newEndTime,
      })
      .catch(err => expect(err.message.toLowerCase().includes('bad times')).toBe(true))
  })

  it('should throw when update includes a nonexistent venue', () => {
    return eventController.update(testEventId, {
      venue: 1292341,
    })
      .catch(err => expect(err.message.toLowerCase().includes('no such venue')).toBe(true))
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
