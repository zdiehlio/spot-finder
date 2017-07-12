'use strict'

const faker = require('faker')
const Venue = require('../../model/venue.js')
const mockUser = require('./mock-user.js')

const mockVenue = {}



mockVenue.createOneTestCase = (owner = null) => {
  return {
    name: faker.company.companyName(),
    address: faker.address.streetAddress(),
    capacity: Math.floor(Math.random() * 50) + 1,
    amenities: new Array(3).fill(0).map(() => faker.company.bs(3)),
    description: faker.lorem.sentence(),
    images: [],
    price: Math.random() < 0.25 ? 0 : Math.floor(Math.random() * 500) + 1,
    owner: owner ? owner._id : null,
    events: [],
  }
}

mockVenue.createOne = (owner = null) => {
  return new Venue(mockVenue.createOneTestCase(owner)).save()
}

mockVenue.createMany = (number) => {
  return Promise.all(
    new Array(number)
      .fill(0)
      .map(() => mockUser.createOne()
        .then(user => mockVenue.createOne(user))))
}


module.exports = mockVenue
