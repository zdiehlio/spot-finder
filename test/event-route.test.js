'use strict'

const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const superagent = require('superagent')
const expect = require('expect')
const moment = require('moment')

const server = require('../lib/server.js')
const mockEvent = require('./lib/mock-event.js')
const Event = require('../model/event.js')

const ENDPOINT = `http://localhost:${process.env.PORT}/api/events`

describe('event routes', () => {

  before(() => {
    return server.start()
      .catch(err => {
        console.log(err)
        throw err
      })
      .then(() => Event.remove({}))
      .then(() => mockEvent.createMany(2))
  })

  after(() => server.stop())

  let testEvent
  let testEventId
  it('should create a event', () => {
    return Promise.resolve(mockEvent.createOneTestCase())
      .then(event => testEvent = event)
      .then(event => {
        return superagent.post(ENDPOINT)
          .send(event)
          .then(res => {
            expect(res.status).toEqual(201)
            expect(res.body.name).toEqual(testEvent.name)
            expect(res.body._id).toExist()
            testEventId = res.body._id
          })
      })
  })

  it('should reject and respond 400 to invalid event', () => {
    return superagent.post(ENDPOINT)
      .send({
        fun: 'yes',
        freeBeer: 'no',
      })
      .catch(err => expect(err.status).toEqual(400))
  })

  it('should reject and respond 400 to an event with nonsense times', () => {
    return superagent.post(ENDPOINT)
      .send({
        name: 'bad times',
        numberOfPeople: 2,
        start: moment().add(5, 'hours'),
        end: moment().add(3, 'hours'),
      })
      .catch(err => expect(err.status).toEqual(400))
  })

  it('should reject and respond 400 to an event assigned to a nonexistent venue', () => {
    return superagent.post(ENDPOINT)
      .send({
        name: 'party',
        numberOfPeople: 1,
        start: moment().add(1, 'hour'),
        end: moment().add(2, 'hours'),
        venue: 12345,
      })
      .catch(err => expect(err.status).toEqual(400))
  })

  it('should read an event', () => {
    return superagent.get(`${ENDPOINT}/${testEventId}`)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.name).toEqual(testEvent.name)
      })
  })

  const updatedEvent = {
    name: 'big shindig',
  }
  it('should update an event', () => {
    return superagent.put(`${ENDPOINT}/${testEventId}`)
      .send(updatedEvent)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.name).toEqual(updatedEvent.name)
      })
  })

  it('should delete an event', () => {
    return superagent.delete(`${ENDPOINT}/${testEventId}`)
      .then(res => expect(res.status).toEqual(204))
  })

})
