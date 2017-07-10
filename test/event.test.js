const expect = require('expect')
const moment = require('moment')

const Event = require('../model/event.js')

describe('event model', () => {

  it('should construct an event with valid fields (owner field untested)', () => {
    const testEventInput = {
      startTime: moment(),
      endTime: moment().add(2, 'hours'),
      numberOfPeople: 10,
    }

    const testEvent = new Event(testEventInput)
    expect(testEvent.startTime.isSame(testEventInput.startTime)).toEqual(true)
    expect(testEvent.endTime.isSame(testEventInput.endTime)).toEqual(true)
    expect(testEvent.numberOfPeople).toEqual(testEventInput.numberOfPeople)
    expect(testEvent._id).toExist()
  })

})
