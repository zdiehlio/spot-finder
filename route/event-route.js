'use strict'

const jsonParser = require('body-parser').json()
const Router = require('express').Router
const router = new Router()

const bearerAuth = require('../lib/bear-auth-middleware.js')
const eventController = require('../controllers/event-controller.js')

const PAGE_LENGTH = 20

router.get('/api/events', (req, res, next) => {
  eventController.index(PAGE_LENGTH, req.query.page)
    .then(page => res.json(page))
    .catch(err => next(err))
})

// create
router.post('/api/events', jsonParser, bearerAuth, (req, res, next) => {
  req.body.owner = req.user._id
  eventController.create(req.body)
    .then(venue => res.status(201).json(venue))
    .catch(err => next(err))
})

// read
router.get('/api/events/:id', (req, res, next) => {
  eventController.read(req.params.id)
    .then(venue => res.status(200).json(venue))
    .catch(err => next(err))
})

// update
router.put('/api/events/:id', jsonParser, bearerAuth, (req, res, next) => {
  eventController.read(req.params.id)
    .then(event => {
      if(!(event.owner.equals(req.user._id)))
        throw new Error('forbidden')
      return eventController.update(req.params.id, req.body)
    })
    .then(venue => res.status(200).json(venue))
    .catch(err => next(err))
})

// destroy
router.delete('/api/events/:id', bearerAuth, (req, res, next) => {
  eventController.read(req.params.id)
    .then(event => {
      if(!(event.owner.equals(req.user._id)))
        throw new Error('forbidden')
      return eventController.destroy(req.params.id)
    })
    .then(() => res.status(204).send())
    .catch(err => next(err))
})

module.exports = router
