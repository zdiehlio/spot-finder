'use strict'

const Venue = require('../model/venue.js')

module.exports = {
  create: (venue) => {
    return new Venue(venue)
      .save()
  },

  read: (id) => {
    return Venue.findById(id)
      .then(venue => {
        if(!venue)
          throw new Error('objectid failed')
        return venue
      })
  },

  update: (id, patch) => {
    return Venue.findByIdAndUpdate(id, patch, { new: true })
  },

  destroy: (id) => {
    return Venue.findByIdAndRemove(id)
  },

  index: (pageLength, pageNumber) => {
    return Venue.find({})
      .sort({ name: 'asc' })
      .skip(pageLength * (Number(pageNumber) > 0 ? pageNumber - 1 : 0))
      .limit(pageLength)
  },

}
