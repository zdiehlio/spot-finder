const faker = require('faker')
const moment = require('moment')
const Event = require('../../model/event.js')
const mockUser = require('./mock-user.js')

const mockEvent = {}



mockEvent.createOneTestCase = (owner = null) => {
  const startTime = moment(Date.now()).add(Math.ceil(Math.random() * 100)+ 1)
  return {
    start: startTime,
    end: startTime.clone().add(Math.ceil(Math.random() * 6 + 1), 'h'),
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
  console.log('creating mock event with venue')
  console.dir(event)
  console.log('******************************')
  event.venueId = venueId
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
