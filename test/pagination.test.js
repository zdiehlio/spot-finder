const expect = require('expect')
const superagent = require('superagent')

const server = require('../lib/server.js')
const Event = require('../model/event.js')
const Venue = require('../model/venue.js')
const mockFullDatabase = require('./lib/mock-full-database.js')
const mockUser = require('./lib/mock-user.js')

const API_URL = `http://localhost:${process.env.PORT}/api`
const VENUE_PAGE_LENGTH = 20
const EVENT_PAGE_LENGTH = 20

describe('index routes & scheduling conflicts', () => {

  let testUserInfo

  before(() => {
    return server.start()
      .catch(err => {
        console.log(err)
        throw err
      })
      .then(() => Event.remove({}))
      .then(() => Venue.remove({}))
      .then(() => mockFullDatabase())
      .then(() => mockUser.createOne())
      .then(userInfo => testUserInfo = userInfo)
      .then(userInfo => {
        let encoded = new Buffer(`${userInfo.user.username}:${userInfo.pass}`).toString('base64')
        return superagent.get(`${API_URL}/signin`)
          .set('Authorization', `Basic ${encoded}`)
      })
      .then(res => testUserInfo.returnedToken = res.text)
  })

  after(() => server.stop())

  it('should return the first page of venues by default', () => {
    return superagent.get(`${API_URL}/venues`)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.length).toEqual(VENUE_PAGE_LENGTH)
        res.body.forEach((venue) => {
          expect(venue.name).toExist()
          expect(venue.address).toExist()
          expect(venue.capacity).toExist()
          expect(venue.amenities).toExist()
          expect(venue.description).toExist()
          expect(venue.hasOwnProperty('price')).toBe(true)
        })
      })
  })

  it('should return the second page of venues', () => {
    return superagent.get(`${API_URL}/venues?page=2`)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.length).toEqual(VENUE_PAGE_LENGTH)
        res.body.forEach((venue) => {
          expect(venue.name).toExist()
          expect(venue.address).toExist()
          expect(venue.capacity).toExist()
          expect(venue.amenities).toExist()
          expect(venue.description).toExist()
          expect(venue.hasOwnProperty('price')).toBe(true)
        })
        Venue.find({}).sort({ name: 'asc' }).skip(20)
          .then(venues => {
            expect(venues[0].name).toEqual(res.body[0].name)
          })
      })
  })

  it('should return the first page of events by default', () => {
    return superagent.get(`${API_URL}/events`)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.length).toEqual(EVENT_PAGE_LENGTH)
        res.body.forEach((event) => {
          expect(event.name).toExist()
          expect(event.numberOfPeople).toExist()
          expect(event.venue).toExist()
        })
      })
  })

  it('should return the third page of events', () => {
    return superagent.get(`${API_URL}/events?page=3`)
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.length).toEqual(EVENT_PAGE_LENGTH)
        return Event.find({}).sort({ start: 'asc' }).skip(40)
          .then(events => expect(res.body[0].name).toEqual(events[0].name))
      })
  })

  // while we have a full database mocked, go ahead and test for proper handling of scheduling conflicts
  it('should respond 409 when scheduling an overlapping event', () => {
    return Event.find({})
      .then(events => events[0])
      .then(event => {
        return superagent.post(`${API_URL}/events`)
          .set('Authorization', `Bearer ${testUserInfo.returnedToken}`)
          .send({
            name: 'coffee with yancy',
            numberOfPeople: 3,
            start: event.start,
            end: event.end,
            venue: event.venue,
          })
          .catch(err => expect(err.status).toBe(409))
      })
  })

  // we will also take the opportunity to test event post hook
  it('should remove an event from its venue when event is removed', () => {
    let venueId, eventId
    return Event.findOne({})
      .then(event => {
        venueId = event.venue
        eventId = event._id
        return event
      })
      .then(event => event.remove())
      .then(() => Venue.findById(venueId))
      .then(venue => {
        expect(venue.events.includes(eventId)).toBe(false)
      })
  })
})
