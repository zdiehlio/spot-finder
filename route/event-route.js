'use strict'

const jsonParser = require('body-parser').json()
const Router = require('express').Router
const router = new Router()

const eventController = require('../controllers/event-controller.js')

const PAGE_LENGTH = 20

router.get('/api/events', (req, res, next) => {
  eventController.index(PAGE_LENGTH, req.query.page)
    .then(page => res.json(page))
    .catch(err => next(err))
})

// create
router.post('/api/events', jsonParser, (req, res, next) => {
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
router.put('/api/events/:id', jsonParser, (req, res, next) => {
  eventController.update(req.params.id, req.body)
    .then(venue => res.status(200).json(venue))
    .catch(err => next(err))
})

// destroy
router.delete('/api/events/:id', (req, res, next) => {
  eventController.destroy(req.params.id)
    .then(() => res.status(204).send())
    .catch(err => next(err))
})

module.exports = router
