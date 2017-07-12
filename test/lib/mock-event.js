'use strict'

const faker = require('faker')
const moment = require('moment')
const Event = require('../../model/event.js')
const mockUser = require('./mock-user.js')

const mockEvent = {}



mockEvent.createOneTestCase = (owner = null) => {
  const startTime = moment(Date.now()).add(Math.ceil(Math.random() * 240) + 1, 'h')
  return {
    name: faker.fake('{{commerce.color}}, {{company.bsAdjective}} {{company.bsBuzz}}'),
    start: startTime,
    end: startTime.clone().add(Math.ceil(Math.random() * 480 + 1), 'h'),
    numberOfPeople: Math.floor(Math.random() * 200 + 1),
    venue: null,
    owner: owner ? owner._id : null,
  }
}

mockEvent.createOne = (owner = null) => {
  return new Event(mockEvent.createOneTestCase(owner)).save()
}

mockEvent.createOneWithVenue = (owner = null, venueId) => {
  const event = mockEvent.createOneTestCase(owner)
  event.venue = venueId
  return new Event(event).save()

}

mockEvent.createMany = (number) => {
  return Promise.all(
    new Array(number)
      .fill(0)
      .map(() => mockUser.createOne()
        .then(user => mockEvent.createOne(user))))
}


module.exports = mockEvent
