'use strict'

const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const superagent = require('superagent')
const expect = require('expect')

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
  it('should create a event', () => {
    return Promise.resolve(mockEvent.createOneTestCase())
      .then(event => testEvent = event)
      .then(event => {
        return superagent.post(ENDPOINT)
          .send(event)
          .then(res => {
            expect(res.status).toEqual(201)
            expect(res.body.name).toEqual(testEvent.name)
            console.log(res.body)
          })
      })
  })

})
