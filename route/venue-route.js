'use strict'

const Router = require('express').Router
const router = new Router()
const s3Upload = require('../lib/s3-middleware.js')
const bearAuth = require('../lib/bear-auth-middleware.js')
const venueController = require('../controllers/venue-controller.js')


const PAGE_LENGTH = 20

// index route
router.get('/api/venues', (req, res, next) => {
  venueController.index(PAGE_LENGTH, req.query.page)
    .then(page => res.json(page))
    .catch(err => next(err))
})

// create
router.post('/api/venues', bearAuth, s3Upload('image'), (req, res, next) => {
  console.log('Hola')
  // req.body.owner = req.user._id
  const venue = Object.assign({}, req.body, {
    owner: req.user._id,
    events: [],
  })
  if(req.s3Data && req.s3Data.Location)
    venue.image = req.s3Data.Location
  venueController.create(venue)
    .then(venue => res.status(201).json(venue))
    .catch(err => next(err))
})

// read
router.get('/api/venues/:id', (req, res, next) => {
  venueController.read(req.params.id)
    .then(venue => res.status(200).json(venue))
    .catch(err => next(err))
})

// update
router.put('/api/venues/:id', bearAuth, s3Upload('image'), (req, res, next) => {
  venueController.read(req.params.id)
    .then(venue => {
      if(!(venue.owner.equals(req.user._id)))
        throw new Error('forbidden')
      console.log(req.body)
      console.log(typeof req.body)
      console.log(venue)
      const newVenue = Object.assign({}, req.body, {
        owner: req.user._id,
      })
      // req.body.hasOwnProperty('price')
      if(req.s3Data && req.s3Data.Location)
        newVenue.image = req.s3Data.Location
      return venueController.update(req.params.id, newVenue)
    })
    .then(venue => res.status(200).json(venue))
    .catch(err => {
      console.log(err)
      next(err)
    })
})

// destroy
router.delete('/api/venues/:id', bearAuth, (req, res, next) => {
  venueController.read(req.params.id)
    .then(venue => {
      if(!(venue.owner.equals(req.user._id)))
        throw new Error('forbidden')
      return venueController.destroy(req.params.id)
    })
    .then(() => res.status(204).send())
    .catch(err => next(err))
})

module.exports = router
