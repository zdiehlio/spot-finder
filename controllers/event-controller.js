'use strict'
const moment = require('moment')

const Event = require('../model/event.js')

module.exports = {
  create: (event) => {
    event.start = moment(event.start)
    event.end = moment(event.end)
    return new Event(event)
      .save()
  },

  read: (id) => {
    return Event.findById(id)
  },

  update: (id, patch) => {
    return Event.findByIdAndUpdate(id, patch, { new: true })
  },

  destroy: (id) => {
    return Event.findByIdAndRemove(id)
  },

  index: (pageLength, pageNumber) => {
    return Event.find({})
      .sort({ start: 'asc' })
      .skip(Number(pageNumber) > 0 ? pageNumber - 1 : 0)
      .limit(pageLength)
  },

}
