'use strict'

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const expect = require('expect')

const venueController = require('../controllers/venue-controller.js')
const Venue = require('../model/venue.js')

const NO_SUCH_ID = 42

describe('venue controller', () => {
  before(() => {
    dotenv.config({path: `${__dirname}/../.test.env`})
    mongoose.Promise = Promise
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGODB_URI, err => {
        if(err) reject(err)
        Venue.remove({}).then(() => resolve())
      })
    })
  })

  after((done) => {
    mongoose.disconnect(err => {
      expect(err).toNotExist()
      done()
    })
  })

  const testVenue = {
    name: 'A place',
    address: '123 fake st',
    capacity: 500,
  }
  let testVenueId

  it('should create a valid venue', () => {
    return venueController.create(testVenue)
      .then(venue => {
        expect(venue.name).toEqual('A place')
        expect(venue.address).toEqual('123 fake st')
        expect(venue.capacity).toEqual(500)
        testVenueId = venue.id
      })
  })

  const venueUpdate = {
    capacity: 450,
  }

  it('should update a venue', () => {
    return venueController.update(testVenueId, venueUpdate)
      .then(venue => {
        expect(venue.name).toEqual('A place')
        expect(venue.address).toEqual('123 fake st')
        expect(venue.capacity).toEqual(450)
      })
  })

  it('should throw when updating a nonexistent id', () => {
    return venueController.update(NO_SUCH_ID, venueUpdate)
      .catch(err => expect(err).toExist())
  })

  it('should remove an event from the db', () => {
    return venueController.destroy(testVenueId)
      .catch(err => expect(err).toNotExist())
      .then(venueController.read(testVenueId))
      .catch(err => expect(err).toExist())
  })

})
