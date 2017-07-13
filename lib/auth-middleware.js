'use strict'

const User = require('../model/user.js')

module.exports = (req, res, next) => {
  const {authorization} = req.headers
  if(!authorization)
    return next(new Error('No authorization provided'))
  let encoded = authorization.split('Basic ')[1]
  if(!encoded)
    return next(new Error('No authorization provided: no basic auth provided'))
  let decoded = new Buffer(encoded, 'base64')
  decoded = decoded.toString()
  let [username, pass] = decoded.split(':')
  if(!username || !pass)
    return next(new Error('No authorization provided: no assword provided'))
  User.findOne({username})
    .then(user => {
      if(!user)
        return next(new Error('No user found'))
      return user.passHashCompare(pass)
    })
    .catch(err => next(err))
    .then(user => {
      req.user = user
      next()
    })
}
