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

  let testVenue
  it('should create a venue', () => {


    return Promise.resolve(mockVenue.createOneTestCase())
      .then(venue => testVenue = venue)
      .then(venue => {
        return superagent.post(ENDPOINT)
          .send(venue)
          .then(res => {
            expect(res.status).toEqual(201)
            expect(res.body.name).toEqual(testVenue.name)
            console.log(res.body)
          })
      })
  })

})
