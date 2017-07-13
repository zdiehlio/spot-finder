'use strict'

const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const superagent = require('superagent')
const expect = require('expect')

const server = require('../lib/server.js')
const mockVenue = require('./lib/mock-venue.js')
const Venue = require('../model/venue.js')
const mockUser = require('./lib/mock-user.js')

const ENDPOINT = `http://localhost:${process.env.PORT}/api/venues`
const ROOT_URL = `http://localhost:${process.env.PORT}`

describe('venue routes', () => {

  let testUserInfo
  let otherUserInfo

  before(() => {
    return server.start()
      .catch(err => {
        console.log(err)
        throw err
      })
      .then(() => Venue.remove({}))
      .then(() => mockUser.createOne())
      .then(userInfo => testUserInfo = userInfo)
      .then(userInfo => {
        let encoded = new Buffer(`${userInfo.user.username}:${userInfo.pass}`).toString('base64')
        return superagent.get(`${ROOT_URL}/api/signin`)
          .set('Authorization', `Basic ${encoded}`)
      })
      .then(res => testUserInfo.returnedToken = res.text)
      //
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

  let testVenue, testVenueId
  it('should create a venue', () => {
    return Promise.resolve(mockVenue.createOneTestCase())
      .then(venue => testVenue = venue)
      .then(venue => {
        return superagent.post(ENDPOINT)
          .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
          .send(venue)
          .then(res => {
            expect(res.status).toEqual(201)
            expect(res.body.name).toEqual(testVenue.name)
            expect(res.body._id).toExist()
            testVenueId = res.body._id
          })
      })
  })

  it('should reject and respond 400 to an invalid venue', () => {
    return superagent.post(ENDPOINT)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .send({
        big: 'no',
        cheap: 'yes',
      })
      .catch(err => expect(err.status).toEqual(400))
  })

  it('should reject and respond 401 when no auth is provided', () => {
    return superagent.post(ENDPOINT)
      .send(mockVenue.createOneTestCase())
      .catch(err => expect(err.status).toEqual(401))
  })

  it('should read a venue', () => {
    return superagent.get(`${ENDPOINT}/${testVenueId}`)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.name).toEqual(testVenue.name)
      })
  })

  it('should 404 a nonexistent venue', () => {
    return superagent.get(`${ENDPOINT}/12345`)
      .catch(err => expect(err.status).toEqual(404))
  })

  const updatedVenue = {
    name: 'joes pizza',
  }
  it('should update a venue', () => {
    return superagent.put(`${ENDPOINT}/${testVenueId}`)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .send(updatedVenue)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.name).toEqual(updatedVenue.name)
        expect(res.body.address).toEqual(testVenue.address)
      })
  })

  it('should respond 401 when updating a venue without auth', () => {
    return superagent.put(`${ENDPOINT}/${testVenueId}`)
      .send(updatedVenue)
      .catch(err => expect(err.status).toEqual(401))
  })

  it('should respond 403 when updating a venue with the wrong auth', () => {
    return superagent.put(`${ENDPOINT}/${testVenueId}`)
      .set('Authorization', `Bearer ${otherUserInfo.returnedToken}`)
      .send(updatedVenue)
      .catch(err => expect(err.status).toEqual(403))
  })

  it('should 404 when updating a nonexistent venue', () => {
    return superagent.put(`${ENDPOINT}/12345`)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .send(updatedVenue)
      .catch(err => expect(err.status).toEqual(404))
  })

  it('should 401 when deleting a venue without auth', () => {
    return superagent.delete(`${ENDPOINT}/${testVenueId}`)
      .catch(err => expect(err.status).toEqual(401))
  })

  it('should 403 when deleting a venue with the wrong auth', () => {
    return superagent.delete(`${ENDPOINT}/${testVenueId}`)
      .set('Authorization', `Bearer ${otherUserInfo.returnedToken}`)
      .catch(err => expect(err.status).toEqual(403))
  })

  it('should delete a venue', () => {
    return superagent.delete(`${ENDPOINT}/${testVenueId}`)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .then(res => expect(res.status).toEqual(204))
  })

  it('should 404 when deleting a nonexistent venue', () => {
    return superagent.delete(`${ENDPOINT}/123`)
      .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
      .catch(err => expect(err.status).toEqual(404))
  })

})
