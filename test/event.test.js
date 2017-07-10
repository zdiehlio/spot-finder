const expect = require('expect')
const moment = require('moment')

const Event = require('../model/event.js')

describe('event model', () => {

  it('should construct an event with valid fields (owner field untested)', () => {
    const testEventInput = {
      start: moment(),
      end: moment().add(2, 'hours'),
      numberOfPeople: 10,
    }

    const testEvent = new Event(testEventInput)
    expect(testEvent.start.isSame(testEventInput.start)).toEqual(true)
    expect(testEvent.end.isSame(testEventInput.end)).toEqual(true)
    expect(testEvent.numberOfPeople).toEqual(testEventInput.numberOfPeople)
    expect(testEvent._id).toExist()
  })

})
