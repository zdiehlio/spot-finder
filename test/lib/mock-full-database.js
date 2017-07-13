const Event = require('../../model/event.js')
const Venue = require('../../model/venue.js')

const mockVenue = require('./mock-venue.js')
const mockEvent = require('./mock-event.js')

const createEventsForOneVenue = (owner, venue, tries) => {
  return new Array(tries).fill(0).map(() => mockEvent.createOneWithVenue(null, venue).catch(() => {}))
}

const createManyEventsWithVenue = (venue, tries) =>
  Promise.all(createEventsForOneVenue(null, venue, tries))

module.exports = () => {
  return mockVenue.createMany(50)
    .then(venues => Promise.all(venues.map(venue => createManyEventsWithVenue(venue._id, 3))))
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
