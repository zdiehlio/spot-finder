'use strict'

const expect = require('expect')

const Venue = require('../model/venue.js')

describe('venue model', () => {

  it('should construct an venue with valid fields ', () => {
    const testVenueInput = {
      name: 'A place',
      address: '123 fake st',
      capacity: 500,
    }

    const testVenue = new Venue(testVenueInput)
    expect(testVenue.name).toEqual(testVenueInput.name)
    expect(testVenue.address).toEqual(testVenueInput.address)
    expect(testVenue.capacity).toEqual(testVenueInput.capacity)
    expect(testVenue._id).toExist()
  })

})
