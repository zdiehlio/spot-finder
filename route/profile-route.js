'use strict'

// npm modules
const {Router} = require('express')
const jsonParser = require('body-parser').json()

// app modules
const Profile = require('../model/profile.js')

// module logic
const profileRouter = module.exports = new Router()

// module logic
profileRouter.post('/api/profile', jsonParser, (req, res, next) => {
  console.log('hit POST /api/profile')
  new Profile(req.body)
    .save()
    .then(profile => res.json(profile))
    .catch(next)
})
profileRouter.get('/api/profile/:id', (req, res, next) => {
  console.log('GET /api/profile/:id')
  Profile.findById(req.params.id)
    .then(profile => res.json(profile))
    .catch(next)
})
