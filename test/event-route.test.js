'use strict'

const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const superagent = require('superagent')
const expect = require('expect')
const moment = require('moment')

const server = require('../lib/server.js')
const mockEvent = require('./lib/mock-event.js')
const mockUser = require('./lib/mock-user.js')
const Event = require('../model/event.js')

const ENDPOINT = `http://localhost:${process.env.PORT}/api/events`
const ROOT_URL = `http://localhost:${process.env.PORT}`

describe('event routes', () => {

  let testUserInfo, otherUserInfo

  before(() => {
    return server.start()
      .catch(err => {
        console.log(err)
        throw err
      })
      .then(() => Event.remove({}))
      .then(() => mockUser.createOne())
      .then(userInfo => testUserInfo = userInfo)
      .then(userInfo => {
        let encoded = new Buffer(`${userInfo.user.username}:${userInfo.pass}`).toString('base64')
        return superagent.get(`${ROOT_URL}/api/signin`)
          .set('Authorization', `Basic ${encoded}`)
      })
      .then(res => testUserInfo.returnedToken = res.text)
      .then(() => mockUser.createOne())
      .then(userInfo => otherUserInfo = userInfo)
      .then(userInfo => {
        let encoded = new Buffer(`${userInfo.user.username}:${userInfo.pass}`).toString('base64')
        return superagent.get(`${ROOT_URL}/api/signin`)
          .set('Authorization', `Basic ${encoded}`)
      })
      .then(res => otherUserInfo.returnedToken = res.text)
  })

  after(() => server.stop())

  let testEvent
  let testEventId
  it('should create a event', () => {
    return Promise.resolve(mockEvent.createOneTestCase())
      .then(event => testEvent = event)
      .then(event => {
        return superagent.post(ENDPOINT)
          .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
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
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .send({
        fun: 'yes',
        freeBeer: 'no',
      })
      .catch(err => expect(err.status).toEqual(400))
  })

  it('should reject and respond 400 to an event with nonsense times', () => {
    return superagent.post(ENDPOINT)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
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
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
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

  it('should 404 when reading a nonexistent event', () => {
    return superagent.get(`${ENDPOINT}/102938`)
      .catch(err => expect(err.status).toEqual(404))
  })

  const updatedEvent = {
    name: 'big shindig',
  }
  it('should update an event', () => {
    return superagent.put(`${ENDPOINT}/${testEventId}`)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .send(updatedEvent)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.name).toEqual(updatedEvent.name)
      })
  })

  it('should 400 when updating an event with nonsensical times', () => {
    return superagent.put(`${ENDPOINT}/${testEventId}`)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .send({
        start: moment().add(8, 'hours'),
        end: moment().add(2, 'hours'),
      })
      .catch(err => expect(err.status).toEqual(400))
  })

  it('should respond 401 when updating an event with no auth', () => {
    return superagent.put(`${ENDPOINT}/${testEventId}`)
      .send(updatedEvent)
      .catch(err => expect(err.status).toEqual(401))
  })

  it('should respond 403 when updating an event with the wrong auth', () => {
    return superagent.put(`${ENDPOINT}/${testEventId}`)
      .set('Authorization', `Bearer ${otherUserInfo.returnedToken}`)
      .send(updatedEvent)
      .catch(err => expect(err.status).toEqual(403))
  })

  it('should respond 401 when deleting event with no auth', () => {
    return superagent.delete(`${ENDPOINT}/${testEventId}`)
      .catch(err => expect(err.status).toEqual(401))
  })

  it('should respond 403 when deleting event with the wrong auth', () => {
    return superagent.delete(`${ENDPOINT}/${testEventId}`)
      .set('Authorization', `Bearer ${otherUserInfo.returnedToken}`)
      .catch(err => expect(err.status).toEqual(403))
  })

  it('should delete an event', () => {
    return superagent.delete(`${ENDPOINT}/${testEventId}`)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .then(res => expect(res.status).toEqual(204))
  })

  it('should 404 when deleting an invalid event', () => {
    return superagent.delete(`${ENDPOINT}/928374923`)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .catch(err => expect(err.status).toEqual(404))
  })

})
