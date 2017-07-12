const Event = require('../../model/event.js')
const Venue = require('../../model/venue.js')

const mockVenue = require('./mock-venue.js')
const mockEvent = require('./mock-event.js')

const createEventsForOneVenue = (owner, venue, tries) => {
  return new Array(tries).fill(0).map(() => mockEvent.createOneWithVenue(null, venue).catch(() => {}))
}



// mock some venues
// then mock a bunch of events and assign them to venues
// catch and suppress errors ~ we'll try to just brute force a variety of event-venue schedules
const createManyEventsWithVenue = (venue, tries) =>
  Promise.all(createEventsForOneVenue(null, venue, tries))
  //   callManyTimes(
  //     () => Promise.resolve(mockEvent.createOneWithVenue).catch(() => {}),
  //     tries)(null, venue)
  // ).catch(err => console.log(err))

module.exports = () => {
  return mockVenue.createMany(50)
    .then(venues => Promise.all(venues.map(venue => createManyEventsWithVenue(venue._id, 6))))
    .then(() => {
      return new Promise((resolve, reject) => {
        Venue.count({}, (err, venueCount) => {
          if(err)
            return resolve(err)
          Event.count({}, (err, eventCount) => {
            if(err)
              return reject(err)
            console.log('FULL DATABASE MOCKED')
            console.log('--------------------')
            console.log(`Venues in db: ${venueCount}`)
            console.log(`Events in db: ${eventCount}`)
            return resolve()
          })
        })
      })
    })
}
