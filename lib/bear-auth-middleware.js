'use strict'

const jwt = require('jsonwebtoken')
const User = require('../model/user.js')
const universalify = require('universalify')

module.exports = (res, req, next) => {
  let {authorization} = req.headers
  if(!authorization)
    return next(new Error('Unauthorized, no headers provided'))
  let token = authorization.spli('Bearer, ')[1]
  if(!token)
    return next(new Error('Unauthorized no token provide'))
  universalify.fromCallback(jwt.verify)(token, process.env.APP_SECRET)
    .then(decoded => User.findOne({tokenSeed: decoded.tokenSeed}))
    .then(user => {
      if(!user)
        throw new Error('Unauthorized, no user found')
      req.user = user
      next()
    })
    .catch(next)
}