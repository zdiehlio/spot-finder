'use strict'

const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.test.env`})
const superagent = require('superagent')
const expect = require('expect')

const server = require('../lib/server.js')
const mockVenue = require('./lib/mock-venue.js')
const Venue = require('../model/venue.js')

const ENDPOINT = `http://localhost:${process.env.PORT}/api/venues`

describe('venue routes', () => {

  before(() => {
    return server.start()
      .catch(err => {
        console.log(err)
        throw err
      })
      .then(() => Venue.remove({}))
      .then(() => mockVenue.createMany(2))
  })

  after(() => server.stop())

  let testVenue, testVenueId
  it('should create a venue', () => {
    return Promise.resolve(mockVenue.createOneTestCase())
      .then(venue => testVenue = venue)
      .then(venue => {
        return superagent.post(ENDPOINT)
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
      .send({
        big: 'no',
        cheap: 'yes',
      })
      .catch(err => expect(err.status).toEqual(400))
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
      .send(updatedVenue)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.name).toEqual(updatedVenue.name)
        expect(res.body.address).toEqual(testVenue.address)
      })
  })

  it('should 404 when updating a nonexistent venue', () => {
    return superagent.put(`${ENDPOINT}/12345`)
      .send(updatedVenue)
      .catch(err => expect(err.status).toEqual(404))
  })

  it('should delete a venue', () => {
    return superagent.delete(`${ENDPOINT}/${testVenueId}`)
      .then(res => expect(res.status).toEqual(204))
  })

  it('should 404 when deleting a nonexistent venue', () => {
    return superagent.delete(`${ENDPOINT}/123`)
      .catch(err => expect(err.status).toEqual(404))
  })

})
