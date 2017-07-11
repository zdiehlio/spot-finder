'use strict'

const Profile = require('../model/profile.js')

module.exports = (req, res, next) => {
  const {authorization} = req.headers
  if(!authorization)
    return next(new Error('No Authorization provided'))
  let encoded = authorization.split('Basic ')[1]
  if(!encoded)
    return next(new Error('No Basic auth provided'))
  let decoded = new Buffer(encoded, 'base64').toString()
  let [username, pass] = decoded.split(':')
  if(!username || !pass)
    return next(new Error('no Passord provided'))
  Profile.findOne({username})
    .then(user => {
      if(!user)
        return next(new Error('No user found'))
      return user.passHashCompare(pass)
    })
    .then(user => {
      req.user = user
      next()
    })
    .catch(() => {
      next(new Error('Find failed in Auth middleware'))
    })
}
